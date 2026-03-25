<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('schedules', function (Blueprint $table) {
        $table->id();
        // Liên kết với môn học
        $table->foreignId('subject_id')->constrained('subjects')->onDelete('cascade');
        $table->string('day_of_week'); // VD: Thứ 2
        $table->date('study_date'); // Ngày học thực tế
        $table->time('start_time'); // Giờ bắt đầu (VD: 07:00)
        $table->time('end_time'); // Giờ kết thúc (VD: 09:30)
        $table->string('room'); // Phòng học
        $table->string('type')->default('Lý thuyết'); // Loại hình
        $table->string('instructor')->nullable(); // Tên giảng viên
        $table->string('color_theme')->default('blue'); // Màu sắc hiển thị
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
