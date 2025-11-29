-- upsert_lp_services
--
-- 以前は lp_service_items を全削除してから再作成していたため、
-- 並び替えのたびに lp_service_items.id が変わってしまい、
-- lp_portfolio_items.service_id の参照が壊れていた。
--
-- この修正版では、delete を行わず、id ごとに upsert することで、
-- 既存の ID を維持しつつ sort_order のみを更新する。
create or replace function public.upsert_lp_services(p_services jsonb)
returns void
language plpgsql
as $$
declare
  v_services_id text := coalesce(p_services->>'id', 'default');
  v_intro       text := coalesce(p_services->>'intro', '');
begin
  -- 1. lp_services 本体の upsert
  insert into public.lp_services (id, intro, updated_at)
  values (v_services_id, v_intro, now())
  on conflict (id) do update
    set intro      = excluded.intro,
        updated_at = now();

  -- 2. lp_service_items の upsert
  --
  -- 以前はここで
  --   delete from public.lp_service_items where services_id = v_services_id;
  -- を実行していたため、
  -- 並び替えのたびに lp_service_items が全削除され、
  -- lp_portfolio_items.service_id の参照が壊れていた。
  --
  -- 今回は「削除」は行わず、id ごとに upsert する。
  with items as (
    select
      coalesce(item.value->>'id', concat('svc-', item.ordinality::text)) as id,
      coalesce(
        nullif(item.value->>'slug', ''),
        coalesce(item.value->>'id', concat('svc-', item.ordinality::text))
      ) as slug,
      coalesce(item.value->>'title', '')        as title,
      coalesce(item.value->>'description', '')  as description,
      coalesce(item.value->>'backgroundColor', '#000000') as background_color,
      coalesce(
        (
          select array_agg(gvalue)
          from jsonb_array_elements_text(
            coalesce(item.value->'gallery', '[]'::jsonb)
          ) as gvalue
        ),
        ARRAY[]::text[]
      ) as gallery,
      item.ordinality - 1 as sort_order
    from jsonb_array_elements(
      coalesce(p_services->'items', '[]'::jsonb)
    ) with ordinality as item(value, ordinality)
  )
  insert into public.lp_service_items (
    id,
    services_id,
    slug,
    title,
    description,
    background_color,
    gallery,
    sort_order
  )
  select
    i.id,
    v_services_id,
    i.slug,
    i.title,
    i.description,
    i.background_color,
    i.gallery,
    i.sort_order
  from items i
  on conflict (id) do update
    set services_id      = excluded.services_id,
        slug             = excluded.slug,
        title            = excluded.title,
        description      = excluded.description,
        background_color = excluded.background_color,
        gallery          = excluded.gallery,
        sort_order       = excluded.sort_order;

  -- TODO: UI から削除された item を DB から物理削除するかどうかは未定。
  --       削除する場合は、lp_portfolio_items.service_id との整合性をどう保つか
  --       （NULL にする / 削除を禁止する 等）をユーザーと相談してから実装すること。
end;
$$;

