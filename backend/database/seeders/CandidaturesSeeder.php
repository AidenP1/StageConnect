<?php

namespace Database\Seeders;

use App\Models\Candidature;
use App\Models\Notification;
use App\Models\User;
use App\Models\Stage;
use Illuminate\Database\Seeder;

class CandidaturesSeeder extends Seeder
{
    public function run(): void
    {
        // récupérer les étudiants et les stages
        $youssef = User::where('email', 'youssef.benali@gmail.com')->first();
        $fatima  = User::where('email', 'fatima.alaoui@gmail.com')->first();
        $mehdi   = User::where('email', 'mehdi.tazi@gmail.com')->first();
        $salma   = User::where('email', 'salma.idrissi@gmail.com')->first();
        $omar    = User::where('email', 'omar.chakir@gmail.com')->first();

        $stages = Stage::all();

        // candidatures de Youssef
        Candidature::create([
            'etudiant_id'  => $youssef->id,
            'stage_id'     => $stages[0]->id, // Laravel/React
            'cover_letter' => 'Bonjour, je suis très intéressé par ce poste. Avec mes compétences en Laravel et React, je suis convaincu de pouvoir apporter une valeur ajoutée à votre équipe.',
            'status'       => 'accepte',
        ]);

        Candidature::create([
            'etudiant_id'  => $youssef->id,
            'stage_id'     => $stages[2]->id, // Data Analyst
            'cover_letter' => 'Je souhaite développer mes compétences en data analysis et rejoindre votre équipe.',
            'status'       => 'refuse',
        ]);

        // candidatures de Fatima
        Candidature::create([
            'etudiant_id'  => $fatima->id,
            'stage_id'     => $stages[3]->id, // Analyste financier
            'cover_letter' => 'Passionnée par la finance, je pense être une candidate idéale pour ce stage. Mon cursus en finance me prépare parfaitement à ce type de mission.',
            'status'       => 'accepte',
        ]);

        Candidature::create([
            'etudiant_id'  => $fatima->id,
            'stage_id'     => $stages[4]->id, // Comptabilité
            'cover_letter' => 'Je suis intéressée par ce stage en comptabilité pour compléter ma formation.',
            'status'       => 'en_attente',
        ]);

        // candidatures de Mehdi
        Candidature::create([
            'etudiant_id'  => $mehdi->id,
            'stage_id'     => $stages[6]->id, // Community Manager
            'cover_letter' => 'Je gère déjà les réseaux sociaux de plusieurs clients en freelance, ce qui me donne une excellente base pour ce stage.',
            'status'       => 'en_attente',
        ]);

        Candidature::create([
            'etudiant_id'  => $mehdi->id,
            'stage_id'     => $stages[7]->id, // SEO
            'cover_letter' => 'Le SEO est ma passion. J\'ai déjà travaillé sur plusieurs projets de référencement naturel.',
            'status'       => 'accepte',
        ]);

        // candidatures de Salma
        Candidature::create([
            'etudiant_id'  => $salma->id,
            'stage_id'     => $stages[0]->id, // Laravel/React
            'cover_letter' => 'Développeuse full stack avec une solide expérience en Python et Django, je suis également compétente en Laravel et React.',
            'status'       => 'en_attente',
        ]);

        Candidature::create([
            'etudiant_id'  => $salma->id,
            'stage_id'     => $stages[1]->id, // Mobile
            'cover_letter' => 'Je cherche à diversifier mes compétences en mobile development.',
            'status'       => 'refuse',
        ]);

        // candidature de Omar
        Candidature::create([
            'etudiant_id'  => $omar->id,
            'stage_id'     => $stages[2]->id, // Data Analyst
            'cover_letter' => 'Mon expérience en administration système et en scripting me permettrait de contribuer efficacement à l\'équipe data.',
            'status'       => 'en_attente',
        ]);

        // créer les notifications correspondantes
        $notifications = [
            ['user_id' => $youssef->id, 'message' => 'Félicitations ! Votre candidature pour "Stage Développeur Full Stack Laravel/React" a été acceptée !'],
            ['user_id' => $youssef->id, 'message' => 'Votre candidature pour "Stage Data Analyst / Business Intelligence" a été refusée.'],
            ['user_id' => $fatima->id, 'message' => 'Félicitations ! Votre candidature pour "Stage Analyste Financier Junior" a été acceptée !'],
            ['user_id' => $mehdi->id, 'message' => 'Félicitations ! Votre candidature pour "Stage SEO et Content Marketing" a été acceptée !'],
            ['user_id' => $salma->id, 'message' => 'Votre candidature pour "Stage Développeur Mobile Android" a été refusée.'],
        ];

        foreach ($notifications as $notif) {
            Notification::create(array_merge($notif, ['is_read' => false]));
        }
    }
}
