# HZ changes

A log of changes made to the Herzog Lab website by HZ.

---

## 13 November 2026: Moved Jordan, Peter and Phoebe to an Alumni list

**Branch:** `team-page-update` (not yet committed)
**Live site affected?** No, not until merged into `main`.

1. Removed the profile cards (and profile pages) for **Jordan Apostolov**, **Peter Brederlow** and **Phoebe Bedford**.
2. Added an **Alumni** section directly below the team grid on the team page (`content/authors/_index.md`), listing their names, role, institution and dates as plain text, alphabetical by surname.
3. Removed their entries from `static/bib/people.json`, so their names on publications are no longer links to deleted pages.
4. Removed Peter as "author" on the BSRA 2026 and Epigenomics of Common Diseases event posts (the event summaries still name him).

To add someone to Alumni later: delete their folder in `content/authors/` and add a bullet to the Alumni section in `content/authors/_index.md`.

## 13 November 2026: Team photos on the home page

1. The home page **Meet the team** section now shows a card for every current team member (photo, name and role), 4 per row, ordered by `weight`, above the "View all team members" button. Set in `content/_index.md` (`team-showcase` block).
2. Added two rules to `assets/css/custom.css` that apply to the home page only (class `home-team`): keep 4 cards per row on laptop screens (the theme would otherwise show 3), and hide the short bio line on the cards. The full team page is unchanged.
3. Made the home page cards **about half the size** (all sizing in `assets/css/custom.css` under "home-team"); 4 per row on desktop, 2 per row on phones.
4. Widened the home page team grid slightly so names fit on one line, and made **all cards the same size** (matching the tallest card, the Garden squirrels). Then enlarged the cards and photos by 30%.
5. **Photos are now cropped from the top** of the original (instead of the centre) on both the home page and the full team page, so heads are not cut off. Home page photos are now square so they are not trimmed a second time.
6. Made the home page cards **not clickable** (no link to individual profiles, no hover effect); visitors use "View all team members" instead. This uses a copy of the theme's team template at `layouts/_partials/hbx/blocks/team-showcase/block.html` with a new `link_profiles: false` setting. The full team page still links to profiles. Note: because this template is now a local copy, future theme updates to the team section will not apply automatically.

## 10 November 2026: Added team head shots and bios

## 9 November 2026: Team page restructure and new member profiles

**Branch:** `team-page-update` (saved locally, not yet pushed to GitHub)
**Commit:** `0749b5e`
**Live site affected?** No. These changes go live only once they are merged into `main`.

### Summary

1. Combined all team groupings into one group called **Team Members**.
2. Added a **display order number** (`weight`) to every person, so the order on the team page can be controlled.
3. The **homepage** team section now shows only the "View all team members" button, with no profile cards.
4. Added **six placeholder profiles**: Winnie, Richard, Sheida, Kim, Hazim and Cassie.
5. Moved **Peter Brederlow** to appear after Cassie.

---

### 1. Combined groupings into "Team Members"

**Before:** the team page split people under separate headings: Principal Investigator, Postdoctoral Researchers, Students, Honorary and Alumni.
**After:** everyone appears in one grid with no group headings.

| Person | Old group | New group |
|---|---|---|
| Dr. Chiara Herzog | Principal Investigator | Team Members |
| Peter Brederlow | Students | Team Members |
| Garden squirrels | Honorary | Team Members |
| Phoebe Bedford | Alumni | Team Members |
| Jordan Apostolov | Alumni | Team Members |

**Files changed:**
- `content/authors/_index.md`: the team page now lists only one group, `Team Members`.
- Each person's `content/authors/<name>/_index.md`: the `user_groups:` line was changed to `Team Members`.

> Note: the caption under each name (e.g. "Principal Investigator", "Visiting MSc student") comes from the person's `role:` field. That field was not changed and still shows.

---

### 2. Display order (`weight`)

Previously, people were meant to be sorted by last name, but no profile had a last name set, so the order was unpredictable. Each profile now has a `weight:` number, and the team page is sorted by it (**lower number = shown first**).

| Order | Person | weight |
|---|---|---|
| 1 | Dr. Chiara Herzog | 1 |
| 2 | Winnie | 3 |
| 3 | Richard | 4 |
| 4 | Sheida | 5 |
| 5 | Kim | 6 |
| 6 | Hazim | 7 |
| 7 | Cassie | 8 |
| 8 | Peter Brederlow | 9 |
| 9 | Phoebe Bedford (alumna) | 20 |
| 10 | Jordan Apostolov (alumnus) | 21 |
| 11 | Garden squirrels | 99 |

**Files changed:**
- `content/authors/_index.md`: sorting changed from `Params.last_name` to `Weight`.
- Every `content/authors/<name>/_index.md`: a `weight:` line was added.

**To reorder people in future:** change the `weight:` number in their profile.

---

### 3. Homepage team section

**Before:** the homepage showed profile cards for team members, grouped by role.
**After:** the homepage shows only the "Meet the team" title, intro text and the **View all team members** button, which links to the full team page.

**File changed:** `content/_index.md`. The team section's group list was emptied (`user_groups: []`).

---

### 4. New placeholder profiles

Six new folders were added in `content/authors/`, each following the same format as Peter Brederlow's profile:

| Folder | Name shown |
|---|---|
| `content/authors/winnie/` | Winnie |
| `content/authors/richard/` | Richard |
| `content/authors/sheida/` | Sheida |
| `content/authors/kim/` | Kim |
| `content/authors/hazim/` | Hazim |
| `content/authors/cassie/` | Cassie |

Each folder contains:
- `_index.md`: the profile details.
- `avatar.png`: a grey placeholder silhouette.

**Still to fill in before going live (placeholder text):**
- [ ] Surname (currently first name only)
- [ ] `role:` (currently "Role to be confirmed")
- [ ] `bio:` and the longer biography at the bottom of the file
- [ ] `interests:` (currently Epigenetics, Ageing)
- [ ] Social links: email and LinkedIn are currently switched off (commented out)
- [ ] Photo: replace `avatar.png` with a real photo
- [ ] If they co-author papers, add them to `static/bib/people.json`

The affiliation is set to *Cambridge Stem Cell Institute, University of Cambridge*, the same as Chiara's.

---

### 5. Peter Brederlow moved

Peter's `weight` was changed from 2 to 9, so he now appears directly after Cassie.

**File changed:** `content/authors/peter-brederlow/_index.md`

---

### Not a website change: local setup

To preview the site on this computer, the following were installed in the home folder (`~/.local`): Hugo 0.165.0 (extended), Go, Node 22 and pnpm. These do not affect the website itself.

- Preview locally with `pnpm dev`, then open http://localhost:1313
- Use Hugo **0.165.0**. Version 0.169 fails to build this site.
