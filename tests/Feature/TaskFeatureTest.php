<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TaskFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_cannot_create_task_with_past_due_date(): void
    {
        $response = $this->postJson('/api/tasks', [
            'title'    => 'Past Task',
            'priority' => 'low',
            'due_date' => now()->subDay()->format('Y-m-d'),
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['due_date']);
    }

    public function test_cannot_create_task_with_short_title(): void
    {
        $response = $this->postJson('/api/tasks', [
            'title'    => 'AB',
            'priority' => 'low',
            'due_date' => now()->addDay()->format('Y-m-d'),
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['title']);
    }

    public function test_high_priority_task_must_be_within_7_days(): void
    {
        $response = $this->postJson('/api/tasks', [
            'title'    => 'High Priority Task',
            'priority' => 'high',
            'due_date' => now()->addDays(10)->format('Y-m-d'),
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['due_date']);
    }

    public function test_can_create_valid_task(): void
    {
        $response = $this->postJson('/api/tasks', [
            'title'    => 'Valid Task',
            'priority' => 'medium',
            'due_date' => now()->addDays(3)->format('Y-m-d'),
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.title', 'Valid Task')
                 ->assertJsonPath('data.status', 'todo');
    }

    public function test_invalid_status_transition_is_rejected(): void
    {
        $task = \App\Models\Task::create([
            'title'    => 'Done Task',
            'status'   => 'done',
            'priority' => 'low',
            'due_date' => now()->addDay(),
        ]);

        $response = $this->patchJson("/api/tasks/{$task->id}", [
            'status' => 'todo',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['status']);
    }
}
