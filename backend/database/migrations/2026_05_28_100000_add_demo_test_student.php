<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    public function up(): void
    {
        if (!DB::table('users')->where('email', 'etudiant@demo.ma')->exists()) {
            $userId = DB::table('users')->insertGetId([
                'name'               => 'Demo Etudiant',
                'email'              => 'etudiant@demo.ma',
                'password'           => Hash::make('password123'),
                'role'               => 'etudiant',
                'is_approved'        => true,
                'email_verified_at'  => now(),
                'created_at'         => now(),
                'updated_at'         => now(),
            ]);

            DB::table('etudiant_profiles')->insert([
                'user_id'    => $userId,
                'filiere'    => 'Développement Web Full Stack',
                'skills'     => 'HTML, CSS, JavaScript, PHP, React',
                'bio'        => 'Compte de démonstration pour les tests.',
                'city'       => 'Casablanca',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        $user = DB::table('users')->where('email', 'etudiant@demo.ma')->first();
        if ($user) {
            DB::table('etudiant_profiles')->where('user_id', $user->id)->delete();
            DB::table('users')->where('id', $user->id)->delete();
        }
    }
};
