<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Stage extends Model
{
    use HasFactory;

    protected $fillable = [
        'societe_id',
        'title',
        'description',
        'tasks',
        'skills_required',
        'duration',
        'deadline',
        'city',
        'sector',
        'views_count',
    ];

    protected $casts = [
        'deadline' => 'date',
    ];

    public function societe()
    {
        return $this->belongsTo(User::class, 'societe_id');
    }

    public function candidatures()
    {
        return $this->hasMany(Candidature::class);
    }

    public function favoris()
    {
        return $this->hasMany(Favori::class);
    }
}
