<?php

namespace App\Http\Controllers;

use App\Models\EtudiantProfile;
use App\Models\Candidature;
use App\Models\Favori;
use App\Models\Notification;
use App\Models\Rating;
use App\Models\Stage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EtudiantController extends Controller
{
    // récupérer le profil de l'étudiant connecté
    public function monProfil(Request $request)
    {
        $profil = $request->user()->etudiantProfile;

        return response()->json([
            'utilisateur' => $request->user(),
            'profil'      => $profil,
        ]);
    }

    // mettre à jour le profil
    public function mettreAJourProfil(Request $request)
    {
        $request->validate([
            'filiere'       => 'nullable|string|max:100',
            'skills'        => 'nullable|string|max:500',
            'bio'           => 'nullable|string',
            'city'          => 'nullable|string|max:100',
            'portfolio_url' => 'nullable|url|max:255',
        ]);

        $utilisateur = $request->user();
        $utilisateur->update(['name' => $request->name ?? $utilisateur->name]);

        $profil = $utilisateur->etudiantProfile;

        if (!$profil) {
            $profil = EtudiantProfile::create(['user_id' => $utilisateur->id]);
        }

        $profil->update($request->only(['filiere', 'skills', 'bio', 'city', 'portfolio_url']));

        return response()->json([
            'message' => 'Profil mis à jour.',
            'profil'  => $profil,
        ]);
    }

    // téléverser le CV
    public function uploaderCV(Request $request)
    {
        $request->validate([
            'cv' => 'required|file|mimes:pdf|max:5120',
        ]);

        $profil = $request->user()->etudiantProfile;

        if (!$profil) {
            $profil = EtudiantProfile::create(['user_id' => $request->user()->id]);
        }

        // supprimer l'ancien CV s'il existe
        if ($profil->cv_path) {
            Storage::disk('public')->delete($profil->cv_path);
        }

        $chemin = $request->file('cv')->store('cvs', 'public');
        $profil->update(['cv_path' => $chemin]);

        return response()->json([
            'message' => 'CV téléversé avec succès.',
            'cv_path' => $chemin,
        ]);
    }

    // téléverser la photo de profil
    public function uploaderPhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|max:2048',
        ]);

        $profil = $request->user()->etudiantProfile;

        if ($profil && $profil->photo_path) {
            Storage::disk('public')->delete($profil->photo_path);
        }

        $chemin = $request->file('photo')->store('photos', 'public');
        $profil->update(['photo_path' => $chemin]);

        return response()->json([
            'message'    => 'Photo mise à jour.',
            'photo_path' => $chemin,
        ]);
    }

    // postuler à un stage
    public function postuler(Request $request)
    {
        $request->validate([
            'stage_id'     => 'required|exists:stages,id',
            'cover_letter' => 'nullable|string',
        ]);

        $etudiantId = $request->user()->id;

        // vérifier si déjà candidat
        $dejaCandidature = Candidature::where('etudiant_id', $etudiantId)
            ->where('stage_id', $request->stage_id)
            ->exists();

        if ($dejaCandidature) {
            return response()->json(['message' => 'Vous avez déjà postulé à ce stage.'], 422);
        }

        $candidature = Candidature::create([
            'etudiant_id'  => $etudiantId,
            'stage_id'     => $request->stage_id,
            'cover_letter' => $request->cover_letter,
            'status'       => 'en_attente',
        ]);

        return response()->json([
            'message'     => 'Candidature envoyée avec succès.',
            'candidature' => $candidature,
        ], 201);
    }

    // liste des candidatures de l'étudiant
    public function mesCandidatures(Request $request)
    {
        $candidatures = Candidature::where('etudiant_id', $request->user()->id)
            ->with(['stage.societe.societeProfile'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($candidatures);
    }

    // récupérer les favoris
    public function mesFavoris(Request $request)
    {
        $favoris = Favori::where('etudiant_id', $request->user()->id)
            ->with(['stage.societe.societeProfile'])
            ->get();

        return response()->json($favoris);
    }

    // ajouter un favori
    public function ajouterFavori(Request $request, $stageId)
    {
        $dejaSauve = Favori::where('etudiant_id', $request->user()->id)
            ->where('stage_id', $stageId)
            ->exists();

        if ($dejaSauve) {
            return response()->json(['message' => 'Déjà dans les favoris.'], 422);
        }

        $favori = Favori::create([
            'etudiant_id' => $request->user()->id,
            'stage_id'    => $stageId,
        ]);

        return response()->json(['message' => 'Ajouté aux favoris.', 'favori' => $favori], 201);
    }

    // supprimer un favori
    public function supprimerFavori(Request $request, $stageId)
    {
        Favori::where('etudiant_id', $request->user()->id)
            ->where('stage_id', $stageId)
            ->delete();

        return response()->json(['message' => 'Retiré des favoris.']);
    }

    // récupérer les notifications
    public function mesNotifications(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        // marquer comme lues
        Notification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json($notifications);
    }

    // soumettre une note pour une entreprise
    public function noterEntreprise(Request $request)
    {
        $request->validate([
            'societe_id' => 'required|exists:users,id',
            'stars'      => 'required|integer|min:1|max:5',
            'comment'    => 'nullable|string',
        ]);

        $rating = Rating::updateOrCreate(
            [
                'etudiant_id' => $request->user()->id,
                'societe_id'  => $request->societe_id,
            ],
            [
                'stars'   => $request->stars,
                'comment' => $request->comment,
            ]
        );

        return response()->json(['message' => 'Note enregistrée.', 'rating' => $rating]);
    }
}
