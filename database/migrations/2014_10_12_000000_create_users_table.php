<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Execute as migrações.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('role')->default('user');
            $table->foreignId('plan_id')->nullable()->constrained()->nullOnDelete();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverta as migrações.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
