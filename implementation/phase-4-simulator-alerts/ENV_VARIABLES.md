# Phase 4 — Environment Variables

Add these to `.env.local` (in addition to Phase 1+2+3 variables).

---

```env
# ============================================================
# WEB PUSH NOTIFICATIONS (VAPID)
# ============================================================
# Generate with: npx web-push generate-vapid-keys
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxQ
VAPID_PRIVATE_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VAPID_SUBJECT=mailto:admin@aether.ph

# ============================================================
# RESEND (Transactional Email)
# ============================================================
# Get from: https://resend.com → API Keys
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=AETHER <digest@aether.ph>

# ============================================================
# ALERTS CONFIGURATION
# ============================================================
ALERT_CHECK_INTERVAL=300000         # Check triggers every 5 minutes (ms)
MAX_ALERTS_FREE=10                   # Free tier alert limit
MAX_ALERTS_PRO=50                    # Pro tier alert limit

# ============================================================
# WEEKLY DIGEST
# ============================================================
DIGEST_SEND_DAY=1                    # Monday (0=Sunday, 1=Monday...)
DIGEST_SEND_HOUR=8                   # 8 AM Philippine time (UTC+8)
```

---

## .env.example additions

```env
# Phase 4
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:admin@yourdomain.com
RESEND_API_KEY=
RESEND_FROM_EMAIL=AETHER <digest@yourdomain.com>
ALERT_CHECK_INTERVAL=300000
MAX_ALERTS_FREE=10
MAX_ALERTS_PRO=50
DIGEST_SEND_DAY=1
DIGEST_SEND_HOUR=8
```

---

## Security Notes

- `VAPID_PRIVATE_KEY` is server-only — NEVER prefix with `NEXT_PUBLIC_`
- `RESEND_API_KEY` is server-only
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` is safe to expose (this is the public key)
- Push subscriptions contain user PII — store securely with RLS
