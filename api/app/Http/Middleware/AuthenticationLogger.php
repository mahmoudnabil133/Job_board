<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AuthenticationLogger
{
    /**
     * Log authentication-related events
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $authRoutes = [
            'auth.register',
            'auth.login',
            'auth.logout',
            'auth.refresh',
            'auth.change-password',
            'auth.me',
        ];

        $route = $request->route()?->getName();

        // Log authentication attempts
        if (in_array($route, $authRoutes)) {
            Log::channel('auth')->info('auth.request', [
                'route' => $route,
                'method' => $request->method(),
                'ip' => $request->ip(),
                'user_agent' => $request->header('User-Agent'),
                'timestamp' => now(),
            ]);
        }

        $response = $next($request);

        // Log authentication responses
        if (in_array($route, $authRoutes)) {
            Log::channel('auth')->info('auth.response', [
                'route' => $route,
                'status' => $response->status(),
                'user_id' => $request->user()?->id,
                'timestamp' => now(),
            ]);
        }

        return $response;
    }
}
