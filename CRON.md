# Cron

Localhost cron execution example:

```
curl -k -fsS -X POST "https://zbav-se.me.localhost:1355/api/cron/hourly" --connect-to "zbav-se.me.localhost:1355:host.docker.internal:1355" -H "Host: zbav-se.me.localhost" -H "Authorization: Bearer dev-cron-secret" -H "Content-Type: application/json" --connect-timeout 2 --max-time 30 -d '{}'
```
