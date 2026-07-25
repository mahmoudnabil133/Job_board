<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\ApiResponseService;
use App\Services\CategoryService;

class CategoryController extends BaseController
{
    public function __construct(
        ApiResponseService $response,
        private CategoryService $categoryService
    ) {
        parent::__construct($response);
    }

    public function index()
    {
        $categories = $this->categoryService->getAll();

        return $this->response->success(
            CategoryResource::collection($categories),
            'Categories retrieved successfully',
            200,
            [
                'total' => $categories->total(),
                'per_page' => $categories->perPage(),
                'current_page' => $categories->currentPage(),
                'last_page' => $categories->lastPage(),
            ]
        );
    }

    public function store(StoreCategoryRequest $request)
    {
        $category = $this->categoryService->create($request->validated());

        return $this->response->created(
            new CategoryResource($category),
            'Category created successfully'
        );
    }

    public function show(Category $category)
    {
        $category = $this->categoryService->getById($category);

        return $this->response->success(
            new CategoryResource($category),
            'Category retrieved successfully'
        );
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $category = $this->categoryService->update($category, $request->validated());

        return $this->response->updated(
            new CategoryResource($category),
            'Category updated successfully'
        );
    }

    public function destroy(Category $category)
    {
        $this->categoryService->delete($category);

        return $this->response->deleted('Category deleted successfully');
    }
}