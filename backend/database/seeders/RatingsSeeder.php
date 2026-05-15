<?php

namespace Database\Seeders;

use App\Models\Rating;
use App\Models\User;
use Illuminate\Database\Seeder;

class RatingsSeeder extends Seeder
{
    public function run(): void
    {
        $youssef = User::where('email', 'youssef.benali@gmail.com')->first();
        $fatima  = User::where('email', 'fatima.alaoui@gmail.com')->first();
        $mehdi   = User::where('email', 'mehdi.tazi@gmail.com')->first();

        $techmaroc    = User::where('email', 'contact@techmaroc.ma')->first();
        $atlasFinance = User::where('email', 'rh@atlasfinance.ma')->first();
        $marocDigital = User::where('email', 'recrutement@marocdigital.ma')->first();

        // avis sur TechMaroc Solutions
        Rating::create([
            'etudiant_id' => $youssef->id,
            'societe_id'  => $techmaroc->id,
            'stars'       => 5,
            'comment'     => 'Excellente expérience de stage ! L\'équipe est très accueillante et j\'ai appris énormément. Je recommande vivement.',
        ]);

        // avis sur Atlas Finance Group
        Rating::create([
            'etudiant_id' => $fatima->id,
            'societe_id'  => $atlasFinance->id,
            'stars'       => 4,
            'comment'     => 'Très bon encadrement et environnement professionnel. Les missions sont enrichissantes et correspondent bien à la formation.',
        ]);

        // avis sur Maroc Digital Agency
        Rating::create([
            'etudiant_id' => $mehdi->id,
            'societe_id'  => $marocDigital->id,
            'stars'       => 4,
            'comment'     => 'Agence dynamique avec des projets variés. J\'ai beaucoup progressé en SEO et en gestion de communautés.',
        ]);
    }
}
