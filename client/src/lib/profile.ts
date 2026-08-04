/**
 * Headline figures, in one place.
 *
 * These numbers appear in five sections — the hero metrics, the about stats,
 * the floating portrait chip, the internship stat row and the profile card —
 * and they had already drifted: the site claimed "6+" projects in two places
 * and "10+" in two others, on the same page. A visitor scrolling from the hero
 * to the internship section saw both.
 *
 * Anything quoted in more than one section belongs here, so the next update is
 * a single edit and cannot leave a stale copy behind.
 */

/** Total shipped builds. The Projects section showcases a subset of these. */
export const PROJECTS_SHIPPED = "10+";

/**
 * Completed internships.
 *
 * `Internship.tsx` keeps the timeline entries themselves; this is only the
 * figure the hero, about and profile-card stats quote. Adding an entry to that
 * timeline means bumping this too — it is the one number here that a reader
 * can count for themselves on the page.
 */
export const INTERNSHIPS_COMPLETED = "2";
