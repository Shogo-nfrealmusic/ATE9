-- upsert_lp_portfolio_for_service
-- 旧 upsert_lp_portfolio では portfolio_id 単位で全件 delete → insert していた。
-- この関数は (portfolio_id, service_id) の組に限定して削除・挿入することで、
-- 他サービスの lp_portfolio_items を巻き込まないようにしている。
create or replace function public.upsert_lp_portfolio_for_service(
    p_portfolio_id text,
    p_service_id text,
    p_items jsonb
) returns void
language plpgsql
as $function$
begin
    delete from public.lp_portfolio_items
    where portfolio_id = p_portfolio_id
      and (
        (p_service_id is null and service_id is null)
        or (p_service_id is not null and service_id = p_service_id)
      );

    insert into public.lp_portfolio_items (
        id,
        portfolio_id,
        title,
        description,
        image_url,
        link_url,
        sort_order,
        service_id
    )
    select
        coalesce(nullif(item.value->>'id', ''), concat('pf-', item.ordinality::text)),
        p_portfolio_id,
        coalesce(item.value->>'title', ''),
        coalesce(item.value->>'description', ''),
        coalesce(item.value->>'imageUrl', ''),
        nullif(item.value->>'linkUrl', ''),
        item.ordinality - 1,
        p_service_id
    from jsonb_array_elements(coalesce(p_items, '[]'::jsonb)) with ordinality as item(value, ordinality);
end;
$function$;

