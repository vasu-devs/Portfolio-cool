// Browser-only (content.ts is also read by the agent server, which has no import.meta.env).
/** A file in public/, wherever the site is mounted (/ locally, /new/ on the live site). */
export const asset = (path: string) => import.meta.env.BASE_URL + path;
