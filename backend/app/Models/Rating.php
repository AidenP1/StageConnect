<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Rating extends Model
{
    use HasFactory;

    protected $fillable = [
        'etudiant_id',
        'societe_id',
        'stars',
        'comment',
    ];

    public function etudiant()
    {
        return $this->belongsTo(User::class, 'etudiant_id');
    }

    public function societe()
    {
        return $this->belongsTo(User::class, 'societe_id');
    }
}
