<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\Response;

class UnauthorizedException extends Exception
{
    public function __construct($message = "Unauthorized access", $code = Response::HTTP_FORBIDDEN)
    {
        parent::__construct($message, $code);
    }
}
