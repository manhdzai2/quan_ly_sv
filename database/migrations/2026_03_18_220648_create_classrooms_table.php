<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('classrooms', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique(); // Tên/Mã lớp (VD: Lập trình Web - N01)
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete(); // Khóa ngoại liên kết tới môn học
            $table->string('room', 50)->nullable(); // Phòng học (VD: Phòng 302-A2)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classrooms');
    }
};
