<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // Check if user is authenticated
        if (!$request->user()) {
            throw new AuthenticationException('Unauthenticated. You must be authenticated to access this resource.');
        }

        $rawRole = $request->user()->role;
        $normalized = match (true) {
            $rawRole instanceof \BackedEnum => $rawRole->value,
            $rawRole instanceof \UnitEnum => $rawRole->name,
            default => (string) $rawRole,
        };

        if (!in_array($normalized, $roles, true)) {
            throw new AuthorizationException('Unauthorized. You do not have the required role.');
        }

        return $next($request);
    }
}