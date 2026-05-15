<?php

namespace App\Http\Controllers;

use App\Models\Stage;
use App\Models\User;
use App\Models\Rating;
use App\Models\Candidature;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    // liste paginée des stages avec filtres
    public function listeStages(Request $request)
    {
        $query = Stage::with(['societe.societeProfile'])
            ->orderBy('created_at', 'desc');

        // filtrer par secteur
        if ($request->filled('sector')) {
            $query->where('sector', $request->sector);
        }

        // filtrer par ville
        if ($request->filled('city')) {
            $query->where('city', $request->city);
        }

        // filtrer par durée
        if ($request->filled('duration')) {
            $query->where('duration', 'like', '%' . $request->duration . '%');
        }

        // recherche par mot-clé
        if ($request->filled('search')) {
            $mot = $request->search;
            $query->where(function ($q) use ($mot) {
                $q->where('title', 'like', "%$mot%")
                  ->orWhere('description', 'like', "%$mot%")
                  ->orWhere('city', 'like', "%$mot%");
            });
        }

        $stages = $query->paginate(9);

        return response()->json($stages);
    }

    // détail d'un stage + incrémenter les vues
    public function detailStage($id)
    {
        $stage = Stage::with(['societe.societeProfile'])->findOrFail($id);

        // incrémenter le compteur de vues
        $stage->increment('views_count');

        $noteMoyenne = Rating::where('societe_id', $stage->societe_id)->avg('stars');

        return response()->json([
            'stage'        => $stage,
            'note_moyenne' => round($noteMoyenne, 1),
        ]);
    }

    // profil public d'une entreprise
    public function profilEntreprise($id)
    {
        $entreprise = User::where('id', $id)
            ->where('role', 'societe')
            ->with('societeProfile')
            ->firstOrFail();

        $offres = Stage::where('societe_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        $avis = Rating::where('societe_id', $id)
            ->with('etudiant:id,name')
            ->orderBy('created_at', 'desc')
            ->get();

        $noteMoyenne = $avis->avg('stars');

        return response()->json([
            'entreprise'   => $entreprise,
            'offres'       => $offres,
            'avis'         => $avis,
            'note_moyenne' => round($noteMoyenne, 1),
        ]);
    }

    // statistiques publiques pour la page d'accueil
    public function statsPubliques()
    {
        $totalStages     = Stage::count();
        $totalEntreprises = User::where('role', 'societe')->count();
        $totalEtudiants  = User::where('role', 'etudiant')->count();

        return response()->json([
            'total_stages'      => $totalStages,
            'total_entreprises' => $totalEntreprises,
            'total_etudiants'   => $totalEtudiants,
        ]);
    }

    // récupérer les 6 dernières offres pour la landing page
    public function dernieresOffres()
    {
        $stages = Stage::with(['societe.societeProfile'])
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get();

        return response()->json($stages);
    }
}
