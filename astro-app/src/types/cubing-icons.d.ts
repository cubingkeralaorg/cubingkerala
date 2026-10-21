// @cubing/icons' package.json only exposes a `types` condition for the
// "./js" subpath — the "." export we actually import (for its CSS side
// effect, `import "@cubing/icons";`) has none, which some editors'
// TS language servers flag even though `tsc --noEmit` resolves it fine.
declare module "@cubing/icons";
