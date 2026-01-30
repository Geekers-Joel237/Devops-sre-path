<?php

use App\Http\Controllers\StatsController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::apiResource('tasks', TaskController::class);
Route::get('stats', [StatsController::class, 'index']);
