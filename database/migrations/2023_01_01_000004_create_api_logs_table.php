<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('api_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('api_key_id')->nullable()->constrained();
            $table->string('endpoint');
            $table->string('method', 10);
            $table->string('ip_address', 45)->nullable();
            $table->json('request_data')->nullable();
            $table->json('response_data')->nullable();
            $table->integer('status_code');
            $table->integer('credits_used')->default(1);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('api_logs');
    }
}; 