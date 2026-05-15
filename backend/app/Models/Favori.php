<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Favori extends Model
{
    use HasFactory;

    protected $fillable = [
        'etudiant_id',
        'stage_id',
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
