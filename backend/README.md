# StageConnect — Backend Laravel API

API REST pour la plateforme de gestion de stages StageConnect.
Développé avec Laravel + Sanctum pour l'authentification SPA.

## Prérequis

- PHP >= 8.2
- Composer
- MySQL
- XAMPP (ou autre serveur local)

## Installation

1. Cloner le projet et aller dans le dossier backend :
   ```
   cd backend
   ```

2. Installer les dépendances PHP :
   ```
   composer install
   ```

3. Copier le fichier d'environnement :
   ```
   cp .env.example .env
   ```

4. Générer la clé de l'application :
   ```
   php artisan key:generate
   ```

5. Configurer la base de données dans le fichier `.env` :
   ```
   DB_DATABASE=stageconnect
   DB_USERNAME=root
   DB_PASSWORD=
   ```

6. Créer la base de données MySQL :
   ```sql
   CREATE DATABASE stageconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

7. Lancer les migrations :
   ```
   php artisan migrate
   ```

8. Insérer les données de démonstration :
   ```
   php artisan db:seed
   ```

9. Créer le lien symbolique pour le stockage :
   ```
   php artisan storage:link
   ```

10. Démarrer le serveur de développement :
    ```
    php artisan serve
    ```

Le backend sera disponible sur : http://localhost:8000

## Comptes de démonstration

| Rôle    | Email                        | Mot de passe  |
|---------|------------------------------|---------------|
| Admin   | admin@stageconnect.ma        | password123   |
| Société | contact@techmaroc.ma         | password123   |
| Société | rh@atlasfinance.ma           | password123   |
| Étudiant| youssef.benali@gmail.com     | password123   |
| Étudiant| fatima.alaoui@gmail.com      | password123   |

## Structure des routes API

- `GET /api/stages` — Liste paginée des stages (public)
- `GET /api/stages/{id}` — Détail d'un stage (public)
- `POST /api/login` — Connexion
- `POST /api/register` — Inscription
- `GET /api/etudiant/profile` — Profil étudiant (auth)
- `POST /api/candidatures` — Postuler (auth étudiant)
- `GET /api/societe/stats` — Statistiques société (auth société)
- `GET /api/admin/stats` — Statistiques admin (auth admin)

## Notes

- L'authentification utilise Laravel Sanctum avec des cookies de session (SPA)
- Les fichiers (CV, photos, logos) sont stockés dans `storage/app/public`
- CORS configuré pour autoriser `http://localhost:5173` (frontend React)
