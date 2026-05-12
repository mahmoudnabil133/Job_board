<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CategoryService
{
    public function getAll()
    {
        return Category::withCount('jobs')->latest()->paginate(20);
    }

    public function getById(Category $category): Category
    {
        return $category->loadCount('jobs');
    }

    public function create(array $data): Category
    {
        $category = Category::create([
            'name' => $data['name'],
            'slug' => Str::slug($data['name']),
        ]);

        Log::info('category.created', ['category_id' => $category->id, 'name' => $category->name]);

        return $category;
    }

    public function update(Category $category, array $data): Category
    {
        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $category->update($data);

        Log::info('category.updated', ['category_id' => $category->id]);

        return $category->fresh();
    }

    public function delete(Category $category): void
    {
        $category->delete();

        Log::info('category.deleted', ['category_id' => $category->id, 'name' => $category->name]);
    }
}