# Portfolio React Migration

This root directory now runs as a Vite + React portfolio app while keeping the existing assets in `Assets/`.

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

## Build for production

```bash
npm run build
```

## Notes

- `src/App.jsx` contains the full portfolio UI and interactions.
- `style.css` keeps the existing visual system and loader skeleton styles.
- `index.html` now mounts React through `src/main.jsx`.