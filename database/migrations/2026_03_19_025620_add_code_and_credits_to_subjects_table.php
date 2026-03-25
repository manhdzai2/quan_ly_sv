<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subjects', function (Blueprint $table) {
            if (!Schema::hasColumn('subjects', 'code')) {
                $table->string('code', 50)->nullable()->unique()->after('id');
            }
            if (!Schema::hasColumn('subjects', 'credits')) {
                $table->unsignedInteger('credits')->default(3)->after('credit');
            }
        });

        // Copy data from 'credit' to 'credits' if credit column exists
        if (Schema::hasColumn('subjects', 'credit')) {
            \DB::statement('UPDATE subjects SET credits = credit WHERE credits = 3 OR credits IS NULL');
        }
    }

    public function down(): void
    {
        Schema::table('subjects', function (Blueprint $table) {
            $table->dropColumn(['code', 'credits']);
        });
    }
};
