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
        Schema::table('scores', function (Blueprint $table) {
            $table->decimal('regular_score', 4, 1)->nullable()->after('attendance_score')->comment('Điểm thường xuyên/Bài tập');
            $table->decimal('test_score', 4, 1)->nullable()->after('regular_score')->comment('Điểm kiểm tra');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('scores', function (Blueprint $table) {
            $table->dropColumn(['regular_score', 'test_score']);
        });
    }
};
