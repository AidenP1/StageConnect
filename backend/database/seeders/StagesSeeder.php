<?php

namespace Database\Seeders;

use App\Models\Stage;
use App\Models\User;
use Illuminate\Database\Seeder;

class StagesSeeder extends Seeder
{
    public function run(): void
    {
        $techmaroc    = User::where('email', 'contact@techmaroc.ma')->first();
        $atlasFinance = User::where('email', 'rh@atlasfinance.ma')->first();
        $marocDigital = User::where('email', 'recrutement@marocdigital.ma')->first();

        if (!$techmaroc || !$atlasFinance || !$marocDigital) return;

        $stages = [
            // TechMaroc Solutions
            [
                'societe_id'      => $techmaroc->id,
                'title'           => 'Stage Développeur Full Stack Laravel/React',
                'description'     => 'Nous recherchons un stagiaire développeur full stack pour rejoindre notre équipe technique à Casablanca. Vous travaillerez sur des projets concrets pour nos clients.',
                'tasks'           => 'Développement de fonctionnalités backend avec Laravel, intégration des interfaces React, tests unitaires, participation aux réunions agile.',
                'skills_required' => 'PHP, Laravel, React, MySQL, Git',
                'duration'        => '3 mois',
                'deadline'        => '2026-07-31',
                'city'            => 'Casablanca',
                'sector'          => 'Informatique',
                'views_count'     => 45,
            ],
            [
                'societe_id'      => $techmaroc->id,
                'title'           => 'Stage Développeur Mobile Android',
                'description'     => 'Intégrez notre équipe mobile pour développer des applications Android pour nos clients. Environnement moderne et équipe dynamique.',
                'tasks'           => 'Développement d\'applications Android avec Kotlin, intégration API REST, tests et débogage, publication sur Google Play.',
                'skills_required' => 'Kotlin, Android Studio, API REST, Java',
                'duration'        => '2 mois',
                'deadline'        => '2026-08-15',
                'city'            => 'Casablanca',
                'sector'          => 'Informatique',
                'views_count'     => 32,
            ],
            [
                'societe_id'      => $techmaroc->id,
                'title'           => 'Stage Data Analyst / Business Intelligence',
                'description'     => 'Rejoignez notre département data pour analyser les données clients et créer des tableaux de bord interactifs.',
                'tasks'           => 'Collecte et nettoyage de données, création de rapports Power BI, analyses statistiques, présentation des résultats.',
                'skills_required' => 'Python, SQL, Power BI, Excel, Statistiques',
                'duration'        => '4 mois',
                'deadline'        => '2026-07-15',
                'city'            => 'Rabat',
                'sector'          => 'Informatique',
                'views_count'     => 28,
            ],
            [
                'societe_id'      => $techmaroc->id,
                'title'           => 'Stage Développeur Backend Node.js',
                'description'     => 'Rejoignez notre équipe backend pour développer des API performantes et scalables avec Node.js et Express.',
                'tasks'           => 'Conception et développement d\'API REST, intégration de bases de données, tests automatisés, documentation technique.',
                'skills_required' => 'Node.js, Express, MongoDB, JavaScript, Git',
                'duration'        => '3 mois',
                'deadline'        => '2026-09-01',
                'city'            => 'Casablanca',
                'sector'          => 'Informatique',
                'views_count'     => 18,
            ],
            // Atlas Finance Group
            [
                'societe_id'      => $atlasFinance->id,
                'title'           => 'Stage Analyste Financier Junior',
                'description'     => 'Au sein de notre département analyse financière, vous participerez à l\'étude des marchés financiers et à la rédaction de rapports d\'investissement.',
                'tasks'           => 'Analyse des états financiers, suivi des marchés, rédaction de notes de synthèse, préparation de présentations pour les clients.',
                'skills_required' => 'Excel, Analyse financière, Comptabilité, Anglais',
                'duration'        => '3 mois',
                'deadline'        => '2026-07-20',
                'city'            => 'Rabat',
                'sector'          => 'Finance',
                'views_count'     => 38,
            ],
            [
                'societe_id'      => $atlasFinance->id,
                'title'           => 'Stage Comptabilité et Contrôle de Gestion',
                'description'     => 'Participez aux clôtures mensuelles et aux travaux de contrôle de gestion au sein de notre direction financière.',
                'tasks'           => 'Saisie comptable, réconciliation des comptes, préparation des tableaux de bord, reporting mensuel.',
                'skills_required' => 'Sage, Excel, Comptabilité générale, Analytique',
                'duration'        => '2 mois',
                'deadline'        => '2026-08-01',
                'city'            => 'Casablanca',
                'sector'          => 'Finance',
                'views_count'     => 22,
            ],
            [
                'societe_id'      => $atlasFinance->id,
                'title'           => 'Stage Chargé de Clientèle Bancaire',
                'description'     => 'Intégrez notre réseau d\'agences pour découvrir le métier de chargé de clientèle dans le secteur bancaire.',
                'tasks'           => 'Accueil et orientation des clients, présentation des produits bancaires, traitement des opérations courantes.',
                'skills_required' => 'Communication, Relation client, Sérieux, Français et Arabe',
                'duration'        => '1 mois',
                'deadline'        => '2026-09-01',
                'city'            => 'Fès',
                'sector'          => 'Finance',
                'views_count'     => 15,
            ],
            // Maroc Digital Agency
            [
                'societe_id'      => $marocDigital->id,
                'title'           => 'Stage Community Manager / Réseaux Sociaux',
                'description'     => 'Gérez les réseaux sociaux de nos clients et créez du contenu engageant pour leurs audiences.',
                'tasks'           => 'Création de contenu (visuels + textes), planification des publications, modération des commentaires, reporting mensuel.',
                'skills_required' => 'Canva, Instagram, Facebook, Notion, Créativité',
                'duration'        => '2 mois',
                'deadline'        => '2026-07-20',
                'city'            => 'Marrakech',
                'sector'          => 'Marketing',
                'views_count'     => 55,
            ],
            [
                'societe_id'      => $marocDigital->id,
                'title'           => 'Stage Chef de Projet Digital',
                'description'     => 'Coordonnez les projets digitaux de nos clients en lien avec nos équipes créatives et techniques.',
                'tasks'           => 'Gestion de projet, coordination équipes, suivi des délais, communication client, utilisation de Trello et Asana.',
                'skills_required' => 'Gestion de projet, Communication, Excel, Organisé',
                'duration'        => '3 mois',
                'deadline'        => '2026-08-10',
                'city'            => 'Casablanca',
                'sector'          => 'Marketing',
                'views_count'     => 19,
            ],
            [
                'societe_id'      => $marocDigital->id,
                'title'           => 'Stage Graphiste / Web Designer',
                'description'     => 'Créez des visuels attractifs pour nos clients et participez à la conception de leurs identités visuelles.',
                'tasks'           => 'Création de logos, design de bannières publicitaires, maquettes UI/UX, montage vidéo courts.',
                'skills_required' => 'Adobe Photoshop, Illustrator, Figma, Créativité',
                'duration'        => '2 mois',
                'deadline'        => '2026-08-31',
                'city'            => 'Marrakech',
                'sector'          => 'Marketing',
                'views_count'     => 33,
            ],
        ];

        foreach ($stages as $stage) {
            Stage::updateOrCreate(
                ['title' => $stage['title'], 'societe_id' => $stage['societe_id']],
                $stage
            );
        }
    }
}
