<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Routing\Controller;
use App\Services\ApiResponseService;

class BaseController extends Controller
{
    use AuthorizesRequests;
    protected ApiResponseService $response;

    public function __construct(ApiResponseService $response)
    {
        $this->response = $response;
    }
}