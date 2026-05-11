<?php

namespace App\Services;

class ApiResponseService{
    public function success(
        mixed $data = null,
        string $message = 'Success',
        int $code = 200,
        array $meta = [],
    ){
        $response = [
            'status' => 'success',
            'message' => $message,
            'data' => $data,
        ];
        if (!empty($meta)){
            $response['meta'] = $meta;
        }
        return response()->json($response, $code);
    }
    public function error(
        string $message = 'Error',
        int $code = 400,
        mixed $errors = null,
        mixed $data = null,
    ){
        $response = [
            'status' => 'error',
            'message' => $message,
        ];
        if (!empty($errors)){
            $response['errors'] = $errors;
        }
        if (!empty($data)){
            $response['data'] = $data;
        }
        return response()->json($response, $code);
    }

    public function created(
        mixed $data = null,
        string $message = 'Resource created successfully',
        array $meta = [],
    ){
        return $this->success($data, $message, 201, $meta);
    }

    public function updated(
        mixed $data = null,
        string $message = 'Resource updated successfully',
        array $meta = [],
    ){
        return $this->success($data, $message, 200, $meta);
    }
    public function deleted(
        string $message = 'Resource deleted successfully',
        array $meta = []
    ){
        return $this->success(null, $message, 200, $meta);
    }
    public function notFound(
        string $message = 'Resource not found',
        array $errors = []
    ){
        return $this->error($message, 404, $errors);
    }
    public function validationError(
        string $message = 'Validation error',
        array $errors = []
    ){
        return $this->error($message, 422, $errors);
    }
    public function unauthorized(
        string $message = 'Unauthorized access',
        array $errors = []
    ){
        return $this->error($message, 401, $errors);
    }
    public function forbidden(
        string $message = 'Forbidden access',
        array $errors = []
    ){
        return $this->error($message, 403, $errors);
    }

    public function serverError(
        string $message = 'Internal server error',
        array $errors = []
    ){
        return $this->error($message, 500, $errors);
    }

}
