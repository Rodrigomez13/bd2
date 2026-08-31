export type MapProvider = 'mapbox' | 'openstreetmap'

export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string | undefined

export const activeMapProvider: MapProvider = MAPBOX_TOKEN ? 'mapbox' : 'openstreetmap'

export const mapProviderLabel = MAPBOX_TOKEN
  ? 'Mapbox listo'
  : 'Mapbox demo · OSM fallback'

export function getMapboxGeocodingUrl(query: string) {
  if (!MAPBOX_TOKEN) return null
  return `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&language=es&country=ar`
}

export function getMapboxDirectionsUrl(origin: [number, number], destination: [number, number]) {
  if (!MAPBOX_TOKEN) return null
  return `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.join(',')};${destination.join(',')}?access_token=${MAPBOX_TOKEN}&geometries=geojson&language=es`
}
