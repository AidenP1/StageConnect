<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_approved',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_approved' => 'boolean',
        ];
    }

    // relations
    public function etudiantProfile()
    {
        return $this->hasOne(EtudiantProfile::class);
    }

    public function societeProfile()
    {
        return $this->hasOne(SocieteProfile::class);
    }

    public function candidatures()
    {
        return $this->hasMany(Candidature::class, 'etudiant_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function favoris()
    {
        return $this->hasMany(Favori::class, 'etudiant_id');
    }

    public function stages()
    {
        return $this->hasMany(Stage::class, 'societe_id');
    }
}
