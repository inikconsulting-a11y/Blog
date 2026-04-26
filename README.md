# Blog/Portfolio Photographe

Application Node.js (Express + EJS + SQLite) pour gérer un site vitrine, portfolio albums et blog, avec un back-office admin.

## Stack
- Frontend: EJS + CSS responsive
- Backend: Express (MVC léger)
- DB: SQLite (`better-sqlite3`)
- Upload images: Multer + Sharp (conversion webp)

## Lancer
```bash
cp .env.example .env
npm install
npm run migrate
npm run seed
npm run dev
```

Accès admin: `/admin/login` avec `ADMIN_EMAIL` et `ADMIN_PASSWORD`.

## Structure
- `src/controllers`: logique métier contrôleurs public/admin
- `src/models`: accès DB
- `src/routes`: routes public/admin
- `src/views`: pages EJS client + admin
- `src/utils/upload.js`: upload sécurisé + optimisation image
- `src/db/migrate.js`: tables demandées
