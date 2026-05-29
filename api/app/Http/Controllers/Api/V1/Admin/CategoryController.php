<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\ApiResponseService;
use App\Services\CategoryService;
use OpenApi\Annotations as OA;

/**
 * @OA\Tag(
 *     name="Categories",
 *     description="Category management APIs"
 * )
 */
class CategoryController extends BaseController
{
    public function __construct(
        ApiResponseService $response,
        private CategoryService $categoryService
    ) {
        parent::__construct($response);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/admin/categories",
     *     summary="Get all categories",
     *     tags={"Categories"},
     *     @OA\Response(
     *         response=200,
     *         description="Categories retrieved successfully"
     *     )
     * )
     */
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

    /**
     * @OA\Post(
     *     path="/api/v1/admin/categories",
     *     summary="Create category",
     *     tags={"Categories"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name"},
     *             @OA\Property(property="name", type="string", example="Technology"),
     *             @OA\Property(property="description", type="string", example="Technology jobs")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Category created successfully"
     *     )
     * )
     */
    public function store(StoreCategoryRequest $request)
    {
        $category = $this->categoryService->create($request->validated());

        return $this->response->created(
            new CategoryResource($category),
            'Category created successfully'
        );
    }

    /**
     * @OA\Get(
     *     path="/api/v1/admin/categories/{id}",
     *     summary="Get category by ID",
     *     tags={"Categories"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Category ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Category retrieved successfully"
     *     )
     * )
     */
    public function show(Category $category)
    {
        $category = $this->categoryService->getById($category);

        return $this->response->success(
            new CategoryResource($category),
            'Category retrieved successfully'
        );
    }

    /**
     * @OA\Put(
     *     path="/api/v1/admin/categories/{id}",
     *     summary="Update category",
     *     tags={"Categories"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Category ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", example="Technology"),
     *             @OA\Property(property="description", type="string", example="Updated category")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Category updated successfully"
     *     )
     * )
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $category = $this->categoryService->update($category, $request->validated());

        return $this->response->updated(
            new CategoryResource($category),
            'Category updated successfully'
        );
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/admin/categories/{id}",
     *     summary="Delete category",
     *     tags={"Categories"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Category ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Category deleted successfully"
     *     )
     * )
     */
    public function destroy(Category $category)
    {
        $this->categoryService->delete($category);

        return $this->response->deleted('Category deleted successfully');
    }
}