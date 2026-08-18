# Cubing Kerala — domain glossary

Use these names in code, tests, and docs. Architecture vocabulary (**module**, **interface**, **seam**, **adapter**) lives in `.agents/skills/codebase-design/`.

| Term | Meaning |
|---|---|
| **Member** | An approved Cubing Kerala person, keyed by WCA ID |
| **Request** | A pending join request waiting for admin approval |
| **User** | A WCA-authenticated session (cookie `userInfo`) |
| **Competition** | A Kerala WCA competition row cached in Postgres |
| **WCA data** | Cached person payload from the WCA API (`MemberWcaData`) |
| **Rankings** | Member personal-best table derived from cached WCA data |
| **Admin** | The WCA account allowed to manage requests (`ADMIN_WCA_ID` / `ADMIN_USER_ID` in env) |

## Where things live

| Need | Look in |
|---|---|
| A page or API route | `src/app/` |
| Feature UI | `src/components/<feature>/` |
| shadcn primitives | `src/components/ui/` |
| Navbar / footer | `src/components/layout/` |
| Server: DB, WCA sync, caches | `src/lib/` |
| Browser calls to our API routes | `src/services/` |
| Pure helpers | `src/utils/` |
| Site constants | `src/config/` |
| Shared types | `src/types/` |
