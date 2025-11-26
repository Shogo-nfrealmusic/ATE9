-- Adds missing columns used by the Next.js features:
-- 1. `lp_service_items.slug` for service detail routing.
-- 2. `lp_portfolio_items.service_id` for linking portfolio items to services.

begin;

-- 1) slug column on lp_service_items
alter table public.lp_service_items
  add column if not exists slug text;

-- ensure slug has values (fallback to existing id)
update public.lp_service_items
   set slug = coalesce(nullif(slug, ''), id)
 where slug is null or slug = '';

-- add unique constraint for slugs
alter table public.lp_service_items
  add constraint lp_service_items_slug_key unique (slug);

-- 2) service_id column on lp_portfolio_items
alter table public.lp_portfolio_items
  add column if not exists service_id text;

-- optional FK (text id references lp_service_items.id)
alter table public.lp_portfolio_items
  drop constraint if exists lp_portfolio_items_service_id_fkey;

alter table public.lp_portfolio_items
  add constraint lp_portfolio_items_service_id_fkey
  foreign key (service_id)
  references public.lp_service_items(id)
  on delete set null;

commit;

