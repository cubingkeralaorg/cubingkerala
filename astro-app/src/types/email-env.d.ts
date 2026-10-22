// worker-configuration.d.ts is auto-generated (`npm run generate-types`,
// reads key *names* from .dev.vars — never touched directly here since it
// may hold real secret values). These two don't exist in .dev.vars yet
// (RESEND_API_KEY / EMAIL_UNSUBSCRIBE_SECRET — see the email feature's
// account-setup steps), so this declaration-merges them into the same
// Cloudflare.Env interface in the meantime. Once the real secrets are added
// and types are regenerated, this becomes a harmless duplicate — TypeScript
// allows the same property declared identically across merged interfaces.
declare namespace Cloudflare {
  interface Env {
    RESEND_API_KEY: string;
    EMAIL_UNSUBSCRIBE_SECRET: string;
  }
}
