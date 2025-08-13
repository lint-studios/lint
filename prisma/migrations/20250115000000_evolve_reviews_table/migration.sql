-- 1) Rename provider timestamp column to the canonical name.
alter table public.reviews
  rename column "reviewDate" to "createdAtRemote";

-- 2) Add provider-side timestamps & product fields we'll use.
alter table public.reviews
  add column if not exists "updatedAtRemote"   timestamp null,
  add column if not exists "publishedAtRemote" timestamp null,
  add column if not exists "productExternalId" text null,
  add column if not exists "productHandle"     text null;

-- 3) Make "verified" nullable (Judge.me can send either verified or verified_buyer or nothing).
alter table public.reviews
  alter column verified drop not null,
  alter column verified drop default;

-- 4) Normalize source default spelling (optional; works either way).
alter table public.reviews
  alter column source set default 'judgeme';

-- 5) Add media + raw payload columns (jsonb).
alter table public.reviews
  add column if not exists media jsonb null;

alter table public.reviews
  add column if not exists raw jsonb null;

-- 6) If you previously stored JSON as text in "rawData", migrate & drop it safely.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='reviews' and column_name='rawData'
  ) then
    -- Best effort conversion; will fail only if rawData contains invalid JSON.
    begin
      update public.reviews set raw = "rawData"::jsonb
      where "rawData" is not null and "rawData" <> '';
    exception when others then
      -- if conversion fails in dev, just leave raw null; you can clean later
      raise notice 'Skipping rawData -> raw conversion due to invalid JSON';
    end;
    alter table public.reviews drop column "rawData";
  end if;
end$$;

-- 7) Helpful indexes for common reads.
create index if not exists reviews_org_created_remote_idx
  on public.reviews ("organizationId", "createdAtRemote");

create index if not exists reviews_org_rating_idx
  on public.reviews ("organizationId", rating);

create index if not exists reviews_org_product_idx
  on public.reviews ("organizationId", "productId");
