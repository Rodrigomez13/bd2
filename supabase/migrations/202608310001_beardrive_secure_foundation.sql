-- BearDrive foundation: apply to a new Supabase project before enabling live trips.
-- The Formosa polygon below is an operational placeholder and must be replaced by
-- an official, legally approved service boundary before launch.

create extension if not exists pgcrypto;
create extension if not exists postgis;

create type public.beardrive_role as enum ('PASSENGER', 'DRIVER', 'ADMIN', 'SUPPORT');
create type public.driver_review_status as enum ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED');
create type public.ride_status as enum ('SEARCHING_DRIVER', 'DRIVER_ASSIGNED', 'DRIVER_ARRIVING', 'DRIVER_ARRIVED', 'TRIP_STARTED', 'TRIP_COMPLETED', 'PAYMENT_PENDING', 'COMPLETED', 'CANCELLED');
create type public.service_type as enum ('BEAR_FLASH', 'BEAR_STANDARD', 'BEAR_PREMIUM', 'BEAR_GREEN');
create type public.payment_status as enum ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(trim(full_name)) between 2 and 120),
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role public.beardrive_role not null,
  created_at timestamptz not null default now(),
  primary key (profile_id, role)
);

create table public.drivers (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  review_status public.driver_review_status not null default 'PENDING',
  is_online boolean not null default false,
  rating numeric(3,2) not null default 5 check (rating between 1 and 5),
  completed_rides integer not null default 0 check (completed_rides >= 0),
  last_location geography(point, 4326),
  updated_at timestamptz not null default now()
);

create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.drivers(profile_id) on delete cascade,
  make text not null check (char_length(trim(make)) between 1 and 60),
  model text not null check (char_length(trim(model)) between 1 and 60),
  year smallint not null check (year between 1990 and 2100),
  plate text not null unique check (char_length(trim(plate)) between 5 and 12),
  service_type public.service_type not null default 'BEAR_STANDARD',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.driver_documents (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.drivers(profile_id) on delete cascade,
  document_type text not null check (document_type in ('IDENTITY', 'LICENSE_D1', 'VEHICLE_REGISTRATION', 'INSURANCE', 'BACKGROUND_CHECK', 'EXPLOITATION_PERMIT', 'PROFILE_PHOTO')),
  storage_path text not null unique,
  expires_at date,
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id),
  rejection_reason text check (char_length(rejection_reason) <= 500),
  created_at timestamptz not null default now(),
  unique (driver_id, document_type)
);

create table public.service_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  city text not null,
  province text not null,
  boundary geography(multipolygon, 4326) not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.pricing_rules (
  id uuid primary key default gen_random_uuid(),
  zone_id uuid not null references public.service_zones(id) on delete cascade,
  service_type public.service_type not null,
  base_fare_cents integer not null check (base_fare_cents >= 0),
  price_per_km_cents integer not null check (price_per_km_cents >= 0),
  price_per_minute_cents integer not null check (price_per_minute_cents >= 0),
  minimum_fare_cents integer not null check (minimum_fare_cents >= 0),
  booking_fee_cents integer not null default 0 check (booking_fee_cents >= 0),
  active boolean not null default true,
  updated_at timestamptz not null default now(),
  unique (zone_id, service_type)
);

create table public.rides (
  id uuid primary key default gen_random_uuid(),
  passenger_id uuid not null references public.profiles(id),
  driver_id uuid references public.drivers(profile_id),
  vehicle_id uuid references public.vehicles(id),
  zone_id uuid not null references public.service_zones(id),
  service_type public.service_type not null,
  pickup geography(point, 4326) not null,
  pickup_address text not null,
  destination geography(point, 4326) not null,
  destination_address text not null,
  estimated_distance_meters integer not null check (estimated_distance_meters > 0),
  estimated_duration_seconds integer not null check (estimated_duration_seconds > 0),
  fare_cents integer not null check (fare_cents >= 0),
  status public.ride_status not null default 'SEARCHING_DRIVER',
  status_version integer not null default 0,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ride_locations (
  id bigint generated always as identity primary key,
  ride_id uuid not null references public.rides(id) on delete cascade,
  actor_id uuid not null references public.profiles(id),
  location geography(point, 4326) not null,
  recorded_at timestamptz not null default now(),
  check (actor_id is not null)
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid not null unique references public.rides(id) on delete cascade,
  provider text not null,
  provider_reference text unique,
  status public.payment_status not null default 'PENDING',
  amount_cents integer not null check (amount_cents >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index drivers_available_location_idx on public.drivers using gist(last_location) where is_online and review_status = 'APPROVED';
create index rides_passenger_created_idx on public.rides(passenger_id, created_at desc);
create index rides_driver_created_idx on public.rides(driver_id, created_at desc);
create index rides_status_created_idx on public.rides(status, created_at desc);
create index ride_locations_ride_recorded_idx on public.ride_locations(ride_id, recorded_at desc);

create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), 'Usuario BearDrive'));
  insert into public.user_roles (profile_id, role) values (new.id, 'PASSENGER');
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create function public.has_role(p_role public.beardrive_role) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where profile_id = auth.uid() and role = p_role)
$$;
create function public.is_staff() returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role('ADMIN') or public.has_role('SUPPORT')
$$;

