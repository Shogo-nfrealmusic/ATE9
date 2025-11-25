create or replace function public.upsert_lp_portfolio(p_portfolio jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_portfolio_id text := coalesce(p_portfolio->>'id', 'default');
  v_heading text := coalesce(p_portfolio->>'heading', '');
  v_subheading text := coalesce(p_portfolio->>'subheading', '');
begin
  insert into public.lp_portfolio (id, heading, subheading, updated_at)
  values (v_portfolio_id, v_heading, v_subheading, now())
  on conflict (id) do update
    set heading = excluded.heading,
        subheading = excluded.subheading,
        updated_at = now();

  delete from public.lp_portfolio_items where portfolio_id = v_portfolio_id;

  insert into public.lp_portfolio_items (id, portfolio_id, title, description, image_url, link_url, sort_order)
  select
    coalesce(item.value->>'id', concat('pf-', item.ordinality::text)),
    v_portfolio_id,
    coalesce(item.value->>'title', ''),
    coalesce(item.value->>'description', ''),
    coalesce(item.value->>'imageUrl', ''),
    nullif(item.value->>'linkUrl', ''),
    item.ordinality - 1
  from jsonb_array_elements(coalesce(p_portfolio->'items', '[]'::jsonb)) with ordinality as item(value, ordinality);
end;
$$;

