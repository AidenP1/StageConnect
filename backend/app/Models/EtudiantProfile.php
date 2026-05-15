<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EtudiantProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'filiere',
        'cv_path',
        'photo_path',
        'skills',
        'bio',
        'city',
        'portfolio_url',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
