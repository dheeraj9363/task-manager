<?php
namespace App\Helpers;

use Carbon\Carbon;

class WorkdayHelper
{
    /**
     * Add N working days to a start date, skipping Saturdays and Sundays.
     */
    public static function addWorkingDays(Carbon $startDate, int $daysToAdd): Carbon
    {
        $date = $startDate->copy();
        $added = 0;

        while ($added < $daysToAdd) {
            $date->addDay();
            if (!$date->isWeekend()) {
                $added++;
            }
        }

        return $date;
    }
}