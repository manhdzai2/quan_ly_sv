<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ScoreController;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/scores', [ScoreController::class, 'store']);          // tạo/ghi điểm
    Route::put('/scores/{score}', [ScoreController::class, 'update']);  // cập nhật điểm
    Route::get('/enrollments/{enrollment}/score', [ScoreController::class, 'show']);
});