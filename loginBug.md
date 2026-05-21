## 🐛 Bug: Login Succeeds But Redirect to Dashboard Never Happens

### The Problem

After implementing Supabase Auth with Next.js 16 App Router, login appeared
to work (no errors, loading state resolved) but the user was never redirected
to `/dashboard`. No cookies appeared in DevTools → Application → Cookies after
login, and the proxy route protection silently redirected back to login.

### Root Cause

The Supabase client in `lib/supabase.ts` was initialized using `createClient`
from `@supabase/supabase-js`:

```ts
// ❌ Wrong for Next.js App Router
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(url, anonKey);
```

This client stores the session in `localStorage` (browser only). When the
user logs in from a client component, the session is saved to `localStorage`
successfully — which is why there was no error.

However, `proxy.ts` runs on the server and has no access to the browser's
`localStorage`. When it called `supabase.auth.getUser()` to check if the user
was authenticated before allowing access to `/dashboard`, it found no session
and redirected back to login — creating a silent loop.

### The Fix

Replace `createClient` from `@supabase/supabase-js` with `createBrowserClient`
from `@supabase/ssr` in the client-side supabase file:

```ts
// ✅ Correct for Next.js App Router
import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

`createBrowserClient` stores the session in **cookies** instead of
`localStorage`. Cookies are sent with every request, so the server-side
proxy can read the session and correctly allow access to protected routes.

### Rule of Thumb

| Location | Client to use | Package |
|---|---|---|
| Client components (browser) | `createBrowserClient` | `@supabase/ssr` |
| Server components / actions | `createServerClient` | `@supabase/ssr` |
| proxy.ts | `createServerClient` | `@supabase/ssr` |

Never use `createClient` from `@supabase/supabase-js` in a Next.js App Router
project that uses server-side session management or route protection.