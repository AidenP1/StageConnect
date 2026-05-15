<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SocieteProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company_name',
        'sector',
        'city',
        'logo_path',
        'description',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
