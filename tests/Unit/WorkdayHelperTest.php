<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class WorkdayHelperTest extends TestCase
{
    public function test_adding_5_working_days_from_monday_gives_next_monday(): void
    {
        $start  = Carbon::parse('2025-01-06'); // known Monday
        $result = WorkdayHelper::addWorkingDays($start, 5);

        $this->assertEquals('2025-01-13', $result->format('Y-m-d')); // next Monday
    }

    public function test_skips_weekend_correctly(): void
    {
        // Friday
        $start  = Carbon::parse('2025-01-10'); // Friday
        $result = WorkdayHelper::addWorkingDays($start, 1);

        $this->assertEquals('2025-01-13', $result->format('Y-m-d')); // Monday (skips Sat/Sun)
    }

    public function test_zero_days_returns_same_date(): void
    {
        $start  = Carbon::parse('2025-01-06');
        $result = WorkdayHelper::addWorkingDays($start, 0);

        $this->assertEquals('2025-01-06', $result->format('Y-m-d'));
    }
}
