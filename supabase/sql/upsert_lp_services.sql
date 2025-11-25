create or replace function public.upsert_lp_services(p_services jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_services_id text := coalesce(p_services->>'id', 'default');
  v_intro text := coalesce(p_services->>'intro', '');
begin
  insert into public.lp_services (id, intro, updated_at)
  values (v_services_id, v_intro, now())
  on conflict (id) do update
    set intro = excluded.intro,
        updated_at = now();

  delete from public.lp_service_items where services_id = v_services_id;

  insert into public.lp_service_items (id, services_id, title, description, background_color, gallery, sort_order)
  select
    coalesce(item.value->>'id', concat('svc-', item.ordinality::text)),
    v_services_id,
    coalesce(item.value->>'title', ''),
    coalesce(item.value->>'description', ''),
    coalesce(item.value->>'backgroundColor', '#000000'),
    coalesce(
      (
        select array_agg(gvalue)
        from jsonb_array_elements_text(coalesce(item.value->'gallery', '[]'::jsonb)) as gvalue
      ),
      ARRAY[]::text[]
    ),
    item.ordinality - 1
  from jsonb_array_elements(coalesce(p_services->'items', '[]'::jsonb)) with ordinality as item(value, ordinality);
end;
$$;

