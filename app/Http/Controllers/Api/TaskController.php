<?php

namespace App\Http\Controllers\Api;

use App\Models\Task;
use Illuminate\Http\Request;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Services\TaskService;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class TaskController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct(private TaskService $taskService)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         $tasks = $this->taskService->list($request->only([
            'status', 'priority', 'search', 'sort_by', 'sort_dir',
        ]));

        return TaskResource::collection($tasks);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request): TaskResource
    {
        $task = $this->taskService->create($request->validated());
        return new TaskResource($task);    
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task): TaskResource
    {
        $task = $this->taskService->update($task, $request->validated());
        return new TaskResource($task);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task): JsonResponse
    {
        $task->delete();
        return response()->json(['message' => 'Task deleted successfully.']);
    }
}
