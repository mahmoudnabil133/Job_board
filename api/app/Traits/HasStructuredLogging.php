<?php

namespace App\Traits;

use Illuminate\Support\Facades\Log;

trait HasStructuredLogging
{
    /**
     * Log a message with structured context (Datadog ready).
     *
     * @param string $message
     * @param string $level
     * @param array $context
     * @return void
     */
    protected function logStructured(string $message, string $level = 'info', array $context = []): void
    {
        $context = array_merge([
            'class' => static::class,
            'correlation_id' => request()->header('X-Correlation-ID'),
            'user_id' => auth()->id(),
        ], $context);

        Log::log($level, $message, $context);
    }
}
