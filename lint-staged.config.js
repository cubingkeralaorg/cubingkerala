// Plain lint-staged config (not the `lint-staged` field in package.json) so
// we can filter staged files with real JS instead of a single glob pattern.
//
// Why this exists: `astro-app/` is a separate Astro project (see its own
// AGENTS.md) that intentionally doesn't use this repo's Next.js ESLint
// config (`next/core-web-vitals` — its `no-img-element`/`no-html-link-for-pages`
// rules don't apply to Astro code, which has no next/image or next/link).
// `.eslintrc.json` already has `ignorePatterns: ["astro-app/"]` for that, but
// ESLint still emits a "file ignored" warning for every file explicitly
// passed on the command line that matches an ignore pattern — and
// `--max-warnings 0` counts those warnings too, failing the commit even
// though there are zero real problems. The fix is to never pass astro-app
// files to eslint in the first place, not to rely on ESLint ignoring them.
module.exports = {
  "*.{js,jsx,ts,tsx}": (filenames) => {
    const files = filenames.filter((file) => !file.includes("/astro-app/"));
    if (files.length === 0) return [];
    return `eslint --fix --max-warnings 0 ${files.map((file) => `"${file}"`).join(" ")}`;
  },
};
