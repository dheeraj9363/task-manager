<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title'       => 'sometimes|required|string|min:3|max:255',
            'description' => 'nullable|string',
            'status'      => 'sometimes|in:todo,in_progress,done',
            'priority'    => 'sometimes|in:low,medium,high',
            'due_date'    => 'sometimes|date|after_or_equal:today',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $task = $this->route('task');

            // Check status transition
            if ($this->has('status') && $this->status !== $task->status) {
                if (!$task->canTransitionTo($this->status)) {
                    $validator->errors()->add(
                        'status',
                        "Cannot transition from '{$task->status}' to '{$this->status}'."
                    );
                }
            }

            // Check high priority due_date rule
            $priority = $this->priority ?? $task->priority;
            $due = $this->due_date ? \Carbon\Carbon::parse($this->due_date) : $task->due_date;
            if ($priority === 'high' && $due && $due->diffInDays(now()) > 7) {
                $validator->errors()->add(
                    'due_date',
                    'High priority tasks must have a due date within the next 7 days.'
                );
            }
        });
    }
}
