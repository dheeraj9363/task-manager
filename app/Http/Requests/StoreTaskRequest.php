<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
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
            'title'       => 'required|string|min:3|max:255',
            'description' => 'nullable|string',
            'status'      => 'nullable|in:todo,in_progress,done',
            'priority'    => 'required|in:low,medium,high',
            'due_date'    => 'required|date|after_or_equal:today',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if ($this->priority === 'high' && $this->due_date) {
                $due = \Carbon\Carbon::parse($this->due_date);
                if ($due->diffInDays(now()) > 7 || $due->isPast()) {
                    $validator->errors()->add(
                        'due_date',
                        'High priority tasks must have a due date within the next 7 days.'
                    );
                }
            }
        });
    }
}
