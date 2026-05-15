<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\EtudiantController;
use App\Http\Controllers\SocieteController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\MessagesController;

// ==============================
// ROUTES PUBLIQUES (sans auth)
// ==============================

Route::get('/stages', [PublicController::class, 'listeStages']);
Route::get('/stages/recentes', [PublicController::class, 'dernieresOffres']);

// Routes société statiques — DOIVENT précéder le wildcard /stages/{id}
Route::get('/stages/mes-offres', [SocieteController::class, 'mesOffres'])->middleware(['auth:sanctum', 'role:societe']);
Route::post('/stages/mes-offres', [SocieteController::class, 'creerOffre'])->middleware(['auth:sanctum', 'role:societe']);

Route::get('/stages/{id}', [PublicController::class, 'detailStage']);
Route::get('/entreprises/{id}', [PublicController::class, 'profilEntreprise']);
Route::get('/stats/public', [PublicController::class, 'statsPubliques']);

// ==============================
// AUTHENTIFICATION
// ==============================

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');

// ==============================
// ROUTES ETUDIANT
// ==============================

Route::middleware(['auth:sanctum', 'role:etudiant'])->group(function () {
    Route::get('/etudiant/profile', [EtudiantController::class, 'monProfil']);
    Route::put('/etudiant/profile', [EtudiantController::class, 'mettreAJourProfil']);
    Route::post('/etudiant/profile/cv', [EtudiantController::class, 'uploaderCV']);
    Route::post('/etudiant/profile/photo', [EtudiantController::class, 'uploaderPhoto']);

    Route::post('/candidatures', [EtudiantController::class, 'postuler']);
    Route::get('/candidatures/mes-candidatures', [EtudiantController::class, 'mesCandidatures']);
    Route::get('/stages/recommandes', [EtudiantController::class, 'stagesRecommandeés']);

    Route::get('/favoris', [EtudiantController::class, 'mesFavoris']);
    Route::post('/favoris/{stage_id}', [EtudiantController::class, 'ajouterFavori']);
    Route::delete('/favoris/{stage_id}', [EtudiantController::class, 'supprimerFavori']);

    Route::get('/notifications', [EtudiantController::class, 'mesNotifications']);

    Route::post('/ratings', [EtudiantController::class, 'noterEntreprise']);
});

// ==============================
// ROUTES SOCIETE
// ==============================

Route::middleware(['auth:sanctum', 'role:societe'])->group(function () {
    Route::get('/societe/candidatures/recentes', [SocieteController::class, 'candidaturesRecentes']);
    Route::get('/societe/profile', [SocieteController::class, 'monProfil']);
    Route::put('/societe/profile', [SocieteController::class, 'mettreAJourProfil']);
    Route::post('/societe/profile/logo', [SocieteController::class, 'uploaderLogo']);
    Route::get('/societe/stats', [SocieteController::class, 'mesStats']);

    Route::put('/stages/{id}', [SocieteController::class, 'modifierOffre']);
    Route::delete('/stages/{id}', [SocieteController::class, 'supprimerOffre']);
    Route::get('/stages/{id}/candidatures', [SocieteController::class, 'candidaturesPourOffre']);
    Route::put('/candidatures/{id}/statut', [SocieteController::class, 'changerStatut']);
});

// ==============================
// ROUTES MESSAGERIE (etudiant + societe)
// ==============================

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/messages/conversations', [MessagesController::class, 'mesConversations']);
    Route::get('/messages/non-lus', [MessagesController::class, 'nonLus']);
    Route::get('/messages/{interlocuteurId}', [MessagesController::class, 'conversation']);
    Route::post('/messages', [MessagesController::class, 'envoyer']);
});

// ==============================
// ROUTES ADMIN
// ==============================

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/admin/stats', [AdminController::class, 'stats']);
    Route::get('/admin/users', [AdminController::class, 'listeUtilisateurs']);
    Route::put('/admin/users/{id}', [AdminController::class, 'modifierUtilisateur']);
    Route::delete('/admin/users/{id}', [AdminController::class, 'supprimerUtilisateur']);
    Route::put('/admin/users/{id}/approve', [AdminController::class, 'approuverUtilisateur']);
    Route::get('/admin/stages', [AdminController::class, 'listeStages']);
    Route::put('/admin/stages/{id}', [AdminController::class, 'modifierStage']);
    Route::delete('/admin/stages/{id}', [AdminController::class, 'supprimerStage']);
});
