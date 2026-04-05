# Task Manager

## Stack
- **PHP** 8.2 / **Laravel** 11
- **Node** v22.12.0 / **React** 18 + Vite
- **MySQL** 8

## Setup
```bash
git clone <repo-url> && cd task-manager
composer install
cp .env.example .env
# Edit .env with your DB credentials
php artisan key:generate
php artisan migrate
npm install && npm run dev
```

## Run Tests
```bash
php artisan test
# or
./vendor/bin/pest
```

## Frontend Stack
React 18 + Axios via Vite.
