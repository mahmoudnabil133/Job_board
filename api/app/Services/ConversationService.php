<?php
namespace App\Services;
use App\Models\Application;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
// use Illuminate\Pagination\LengthAwarePaginator as Paginator;
use Illuminate\Pagination\LengthAwarePaginator as LengthAwarePaginatorConcrete;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ConversationService
{
    public function __construct(
        private NotificationService $notificationService,
    ) {
    }
    public function assertCanAccessApplication(User $user, Application $application): void
    {
        $application->loadMissing('job');
        if ($user->isCandidate() && (int) $application->candidate_id === $user->id) {
            return;
        }
        if ($user->isEmployer() && (int) $application->job->employer_id === $user->id) {
            return;
        }
        
        throw new AuthorizationException('You are not authorized to access this conversation.');
    }
    public function assertCanAccessConversation(User $user, Conversation $conversation): void
    {
        $conversation->loadMissing('application.job');
        $this->assertCanAccessApplication($user, $conversation->application);
    }
    public function assertCanSendMessage(User $user, Application $application): void
    {
        $this->assertCanAccessApplication($user, $application);
        if ($application->application_status === 'withdrawn') {
            throw new HttpException(400, 'Messaging is disabled for withdrawn applications.');
        }
    }
    public function firstOrCreateConversation(Application $application): Conversation
    {
        return Conversation::firstOrCreate(
            ['application_id' => $application->id],
        );
    }
    public function sendMessage(Application $application, User $sender, string $body): Message
    {
        $this->assertCanSendMessage($sender, $application);
        $application->loadMissing('job');
        return DB::transaction(function () use ($application, $sender, $body) {
            $conversation = $this->firstOrCreateConversation($application);
            $message = $conversation->messages()->create([
                'sender_id' => $sender->id,
                'body' => $body,
            ]);

            $conversation->update(['last_message_at' => $message->created_at]);
            $conversation->loadMissing('application.candidate', 'application.job.employer');
            $recipient = $this->resolveRecipient($conversation, $sender);
            $preview = mb_strlen($body) > 120 ? mb_substr($body, 0, 117) . '...' : $body;
            $jobTitle = $application->job?->title ?? 'a job';
            $this->notificationService->notify(
                $recipient,
                'New message',
                "{$sender->name} ({$jobTitle}): {$preview}",
                'info',
            );
            return $message->load('sender:id,name');
        });
    }

    public function sendMessageInConversation(Conversation $conversation, User $sender, string $body): Message
    {
        $conversation->loadMissing('application.job');
        $this->assertCanSendMessage($sender, $conversation->application);
        return DB::transaction(function () use ($conversation, $sender, $body) {
            $message = $conversation->messages()->create([
                'sender_id' => $sender->id,
                'body' => $body,
            ]);
            $conversation->update(['last_message_at' => $message->created_at]);
            $conversation->loadMissing('application.candidate', 'application.job.employer');
            $application = $conversation->application;
            $application->loadMissing('job');
            $recipient = $this->resolveRecipient($conversation, $sender);
            $preview = mb_strlen($body) > 120 ? mb_substr($body, 0, 117) . '...' : $body;
            $jobTitle = $application->job?->title ?? 'a job';
            $this->notificationService->notify(
                $recipient,
                'New message',
                "{$sender->name} ({$jobTitle}): {$preview}",
                'info',
            );
            return $message->load('sender:id,name');
        });
    }

    private function resolveRecipient(Conversation $conversation, User $sender): User
    {
        $application = $conversation->application;
        if ((int) $application->candidate_id === $sender->id) {
            return $application->job->employer;
        }
        return $application->candidate;
    }
    public function listMessagesForApplication(Application $application, User $user, int $perPage = 25): LengthAwarePaginator
    {
        $this->assertCanAccessApplication($user, $application);
        $conversation = $application->conversation;
        if (!$conversation) {
            // return new Paginator(
            //     new Collection(),
            return new LengthAwarePaginatorConcrete(
                collect(),
                0,
                $perPage,
                1,
                ['path' => request()->url(), 'pageName' => 'page'],
            );
        }
        return $this->paginateMessages($conversation, $perPage);
    }
    
    public function listMessagesForConversation(Conversation $conversation, User $user, int $perPage = 25): LengthAwarePaginator
    {
        $this->assertCanAccessConversation($user, $conversation);
        return $this->paginateMessages($conversation, $perPage);
    }
    private function paginateMessages(Conversation $conversation, int $perPage): LengthAwarePaginator
    {
        return $conversation->messages()
            ->with('sender:id,name')
            ->orderBy('id')
            ->paginate($perPage);
    }

    public function listConversations(User $user, int $perPage = 15): LengthAwarePaginator
    {
        if (!$user->isCandidate() && !$user->isEmployer()) {
            throw new AuthorizationException('Only candidates and employers can view messages.');
        }
        $with = [
            'latestMessage.sender:id,name',
            'application.candidate:id,name,email',
            'application.job:id,title,employer_id',
            'application.job.employer:id,name',
        ];
        $unreadCount = function ($q) use ($user) {
            $q->where('sender_id', '!=', $user->id)
                ->whereNull('read_at');
        };
        $query = Conversation::query()
            ->with($with)
            ->withCount(['messages as unread_count' => $unreadCount]);
        if ($user->isCandidate()) {
            $query->whereHas('application', function ($q) use ($user) {
                $q->where('candidate_id', $user->id);
            });
        } else {
            $query->whereHas('application.job', function ($q) use ($user) {
                $q->where('employer_id', $user->id);
            });
        }
        return $query
            ->orderByDesc('last_message_at')
            ->orderByDesc('updated_at')
            ->paginate($perPage);
    }

    public function markConversationRead(Conversation $conversation, User $user): int
    {
        $this->assertCanAccessConversation($user, $conversation);
        return Message::query()
            ->where('conversation_id', $conversation->id)
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }
}

        
