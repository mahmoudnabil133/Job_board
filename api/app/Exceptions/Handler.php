<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use App\Traits\HasApiResponse;

class Handler extends ExceptionHandler
{
    use HasApiResponse;

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->renderable(function (Throwable $e, $request) {
            if ($request->is('api/*')) {
                return $this->handleApiExceptions($e);
            }
        });
    }

    private function handleApiExceptions(Throwable $e): JsonResponse
    {
        if ($e instanceof ValidationException) {
            return $this->error('Validation failed', 422, $e->errors());
        }

        if ($e instanceof NotFoundHttpException || $e instanceof ResourceNotFoundException) {
            return $this->error('Resource not found', 404);
        }

        if ($e instanceof UnauthorizedException) {
            return $this->error($e->getMessage(), 403);
        }

        $code = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;
        $message = config('app.debug') ? $e->getMessage() : 'Server Error';

        return $this->error($message, $code);
    }
}
