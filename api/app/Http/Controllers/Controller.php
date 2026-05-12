<?php

namespace App\Http\Controllers;

use App\Traits\HasApiResponse;
use App\Traits\HasStructuredLogging;
abstract class Controller
{
    use HasApiResponse, HasStructuredLogging;
}
