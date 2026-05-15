<?php

namespace App\Http\Controllers;

use App\Models\SocieteProfile;
use App\Models\Stage;
use App\Models\Candidature;
use App\Models\Favori;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SocieteController extends Controller
{
    // récupérer le profil de la société
    public function monProfil(Request $request)
    {
        $profil = $request->user()->societeProfile;

        return response()->json([
            'utilisateur' => $request->user(),
            'profil'      => $profil,
        ]);
    }

    // mettre à jour le profil
    public function mettreAJourProfil(Request $request)
    {
        $request->validate([
            'company_name' => 'nullable|string|max:255',
            'sector'       => 'nullable|string|max:100',
            'city'         => 'nullable|string|max:100',
            'description'  => 'nullable|string',
        ]);

        $utilisateur = $request->user();
        $utilisateur->update(['name' => $request->name ?? $utilisateur->name]);

        $profil = $utilisateur->societeProfile;

        if (!$profil) {
            $profil = SocieteProfile::create(['user_id' => $utilisateur->id]);
        }

        $profil->update($request->only(['company_name', 'sector', 'city', 'description']));

        return response()->json([
            'message' => 'Profil mis à jour.',
            'profil'  => $profil,
        ]);
    }

    // téléverser le logo
    public function uploaderLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|max:2048',
        ]);

        $profil = $request->user()->societeProfile;

        if (!$profil) {
            $profil = SocieteProfile::create(['user_id' => $request->user()->id]);
        }

        if ($profil->logo_path) {
            Storage::disk('public')->delete($profil->logo_path);
        }

        $chemin = $request->file('logo')->store('logos', 'public');
        $profil->update(['logo_path' => $chemin]);

        return response()->json([
            'message'   => 'Logo mis à jour.',
            'logo_path' => $chemin,
        ]);
    }

    // liste des offres de la société
    public function mesOffres(Request $request)
    {
        $offres = Stage::where('societe_id', $request->user()->id)
            ->withCount('candidatures')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($offres);
    }

    // créer une nouvelle offre
    public function creerOffre(Request $request)
    {
        $request->validate([
            'title'           => 'required|string|max:255',
            'description'     => 'required|string',
            'tasks'           => 'nullable|string',
            'skills_required' => 'nullable|string',
            'sector'          => 'required|string|max:100',
            'city'            => 'required|string|max:100',
            'duration'        => 'nullable|string|max:100',
            'deadline'        => 'nullable|date',
        ]);

        $offre = Stage::create([
            'societe_id'      => $request->user()->id,
            'title'           => $request->title,
            'description'     => $request->description,
            'tasks'           => $request->tasks,
            'skills_required' => $request->skills_required,
            'sector'          => $request->sector,
            'city'            => $request->city,
            'duration'        => $request->duration,
            'deadline'        => $request->deadline,
        ]);

        return response()->json([
            'message' => 'Offre créée avec succès.',
            'offre'   => $offre,
        ], 201);
    }

    // modifier une offre
    public function modifierOffre(Request $request, $id)
    {
        $offre = Stage::where('id', $id)
            ->where('societe_id', $request->user()->id)
            ->firstOrFail();

        $offre->update($request->only([
            'title', 'description', 'tasks', 'skills_required',
            'sector', 'city', 'duration', 'deadline',
        ]));

        return response()->json([
            'message' => 'Offre mise à jour.',
            'offre'   => $offre,
        ]);
    }

    // supprimer une offre
    public function supprimerOffre(Request $request, $id)
    {
        $offre = Stage::where('id', $id)
            ->where('societe_id', $request->user()->id)
            ->firstOrFail();

        $offre->delete();

        return response()->json(['message' => 'Offre supprimée.']);
    }

    // voir les candidatures pour une offre spécifique
    public function candidaturesPourOffre(Request $request, $id)
    {
        // vérifier que l'offre appartient à cette société
        $offre = Stage::where('id', $id)
            ->where('societe_id', $request->user()->id)
            ->firstOrFail();

        $candidatures = Candidature::where('stage_id', $id)
            ->with(['etudiant.etudiantProfile'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'offre'        => $offre,
            'candidatures' => $candidatures,
        ]);
    }

    // changer le statut d'une candidature
    public function changerStatut(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:en_attente,accepte,refuse',
        ]);

        $candidature = Candidature::findOrFail($id);

        // vérifier que l'offre appartient à cette société
        $offre = Stage::where('id', $candidature->stage_id)
            ->where('societe_id', $request->user()->id)
            ->firstOrFail();

        $candidature->update(['status' => $request->status]);

        // envoyer une notification à l'étudiant
        $messageNotif = match($request->status) {
            'accepte' => "Votre candidature pour le stage \"{$offre->title}\" a été acceptée !",
            'refuse'  => "Votre candidature pour le stage \"{$offre->title}\" a été refusée.",
            default   => "Statut de votre candidature mis à jour.",
        };

        Notification::create([
            'user_id' => $candidature->etudiant_id,
            'message' => $messageNotif,
        ]);

        return response()->json([
            'message'     => 'Statut mis à jour.',
            'candidature' => $candidature,
        ]);
    }

    // statistiques de la société
    public function mesStats(Request $request)
    {
        $societeId = $request->user()->id;
        $stageIds  = Stage::where('societe_id', $societeId)->pluck('id');

        $totalOffres = $stageIds->count();
        $totalVues   = Stage::where('societe_id', $societeId)->sum('views_count');

        $totalCandidatures = Candidature::whereIn('stage_id', $stageIds)->count();
        $enAttente         = Candidature::whereIn('stage_id', $stageIds)->where('status', 'en_attente')->count();
        $acceptes          = Candidature::whereIn('stage_id', $stageIds)->where('status', 'accepte')->count();
        $refuses           = Candidature::whereIn('stage_id', $stageIds)->where('status', 'refuse')->count();
        $totalFavoris      = Favori::whereIn('stage_id', $stageIds)->count();

        // données par offre pour le graphique (vues + candidatures + favoris)
        $offresAvecStats = Stage::where('societe_id', $societeId)
            ->withCount(['candidatures', 'favoris'])
            ->get(['id', 'title', 'views_count']);

        // top compétences des candidats
        $candidatureIds = Candidature::whereIn('stage_id', $stageIds)->pluck('etudiant_id');
        $skillsCounts = [];
        \App\Models\EtudiantProfile::whereIn('user_id', $candidatureIds)
            ->whereNotNull('skills')
            ->pluck('skills')
            ->each(function ($skills) use (&$skillsCounts) {
                foreach (explode(',', $skills) as $skill) {
                    $s = trim($skill);
                    if ($s) $skillsCounts[$s] = ($skillsCounts[$s] ?? 0) + 1;
                }
            });
        arsort($skillsCounts);
        $topSkills = array_slice($skillsCounts, 0, 8, true);

        // distribution géographique des candidats
        $villes = \App\Models\EtudiantProfile::whereIn('user_id', $candidatureIds)
            ->whereNotNull('city')
            ->selectRaw('city, COUNT(*) as count')
            ->groupBy('city')
            ->orderByDesc('count')
            ->limit(6)
            ->get();

        return response()->json([
            'total_offres'       => $totalOffres,
            'total_vues'         => $totalVues,
            'total_candidatures' => $totalCandidatures,
            'en_attente'         => $enAttente,
            'acceptes'           => $acceptes,
            'refuses'            => $refuses,
            'total_favoris'      => $totalFavoris,
            'offres_stats'       => $offresAvecStats,
            'top_skills'         => $topSkills,
            'villes_candidats'   => $villes,
        ]);
    }
}
