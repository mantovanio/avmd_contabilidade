#!/bin/bash
set -e
cd /opt/certiid
git pull origin main
export $(grep -v '^#' .env | xargs)
docker build \
  --build-arg "VITE_SUPABASE_URL=$VITE_SUPABASE_URL" \
  --build-arg "VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY" \
  -t certiid:latest .
docker stack rm certiid 2>/dev/null || true
sleep 10
docker stack deploy -c docker-compose.yml certiid
