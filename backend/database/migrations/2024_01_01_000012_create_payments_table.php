<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->cascadeOnDelete();
            $table->string('transaction_id')->unique();
            $table->string('chapa_reference')->nullable();
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('ETB');
            $table->enum('payment_method', ['chapa', 'cash', 'card', 'bank_transfer']);
            $table->enum('status', ['pending', 'processing', 'completed', 'failed', 'refunded'])
                  ->default('pending');
            $table->text('payment_details')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->foreignId('processed_by')->nullable()->constrained('users');
            $table->text('failure_reason')->nullable();
            $table->timestamps();
            
            $table->index(['booking_id', 'status']);
            $table->index('transaction_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
