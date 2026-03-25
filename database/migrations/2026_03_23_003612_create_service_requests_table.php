<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('service_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->string('service_id'); // Id của dịch vụ ('s1', 's2', v.v)
            $table->string('service_name'); // Tên dịch vụ lưu tạm
            $table->json('request_data')->nullable(); // Lưu các trường cấu hình thêm (ví dụ loại giấy, số lượng...)
            $table->text('note')->nullable();
            $table->enum('status', ['pending', 'processing', 'completed', 'rejected'])->default('pending');
            $table->text('response_note')->nullable(); // Phản hồi từ đào tạo
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_requests');
    }
};
