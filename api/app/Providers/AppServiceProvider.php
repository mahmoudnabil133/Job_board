<?php

namespace App\Providers;
use Dedoc\Scramble\Scramble;


use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            \App\Repositories\Contracts\AuthRepositoryInterface::class,
            \App\Repositories\AuthEloquentRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */

public function boot(): void
{
}
}
