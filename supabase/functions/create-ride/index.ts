import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type CreateRideInput = {
  pickup: { lat: number; lng: number; address: string };
  destination: { lat: number; lng: number; address: string };
  serviceType: 'BEAR_FLASH' | 'BEAR_STANDARD' | 'BEAR_PREMIUM' | 'BEAR_GREEN';
};

const isCoordinate = (value: unknown, min: number, max: number) => typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return Response.json({ error: 'method not allowed' }, { status: 405, headers: corsHeaders });

  const authorization = request.headers.get('Authorization');
  if (!authorization) return Response.json({ error: 'authentication required' }, { status: 401, headers: corsHeaders });

  try {
    const input = await request.json() as CreateRideInput;
    if (!input?.pickup || !input?.destination || !isCoordinate(input.pickup.lat, -90, 90) || !isCoordinate(input.pickup.lng, -180, 180) || !isCoordinate(input.destination.lat, -90, 90) || !isCoordinate(input.destination.lng, -180, 180) || input.pickup.address.trim().length < 3 || input.destination.address.trim().length < 3) {
      return Response.json({ error: 'invalid ride data' }, { status: 400, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const mapboxToken = Deno.env.get('MAPBOX_SERVER_TOKEN');
    if (!mapboxToken) return Response.json({ error: 'routing service is not configured' }, { status: 503, headers: corsHeaders });

    const supabase = createClient(supabaseUrl, supabaseAnonKey, { global: { headers: { Authorization: authorization } } });
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) return Response.json({ error: 'invalid session' }, { status: 401, headers: corsHeaders });

    const coordinates = `${input.pickup.lng},${input.pickup.lat};${input.destination.lng},${input.destination.lat}`;
    const routeResponse = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?overview=false&access_token=${encodeURIComponent(mapboxToken)}`);
    if (!routeResponse.ok) return Response.json({ error: 'route could not be calculated' }, { status: 422, headers: corsHeaders });
    const routePayload = await routeResponse.json();
    const route = routePayload.routes?.[0];
    if (!route || !Number.isFinite(route.distance) || !Number.isFinite(route.duration)) return Response.json({ error: 'invalid route response' }, { status: 422, headers: corsHeaders });

    const { data: rideId, error: createError } = await supabase.rpc('create_ride_request', {
      p_pickup_lat: input.pickup.lat,
      p_pickup_lng: input.pickup.lng,
      p_pickup_address: input.pickup.address.trim(),
      p_destination_lat: input.destination.lat,
      p_destination_lng: input.destination.lng,
      p_destination_address: input.destination.address.trim(),
      p_service_type: input.serviceType,
      p_distance_meters: Math.round(route.distance),
      p_duration_seconds: Math.round(route.duration),
    });
    if (createError) return Response.json({ error: createError.message }, { status: 422, headers: corsHeaders });

    return Response.json({ rideId }, { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch {
    return Response.json({ error: 'invalid request' }, { status: 400, headers: corsHeaders });
  }
});