create function public.limit_driver_vehicles() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.vehicles where driver_id = new.driver_id) >= 3 then
    raise exception 'a driver can register at most three vehicles';
  end if;
  return new;
end;
$$;
create trigger before_insert_limit_driver_vehicles before insert on public.vehicles for each row execute procedure public.limit_driver_vehicles();

create function public.quote_ride(
  p_pickup_lat double precision, p_pickup_lng double precision,
  p_service_type public.service_type, p_distance_meters integer, p_duration_seconds integer
) returns table(zone_id uuid, fare_cents integer)
language plpgsql stable security definer set search_path = public as $$
declare v_zone public.service_zones; v_rule public.pricing_rules; v_fare numeric;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if p_pickup_lat not between -90 and 90 or p_pickup_lng not between -180 and 180 or p_distance_meters not between 100 and 200000 or p_duration_seconds not between 60 and 28800 then
    raise exception 'invalid ride quote input';
  end if;
  select * into v_zone from public.service_zones z
    where z.active and st_covers(z.boundary, st_setsrid(st_makepoint(p_pickup_lng, p_pickup_lat), 4326)::geography)
    limit 1;
  if v_zone.id is null then raise exception 'pickup outside active service zone'; end if;
  select * into v_rule from public.pricing_rules r where r.zone_id = v_zone.id and r.service_type = p_service_type and r.active;
  if v_rule.id is null then raise exception 'pricing unavailable'; end if;
  v_fare := greatest(v_rule.minimum_fare_cents,
    v_rule.base_fare_cents + (p_distance_meters::numeric / 1000) * v_rule.price_per_km_cents + (p_duration_seconds::numeric / 60) * v_rule.price_per_minute_cents
  ) + v_rule.booking_fee_cents;
  return query select v_zone.id, round(v_fare)::integer;
end;
$$;

