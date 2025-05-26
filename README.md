# forsit-dashboard

A modern, production-ready dashboard built with Vue 3, Vite, and Pinia. Features include responsive layouts, inventory management, revenue analysis, product registration, and persistent state with localStorage.

## Project Structure

- **src/** — Main source code directory
  - **App.vue** — Root Vue component, handles layout and responsive sidebar
  - **main.js** — App entry point, initializes Vue, Pinia, and router
  - **assets/** — Global CSS and static assets
    - **base.css, main.css** — Global and theme styles
    - **logo.svg** — App logo
  - **components/** — Reusable Vue components
    - **icons/** — SVG icon components used throughout the UI
  - **routing/**
    - **router.js** — Application routes configuration
  - **store/**
    - **store.js** — Pinia store for global state management (products, categories, etc.)
  - **views/** — Main app pages (routed views)
    - **InventoryManagement.vue** — Inventory table/list, stock updates, responsive
    - **ProductRegistration.vue** — Product add form, Unsplash image support
    - **RevenueAnalysis.vue** — Revenue, orders, and inventory charts/analytics

- **public/** — Static files served as-is
  - **favicon.ico** — App favicon

- **index.html** — Main HTML file for Vite
- **package.json** — Project dependencies and scripts
- **vite.config.js** — Vite configuration
- **README.md** — Project documentation (this file)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
