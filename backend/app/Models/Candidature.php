<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Candidature extends Model
{
    use HasFactory;

    protected $fillable = [
        'etudiant_id',
        'stage_id',
        'cover_letter',
        'cover_letter_path',
        'status',
    ];

    public function etudiant()
    {
        return $this->belongsTo(User::class, 'etudiant_id');
    }

    public function stage()
    {
        return $this->belongsTo(Stage::class);
    }
}
