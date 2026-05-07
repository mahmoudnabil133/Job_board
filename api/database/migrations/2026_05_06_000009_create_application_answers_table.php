<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('application_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained()->onDelete('cascade');
            $table->foreignId('question_id')->constrained('application_questions')->onDelete('cascade');
            $table->foreignId('job_id')->constrained()->onDelete('cascade');
            $table->text('answer')->nullable();
            $table->timestamps();

            // Each application can only answer each question once
            $table->unique(['application_id', 'question_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('application_answers');
    }
};