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
