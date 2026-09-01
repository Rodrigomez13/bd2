# BearDrive

Aplicación web responsive para el piloto de movilidad urbana de Formosa. La interfaz puede explorarse localmente en modo demo; los viajes reales requieren Supabase, las migraciones de este repositorio y una Edge Function configurada.

## Desarrollo local

1. Instalar las dependencias con `npm install`.
2. Copiar `.env.example` a `.env.local` y cargar únicamente `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` y, opcionalmente, `VITE_MAPBOX_ACCESS_TOKEN`.
3. Ejecutar `npm run dev`.

No coloques claves de servicio, claves privadas de Mapbox, tokens de PSP ni secretos de webhooks en variables `VITE_*`: se exponen al navegador.

## Habilitar viajes reales

1. Crear un proyecto Supabase dedicado y aplicar `supabase/migrations/202608310001_beardrive_secure_foundation.sql` en un entorno de prueba. Revisar primero la zona provisoria de Formosa y las reglas de precio.
2. Configurar Supabase Auth (email/password y URLs de redirección del preview).
3. Desplegar `supabase/functions/create-ride` y guardar `MAPBOX_SERVER_TOKEN` como secreto de Edge Function.
4. Verificar con dos cuentas distintas el alta, creación, asignación, transiciones, RLS, datos ocultos y cancelaciones. Los pagos, SOS, llamadas y matching automático no deben anunciarse como disponibles hasta que sus proveedores y pruebas estén integrados.

## Preview en Vercel

El archivo `vercel.json` deja preparado el build estático de Vite. Antes de ejecutar un preview se necesita vincular el repositorio con un proyecto Vercel autorizado y configurar las variables públicas del entorno Preview. La migración, las Edge Functions y secretos se gestionan en Supabase; no se despliegan desde Vercel.
