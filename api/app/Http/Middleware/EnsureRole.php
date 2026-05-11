<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Exceptions\UnauthorizedException;

class EnsureRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!$request->user() || !$request->user()->hasRole($role)) {
            throw new UnauthorizedException("You do not have the required role: {$role}");
        }

        return $next($request);
    }
}
