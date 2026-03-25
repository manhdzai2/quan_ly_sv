<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreScoreRequest;
use App\Http\Requests\UpdateScoreRequest;
use App\Models\Score;
use App\Models\Enrollment;
use Illuminate\Http\JsonResponse;

class ScoreController extends Controller
{
    public function store(StoreScoreRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Mỗi enrollment có tối đa 1 score (unique)
        $score = Score::updateOrCreate(
            ['enrollment_id' => $data['enrollment_id']],
            [
                'attendance_score' => $data['attendance_score'],
                'midterm_score'    => $data['midterm_score'],
                'final_score'      => $data['final_score'],
            ]
        );

        // Observer sẽ tự tính total_score & grade
        return response()->json([
            'message' => 'Lưu điểm thành công',
            'data'    => $score->fresh(),
        ], 201);
    }

    public function update(UpdateScoreRequest $request, Score $score): JsonResponse
    {
        $score->fill($request->validated())->save();

        return response()->json([
            'message' => 'Cập nhật điểm thành công',
            'data'    => $score->fresh(),
        ]);
    }

    public function show(Enrollment $enrollment): JsonResponse
    {
        $score = $enrollment->score()->first();
        return response()->json(['data' => $score]);
    }
}