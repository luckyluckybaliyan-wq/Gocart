# GoCart — E-commerce Storefront

GoCart is a responsive, front-end shopping website built with **HTML, CSS, and vanilla JavaScript**. It is a complete starter project for learning, portfolio demos, and GitHub practice.

## Features

- Responsive storefront for desktop, tablet, and mobile
- Product catalogue with categories, ratings, prices, sale prices, and badges
- Search by product name or category
- Category filtering and sorting by price or rating
- Add-to-cart controls, quantity adjustment, item removal, and subtotal
- Cart saved in browser `localStorage`
- Wishlist toggle
- Newsletter form interaction
- Toast notifications and slide-out cart drawer
- Accessible labels and reduced dependency footprint

## Project structure

```text
GoCart/
├── index.html
├── README.md
├── .gitignore
├── css/
│   └── styles.css
└── js/
    ├── products.js
    └── app.js
```

## Run locally

**Option 1 — VS Code**
1. Extract the ZIP file.
2. Open the `GoCart` folder in VS Code.
3. Install the **Live Server** extension if you do not have it.
4. Right-click `index.html` and choose **Open with Live Server**.

**Option 2 — Browser**
- Open `index.html` directly in a modern browser. Most features work without a build step.

## Upload to GitHub

1. Create a new repository on GitHub, for example `gocart`.
2. Open a terminal inside the extracted `GoCart` folder.
3. Run:

```bash
git init
git add .
git commit -m "Add responsive GoCart e-commerce website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/gocart.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. If the repository already has a remote, check it with `git remote -v` before adding another.

## Important notes

- This is a **front-end demo**, not a production commerce backend.
- Checkout, account sign-in, inventory, and order processing are demo interactions only. Connect a backend and payment provider before accepting real orders.
- Product artwork uses emoji illustrations, so the project runs without a local image asset folder.
- Google Fonts are loaded from the internet; fallback fonts are included.

## Customization

- Edit products and prices in `js/products.js`.
- Change colours, spacing, and responsive styles in `css/styles.css`.
- Add behaviours in `js/app.js`.
- Update page content and metadata in `index.html`.

## License

Use and modify this starter project for personal learning and portfolio work.
