# Todo App API

Backend API for the Todo App built with Laravel.

## Features

- RESTful API for managing tasks
- Endpoints:
  - `GET /api/tasks` - List all tasks
  - `POST /api/tasks` - Create a new task
  - `PUT /api/tasks/{id}` - Update a task (mark as completed)
  - `DELETE /api/tasks/{id}` - Delete a task

## Setup

1. Install dependencies:
   ```bash
   composer install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. Run migrations:
   ```bash
   php artisan migrate
   ```

4. Start the server:
   ```bash
   php artisan serve
   ```

The API will be available at `http://localhost:8000`.
