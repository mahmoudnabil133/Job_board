<?php

namespace App\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $e)
    {
        // Always return JSON for API routes
        if ($request->is('api/*') || $request->expectsJson()) {
            return $this->handleApiException($e);
        }

        return parent::render($request, $e);
    }

    /**
     * Convert an authentication exception into a response.
     * THIS IS THE KEY METHOD TO FIX
     */
    protected function unauthenticated($request, AuthenticationException $exception)
    {
        return response()->json([
            'success' => false,
            'message' => 'Unauthenticated. Please login to continue.',
            'errors' => [],
        ], 401);
    }


    /**
     * Handle API exceptions and return standardized JSON response
     */
    private function handleApiException(Throwable $e): JsonResponse
    {
        $statusCode = 500;
        $message = 'Internal server error';
        $errors = [];

        if ($e instanceof ValidationException) {
            $statusCode = 422;
            $message = 'Validation errorrrs';
            $errors = $e->errors();
        } elseif ($e instanceof QueryException) {
            $statusCode = 400;
            $message = $this->parseQueryError($e);
        }elseif ($e instanceof MethodNotAllowedHttpException) {
            $statusCode = 405;
            $message = 'Method not allowed.';
        }elseif ($e instanceof ModelNotFoundException) {
            $statusCode = 404;
            $modelName = strtolower(class_basename($e->getModel()));
            $message = "{$modelName} not found";
        } elseif ($e instanceof AuthenticationException) {
            $statusCode = 401;
            $message = 'Unauthenticated. Please login to continue.';
        } elseif ($e instanceof AuthorizationException) {
            $statusCode = 403;
            $message = $e->getMessage() ?: 'Forbidden - You do not have permission';
        } elseif ($e instanceof NotFoundHttpException) {
            $statusCode = 404;
            $message = 'Resource not founddd';
        } elseif ($e instanceof HttpException) {
            $statusCode = $e->getStatusCode();
            $message = $e->getMessage() ?: 'HTTP Error';
        }
    
        // Include debug info in non-production
        if (config('app.debug')) {
            $errors['debug'] = [
                'exception' => get_class($e),
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ];
        }
        return response()->json([
            'status' => 'error',
            'message' => $message,
            'errors' => $errors,
        ], $statusCode);
    }
    private function parseQueryError(QueryException $e): string
    {
        $errorCode = $e->errorInfo[1] ?? null;

        return match ((int) $errorCode) {
            // Duplicate entry
            1062 => $this->parseDuplicateError($e->getMessage()),

            // Foreign key constraint fails (insert/update)
            1452 => 'Cannot add or update — related record does not exist.',

            // Foreign key constraint fails (delete)
            1451 => 'Cannot delete — related records exist.',

            // Table not found
            1146 => 'A required database table is missing.',

            // Column not found
            1054 => 'A database field is missing.',

            // Cannot be null
            1048 => 'A required field is missing.',

            // Data too long
            1406 => 'A value is too long for its field.',

            // Out of range value
            1264 => 'A value is out of range.',

            // Default
            default => 'A database error occurred. Code: ' . $errorCode,
        };
    }

    /**
     * Extract user-friendly duplicate entry message.
     */
    private function parseDuplicateError(string $msg): string
    {
        // Try to extract the key name
        if (preg_match("/for key '(.+?)'/", $msg, $m)) {
            $key = $m[1];
            $key = str_replace('_unique', '', $key);
            $key = str_replace('_', ' ', $key);
            $key = ucwords($key);
            return "{$key} already exists.";
        }

        // Try to extract the value
        if (preg_match("/Duplicate entry '(.+?)'/", $msg, $m)) {
            return "'{$m[1]}' already exists.";
        }

        return 'This record already exists.';
    }
}