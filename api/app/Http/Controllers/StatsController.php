<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Support\Facades\Cache;

class StatsController extends Controller
{
    public function index()
    {
        $stats = Cache::remember('task_stats', 300, function () {
            return [
                'total_tasks' => Task::count(),
                'completed_tasks' => Task::where('is_completed', true)->count(),
                'pending_tasks' => Task::where('is_completed', false)->count(),
            ];
        });

        return response()->json($stats);
    }
}