create function public.create_ride_request(
  p_pickup_lat double precision, p_pickup_lng double precision, p_pickup_address text,
  p_destination_lat double precision, p_destination_lng double precision, p_destination_address text,
  p_service_type public.service_type, p_distance_meters integer, p_duration_seconds integer
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_quote record; v_ride_id uuid;
begin
  if auth.uid() is null or not public.has_role('PASSENGER') then raise exception 'passenger access required'; end if;
  if length(trim(p_pickup_address)) < 3 or length(trim(p_destination_address)) < 3 then raise exception 'invalid address'; end if;
  select * into v_quote from public.quote_ride(p_pickup_lat, p_pickup_lng, p_service_type, p_distance_meters, p_duration_seconds);
  if not exists (select 1 from public.service_zones where id = v_quote.zone_id and st_covers(boundary, st_setsrid(st_makepoint(p_destination_lng, p_destination_lat), 4326)::geography)) then
    raise exception 'destination outside active service zone';
  end if;
  insert into public.rides(passenger_id, zone_id, service_type, pickup, pickup_address, destination, destination_address, estimated_distance_meters, estimated_duration_seconds, fare_cents)
  values (auth.uid(), v_quote.zone_id, p_service_type, st_setsrid(st_makepoint(p_pickup_lng, p_pickup_lat), 4326)::geography, trim(p_pickup_address), st_setsrid(st_makepoint(p_destination_lng, p_destination_lat), 4326)::geography, trim(p_destination_address), p_distance_meters, p_duration_seconds, v_quote.fare_cents)
  returning id into v_ride_id;
  return v_ride_id;
end;
$$;

create function public.transition_ride(p_ride_id uuid, p_expected_version integer, p_next_status public.ride_status)
returns integer language plpgsql security definer set search_path = public as $$
declare v_ride public.rides; v_allowed boolean := false;
begin
  select * into v_ride from public.rides where id = p_ride_id for update;
  if v_ride.id is null then raise exception 'ride not found'; end if;
  if v_ride.status_version <> p_expected_version then raise exception 'ride was updated by another client'; end if;
  v_allowed := (v_ride.passenger_id = auth.uid() and v_ride.status in ('SEARCHING_DRIVER','DRIVER_ASSIGNED','DRIVER_ARRIVING','DRIVER_ARRIVED') and p_next_status = 'CANCELLED')
    or (v_ride.driver_id = auth.uid() and ((v_ride.status = 'DRIVER_ASSIGNED' and p_next_status = 'DRIVER_ARRIVING') or (v_ride.status = 'DRIVER_ARRIVING' and p_next_status = 'DRIVER_ARRIVED') or (v_ride.status = 'DRIVER_ARRIVED' and p_next_status = 'TRIP_STARTED') or (v_ride.status = 'TRIP_STARTED' and p_next_status = 'TRIP_COMPLETED')))
    or (public.is_staff() and p_next_status = 'CANCELLED');
  if not v_allowed then raise exception 'invalid ride transition'; end if;
  update public.rides set status = p_next_status, status_version = status_version + 1,
    started_at = case when p_next_status = 'TRIP_STARTED' then now() else started_at end,
    completed_at = case when p_next_status = 'TRIP_COMPLETED' then now() else completed_at end,
    updated_at = now() where id = v_ride.id;
  return v_ride.status_version + 1;
end;
$$;

create function public.update_driver_availability(p_is_online boolean, p_latitude double precision default null, p_longitude double precision default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null or not public.has_role('DRIVER') then raise exception 'driver access required'; end if;
  if not exists (select 1 from public.drivers where profile_id = auth.uid() and review_status = 'APPROVED') then raise exception 'approved driver access required'; end if;
  if (p_latitude is null) <> (p_longitude is null) or (p_latitude is not null and (p_latitude not between -90 and 90 or p_longitude not between -180 and 180)) then raise exception 'invalid location'; end if;
  update public.drivers set is_online = p_is_online,
    last_location = case when p_latitude is null then last_location else st_setsrid(st_makepoint(p_longitude, p_latitude), 4326)::geography end,
    updated_at = now() where profile_id = auth.uid();
end;
$$;

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.drivers enable row level security;
alter table public.vehicles enable row level security;
alter table public.driver_documents enable row level security;
alter table public.service_zones enable row level security;
alter table public.pricing_rules enable row level security;
alter table public.rides enable row level security;
alter table public.ride_locations enable row level security;
alter table public.payments enable row level security;

create policy "profiles own or staff" on public.profiles for select using (id = auth.uid() or public.is_staff());
create policy "profiles owner update" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "roles own or staff" on public.user_roles for select using (profile_id = auth.uid() or public.is_staff());
create policy "drivers own or staff" on public.drivers for select using (profile_id = auth.uid() or public.is_staff());
create policy "vehicles owner or staff" on public.vehicles for select using (driver_id = auth.uid() or public.is_staff());
create policy "documents owner or staff" on public.driver_documents for select using (driver_id = auth.uid() or public.is_staff());
create policy "active zones readable" on public.service_zones for select using (active or public.is_staff());
create policy "active pricing readable" on public.pricing_rules for select using (active or public.is_staff());
create policy "ride participants or staff" on public.rides for select using (passenger_id = auth.uid() or driver_id = auth.uid() or public.is_staff());
create policy "location participants or staff" on public.ride_locations for select using (exists (select 1 from public.rides r where r.id = ride_id and (r.passenger_id = auth.uid() or r.driver_id = auth.uid() or public.is_staff())));
create policy "payment participants or staff" on public.payments for select using (exists (select 1 from public.rides r where r.id = ride_id and (r.passenger_id = auth.uid() or r.driver_id = auth.uid() or public.is_staff())));

revoke all on all tables in schema public from anon, authenticated;
grant select on public.service_zones, public.pricing_rules to authenticated;
grant execute on function public.quote_ride(double precision, double precision, public.service_type, integer, integer) to authenticated;
grant execute on function public.create_ride_request(double precision, double precision, text, double precision, double precision, text, public.service_type, integer, integer) to authenticated;
grant execute on function public.transition_ride(uuid, integer, public.ride_status) to authenticated;
grant execute on function public.update_driver_availability(boolean, double precision, double precision) to authenticated;

insert into public.service_zones(name, city, province, boundary) values
  ('Formosa Capital - provisional', 'Formosa', 'Formosa', st_geogfromtext('MULTIPOLYGON(((-58.245 -26.235, -58.105 -26.235, -58.105 -26.105, -58.245 -26.105, -58.245 -26.235)))'));
