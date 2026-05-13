<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\Response;

class ResourceNotFoundException extends Exception
{
    public function __construct($message = "Resource not found", $code = Response::HTTP_NOT_FOUND)
    {
        parent::__construct($message, $code);
    }
}
