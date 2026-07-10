# THE 312 RP — Dossier Wiki

A React + Tailwind site for weapon/drug catalog, skill tree, and supply drop info.
Deploys automatically to GitHub Pages on every push to `main`.

## First-time setup

1. **Create the GitHub repo** and push this folder to it:
   ```bash
   cd icg-wiki
   git init
   git add .
   git commit -m "initial site"
   gh repo create the-312-rp-wiki --public --source=. --push
   ```
   (or create the repo on github.com first, then `git remote add origin <url>` and `git push -u origin main`)

2. **Match the base path to your repo name.** Open `vite.config.js` — the `base` value
   must be `/your-repo-name/`. It's currently set to `/the-312-rp-wiki/`. If you name
   the repo something else, update it to match, or the site will load with broken
   asset paths.

3. **Enable Pages via Actions.** In the repo on GitHub: Settings → Pages → under
   "Build and deployment", set Source to **GitHub Actions**. The workflow in
   `.github/workflows/deploy.yml` handles the rest.

4. Push to `main` — the Action builds and deploys automatically. Your site will be
   live at `https://<your-username>.github.io/<repo-name>/`.

## Local development

```bash
npm install
npm run dev
```

Opens a local dev server with hot reload at `http://localhost:5173`.

## Editing content

All the wiki content — weapons, drugs, skill trees — lives in plain JS objects at
the top of `src/App.jsx`:

- `CATALOG` — every weapon/drug item, its tier, rarity class, description, tags
- `SKILLS` — the Faction/Civilian/Illegal Civilian skill trees
- `TIERS` — the tier labels used by the supply drop roller

To add or edit an item, just edit the relevant object and commit — no build step
needed locally, the GitHub Action rebuilds it for you on push.

## Images

Site images (nav badge, hero background collage) live in `public/assets/`.
Referenced in code as `/assets/filename.png`. Swap files here to change the
imagery without touching any JSX.
