<?php

namespace App\Observers;

use App\Models\Score;

class ScoreObserver
{
    /**
     * Tự động tính total_score & grade trước khi lưu.
     */
    public function saving(Score $score): void
    {
        // Chuẩn hóa input điểm nằm trong khoảng 0..10
        $att = max(0, min(10, (float) ($score->attendance_score ?? 0)));
        $mid = max(0, min(10, (float) ($score->midterm_score ?? 0)));
        $fin = max(0, min(10, (float) ($score->final_score ?? 0)));

        $total = round(($att * 0.2) + ($mid * 0.3) + ($fin * 0.5), 2);
        $score->attendance_score = $att;
        $score->midterm_score    = $mid;
        $score->final_score      = $fin;
        $score->total_score      = $total;
        $score->grade            = $this->mapGrade($total);
    }

    private function mapGrade(float $total): string
    {
        if ($total >= 8.5) {
            return 'Giỏi';
        }
        if ($total >= 7.0) {
            return 'Khá';
        }
        if ($total >= 5.5) {
            return 'Trung bình';
        }
        return 'Yếu';
    }
}
