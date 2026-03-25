<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enrollment_id')->constrained('enrollments')->onDelete('cascade');
            $table->float('attendance_score')->default(0);
            $table->float('midterm_score')->default(0);
            $table->float('final_score')->default(0);
            $table->float('total_score')->nullable();
            $table->string('grade')->nullable(); // store xếp loại học lực (Giỏi/Khá/...)
            $table->timestamps();

            $table->unique('enrollment_id');
            $table->index('total_score');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scores');
    }
};
