<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Message\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Application;
use App\Services\ApiResponseService;
use App\Services\ConversationService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * @OA\Get(
 *     path="/v1/applications/{application}/messages",
 *     operationId="getApplicationMessages",
 *     tags={"Applications"},
 *     summary="Get application messages",
 *     description="Retrieve all messages for a specific application",
 *     security={{"sanctum":{}}},
 *     @OA\Parameter(name="application", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\Response(
 *         response=200,
 *         description="Messages retrieved successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean"),
 *             @OA\Property(property="data", type="array", items={}),
 *             @OA\Property(
 *                 property="meta",
 *                 @OA\Property(property="total", type="integer"),
 *                 @OA\Property(property="per_page", type="integer"),
 *                 @OA\Property(property="current_page", type="integer"),
 *                 @OA\Property(property="last_page", type="integer")
 *             )
 *         )
 *     )
 * )
 * 
 * @OA\Post(
 *     path="/v1/applications/{application}/messages",
 *     operationId="sendApplicationMessage",
 *     tags={"Applications"},
 *     summary="Send message on application",
 *     description="Send a message related to a specific application",
 *     security={{"sanctum":{}}},
 *     @OA\Parameter(name="application", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"body"},
 *             @OA\Property(property="body", type="string")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Message sent successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean"),
 *             @OA\Property(property="data", type="object")
 *         )
 *     )
 * )
 */
class ApplicationMessageController extends BaseController
{
    //
    public function __construct(
        ApiResponseService $response,
    private ConversationService $conversationService,
) {
        parent::__construct($response);
    }

    
    public function index(Application $application): JsonResponse
    {
        $messages = $this->conversationService->listMessagesForApplication(
            $application,
            auth()->user(),
        );
        return $this->response->success(
            MessageResource::collection($messages),
            'Messages retrieved successfully.',
            200,
            [
                'total' => $messages->total(),
                'per_page' => $messages->perPage(),
                'current_page' => $messages->currentPage(),
                'last_page' => $messages->lastPage(),
            ],
        );
    }

    public function store(StoreMessageRequest $request, Application $application): JsonResponse
    {
        $message = $this->conversationService->sendMessage(
            $application,
            auth()->user(),
            $request->validated('body'),
        );
        return $this->response->created(
            new MessageResource($message),
            'Message sent successfully.',
        );
    }

    public function show(Conversation $conversation): JsonResponse
    {
        $messages = $this->conversationService->listMessagesForConversation(
            $conversation,
            auth()->user(),
        );
        return $this->response->success(
            MessageResource::collection($messages),
            'Messages retrieved successfully.',
            200,
            [
                'total' => $messages->total(),
                'per_page' => $messages->perPage(),
                'current_page' => $messages->currentPage(),
                'last_page' => $messages->lastPage(),
            ],
        );
    }
    public function markAsRead(Conversation $conversation): JsonResponse
    {
        $this->conversationService->markConversationRead(
            $conversation,
            auth()->user(),
        );
        return $this->response->success(
            'Conversation marked as read.',
            200,
            [
                'unread_count' => $unreadCount,
            ],
        );
    }
}
