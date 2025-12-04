# Slovenski nepremičninski skavt

## Namestitev baze
- Ustvari MySQL bazo s skripto: `mysql -u USER -p < backend/sql/schema.sql` (posodobi uporabnika po potrebi).
- V datoteki `backend/api/config.php` nastavi `dbHost`, `dbName`, `dbUser`, `dbPass` glede na tvoje okolje.

## Zagon frontenda (Vite + React)
- `cd frontend`
- `npm install`
- `npm run dev` za lokalni razvoj (privzeto na http://localhost:5173).
- `npm run build` zgradi produkcijske statične datoteke v `frontend/dist`.

## Namestitev na Apache
- Vsebino iz `frontend/dist` skopiraj v spletni koren (npr. `/var/www/html/`).
- PHP API naj bo dosegljiv pod `/api/` (npr. `/var/www/html/api/` vsebuje datoteke iz `backend/api/`).
- Endpointi, ki jih frontend kliče: `/api/auth_register.php`, `/api/auth_login.php`, `/api/auth_logout.php`, `/api/auth_me.php`, `/api/profile_get.php`, `/api/profile_save.php`.
