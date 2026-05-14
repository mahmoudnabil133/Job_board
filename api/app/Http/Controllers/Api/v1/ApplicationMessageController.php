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
