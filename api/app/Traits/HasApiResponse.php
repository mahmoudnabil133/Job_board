<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait HasApiResponse
{
    /**
     * Return a success JSON response.
     *
     * @param  mixed  $data
     * @param  string|null  $message
     * @param  int  $code
     * @return JsonResponse
     */
    protected function success(mixed $data = null, string $message = null, int $code = 200): JsonResponse
    {
        return response()->json([
            'status'  => 'success',
            'message' => $message,
            'data'    => $data
        ], $code);
    }

    /**
     * Return an error JSON response.
     *
     * @param  string|null  $message
     * @param  int  $code
     * @param  mixed  $data
     * @return JsonResponse
     */
    protected function error(string $message = null, int $code = 400, mixed $data = null): JsonResponse
    {
        return response()->json([
            'status'  => 'error',
            'message' => $message,
            'data'    => $data
        ], $code);
    }
}
