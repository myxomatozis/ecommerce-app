# The Folk - React Ecommerce App

A modern, lightweight ecommerce application built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🛍️ Product catalog with search and filters
- 🛒 Shopping cart with persistent state
- 💳 Stripe checkout integration
- 📱 Responsive design
- ⚡ Fast performance with Vite
- 🎨 Beautiful UI with Tailwind CSS
- 🔒 Secure with Supabase backend
- 📦 No authentication required for shopping

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (without PostCSS)
- **Backend**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Quick Start

1. **Clone and install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Fill in your Supabase and Stripe credentials.

3. **Set up Supabase database:**

   - Run the SQL schema from the database setup files
   - Configure Row Level Security policies

4. **Start development server:**

   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components (Header, Footer)
│   ├── Cart/           # Cart-related components
│   └── UI/             # Generic UI components
├── contexts/           # React contexts (Cart, etc.)
├── pages/              # Page components
└── utils/              # Helper functions
```

## Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
VITE_API_URL=your_api_endpoint_url
```

## Configuration Changes

### Removed PostCSS

This project now uses Tailwind CSS directly through Vite without PostCSS for simplicity:

- Removed `postcss.config.js`
- Removed `autoprefixer` and `postcss` dependencies
- Tailwind processing is handled directly by Vite

### Files Structure

```
modern-ecommerce/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js         # Tailwind configuration
├── tsconfig.json
├── tsconfig.node.json
├── .eslintrc.cjs
├── .env.example
├── .gitignore
├── README.md
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css               # Tailwind directives
    ├── components/
    ├── contexts/
    └── pages/
```

## Deployment

This app can be deployed as static assets to:

- Vercel
- Netlify
- Cloudflare Pages
- Any static hosting service

The serverless functions for Stripe checkout can be deployed to:

- Vercel Functions
- Netlify Functions
- Supabase Edge Functions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
