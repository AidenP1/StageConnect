<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\EtudiantProfile;
use App\Models\SocieteProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        // admin
        User::firstOrCreate(['email' => 'admin@stageconnect.ma'], [
            'name'        => 'Admin StageConnect',
            'password'    => Hash::make('password123'),
            'role'        => 'admin',
            'is_approved' => true,
        ]);

        // entreprise 1
        $e1 = User::firstOrCreate(['email' => 'contact@techmaroc.ma'], [
            'name'        => 'TechMaroc Solutions',
            'password'    => Hash::make('password123'),
            'role'        => 'societe',
            'is_approved' => true,
        ]);
        SocieteProfile::firstOrCreate(['user_id' => $e1->id], [
            'company_name' => 'TechMaroc Solutions',
            'sector'       => 'Informatique',
            'city'         => 'Casablanca',
            'description'  => 'TechMaroc Solutions est une entreprise spécialisée dans le développement de logiciels et les solutions numériques pour les entreprises marocaines.',
        ]);

        // entreprise 2
        $e2 = User::firstOrCreate(['email' => 'rh@atlasfinance.ma'], [
            'name'        => 'Atlas Finance Group',
            'password'    => Hash::make('password123'),
            'role'        => 'societe',
            'is_approved' => true,
        ]);
        SocieteProfile::firstOrCreate(['user_id' => $e2->id], [
            'company_name' => 'Atlas Finance Group',
            'sector'       => 'Finance',
            'city'         => 'Rabat',
            'description'  => 'Atlas Finance Group est un acteur majeur dans le secteur financier au Maroc.',
        ]);

        // entreprise 3
        $e3 = User::firstOrCreate(['email' => 'recrutement@marocdigital.ma'], [
            'name'        => 'Maroc Digital Agency',
            'password'    => Hash::make('password123'),
            'role'        => 'societe',
            'is_approved' => true,
        ]);
        SocieteProfile::firstOrCreate(['user_id' => $e3->id], [
            'company_name' => 'Maroc Digital Agency',
            'sector'       => 'Marketing',
            'city'         => 'Marrakech',
            'description'  => 'Agence de marketing digital basée à Marrakech.',
        ]);

        // étudiants
        $students = [
            ['email' => 'etudiant@demo.ma',          'name' => 'Demo Etudiant',      'filiere' => 'Développement Web Full Stack',  'skills' => 'PHP, Laravel, React, MySQL',          'city' => 'Casablanca'],
            ['email' => 'youssef.benali@gmail.com',   'name' => 'Youssef Benali',     'filiere' => 'Développement Web Full Stack',  'skills' => 'PHP, Laravel, React, MySQL, JavaScript', 'city' => 'Casablanca'],
            ['email' => 'fatima.alaoui@gmail.com',    'name' => 'Fatima Zahra Alaoui','filiere' => 'Finance et Comptabilité',       'skills' => 'Excel, Sage, Analyse financière',     'city' => 'Rabat'],
            ['email' => 'mehdi.tazi@gmail.com',       'name' => 'Mehdi Tazi',         'filiere' => 'Marketing Digital',             'skills' => 'SEO, Google Ads, Social Media',       'city' => 'Marrakech'],
            ['email' => 'salma.idrissi@gmail.com',    'name' => 'Salma Idrissi',      'filiere' => 'Développement Web Full Stack',  'skills' => 'Python, Django, Vue.js, PostgreSQL',  'city' => 'Fès'],
            ['email' => 'omar.chakir@gmail.com',      'name' => 'Omar Chakir',        'filiere' => 'Réseaux et Systèmes',           'skills' => 'Linux, Cisco, Cybersécurité',         'city' => 'Agadir'],
        ];

        foreach ($students as $s) {
            $u = User::firstOrCreate(['email' => $s['email']], [
                'name'        => $s['name'],
                'password'    => Hash::make('password123'),
                'role'        => 'etudiant',
                'is_approved' => true,
            ]);
            EtudiantProfile::firstOrCreate(['user_id' => $u->id], [
                'filiere' => $s['filiere'],
                'skills'  => $s['skills'],
                'city'    => $s['city'],
            ]);
        }
    }
}
