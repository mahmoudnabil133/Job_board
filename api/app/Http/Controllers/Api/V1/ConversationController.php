<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Message\StoreMessageRequest;
use App\Http\Resources\ConversationListResource;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Services\ApiResponseService;
use App\Services\ConversationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Get(
 *     path="/v1/conversations",
 *     operationId="getConversations",
 *     tags={"Conversations"},
 *     summary="Get user conversations",
 *     description="Retrieve all conversations for the authenticated user",
 *     security={{"sanctum":{}}},
 *     @OA\Response(
 *         response=200,
 *         description="Conversations retrieved successfully",
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
 * @OA\Get(
 *     path="/v1/conversations/{conversation}/messages",
 *     operationId="getConversationMessages",
 *     tags={"Conversations"},
 *     summary="Get messages in conversation",
 *     description="Retrieve all messages for a specific conversation",
 *     security={{"sanctum":{}}},
 *     @OA\Parameter(name="conversation", in="path", required=true, @OA\Schema(type="integer")),
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
 *     path="/v1/conversations/{conversation}/messages",
 *     operationId="sendConversationMessage",
 *     tags={"Conversations"},
 *     summary="Send message in conversation",
 *     description="Send a new message in a conversation",
 *     security={{"sanctum":{}}},
 *     @OA\Parameter(name="conversation", in="path", required=true, @OA\Schema(type="integer")),
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
 * 
 * @OA\Patch(
 *     path="/v1/conversations/{conversation}/read",
 *     operationId="markConversationAsRead",
 *     tags={"Conversations"},
 *     summary="Mark conversation as read",
 *     description="Mark all messages in a conversation as read",
 *     security={{"sanctum":{}}},
 *     @OA\Parameter(name="conversation", in="path", required=true, @OA\Schema(type="integer")),
 *     @OA\Response(
 *         response=200,
 *         description="Messages marked as read",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean"),
 *             @OA\Property(property="data", @OA\Property(property="marked_read", type="integer"))
 *         )
 *     )
 * )
 */
class ConversationController extends BaseController
{
    //
    public function __construct(
        ApiResponseService $response,
        private ConversationService $conversationService,
    ) {
        parent::__construct($response);
    }

    public function index(): JsonResponse
    {
        $conversations = $this->conversationService->listConversations(auth()->user());
        return $this->response->success(
            ConversationListResource::collection($conversations),
            'Conversations retrieved successfully.',
            200,
            [
                'total' => $conversations->total(),
                'per_page' => $conversations->perPage(),
                'current_page' => $conversations->currentPage(),
                'last_page' => $conversations->lastPage(),
            ],
        );
    }

    public function messages(Conversation $conversation): JsonResponse
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

    public function store(StoreMessageRequest $request, Conversation $conversation): JsonResponse
    {
        $message = $this->conversationService->sendMessageInConversation(
            $conversation,
            auth()->user(),
            $request->validated('body'),
        );
        return $this->response->created(
            new MessageResource($message),
            'Message sent successfully.',
        );
    }
    public function markRead(Conversation $conversation): JsonResponse
    {
        $count = $this->conversationService->markConversationRead(
            $conversation,
            auth()->user(),
        );
        return $this->response->success(
            ['marked_read' => $count],
            'Messages marked as read.',
        );
    }

}
