<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Stage;
use App\Models\Candidature;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // statistiques globales pour l'admin
    public function stats()
    {
        $totalUtilisateurs  = User::count();
        $totalEtudiants     = User::where('role', 'etudiant')->count();
        $totalSocietes      = User::where('role', 'societe')->count();
        $totalStages        = Stage::count();
        $totalCandidatures  = Candidature::count();
        $enAttenteApprobation = User::where('role', 'societe')->where('is_approved', false)->count();

        // inscriptions récentes
        $inscriptionsRecentes = User::orderBy('created_at', 'desc')
            ->limit(5)
            ->get(['id', 'name', 'email', 'role', 'created_at']);

        // sociétés en attente d'approbation
        $societesEnAttente = User::where('role', 'societe')
            ->where('is_approved', false)
            ->with('societeProfile')
            ->get();

        return response()->json([
            'total_utilisateurs'      => $totalUtilisateurs,
            'total_etudiants'         => $totalEtudiants,
            'total_societes'          => $totalSocietes,
            'total_stages'            => $totalStages,
            'total_candidatures'      => $totalCandidatures,
            'en_attente_approbation'  => $enAttenteApprobation,
            'inscriptions_recentes'   => $inscriptionsRecentes,
            'societes_en_attente'     => $societesEnAttente,
        ]);
    }

    // liste de tous les utilisateurs
    public function listeUtilisateurs(Request $request)
    {
        $utilisateurs = User::with(['etudiantProfile', 'societeProfile'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($utilisateurs);
    }

    // modifier un utilisateur
    public function modifierUtilisateur(Request $request, $id)
    {
        $request->validate([
            'name'  => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $id,
            'role'  => 'nullable|in:etudiant,societe,admin',
        ]);

        $utilisateur = User::findOrFail($id);
        $utilisateur->update($request->only(['name', 'email', 'role']));

        return response()->json([
            'message'     => 'Utilisateur mis à jour.',
            'utilisateur' => $utilisateur,
        ]);
    }

    // supprimer un utilisateur
    public function supprimerUtilisateur($id)
    {
        $utilisateur = User::findOrFail($id);

        // ne pas supprimer l'admin
        if ($utilisateur->role === 'admin') {
            return response()->json(['message' => 'Impossible de supprimer un administrateur.'], 403);
        }

        $utilisateur->delete();

        return response()->json(['message' => 'Utilisateur supprimé.']);
    }

    // approuver ou suspendre un compte société
    public function approuverUtilisateur(Request $request, $id)
    {
        $request->validate([
            'is_approved' => 'required|boolean',
        ]);

        $utilisateur = User::findOrFail($id);
        $utilisateur->update(['is_approved' => $request->is_approved]);

        $message = $request->is_approved ? 'Compte approuvé.' : 'Compte suspendu.';

        return response()->json([
            'message'     => $message,
            'utilisateur' => $utilisateur,
        ]);
    }

    // liste de tous les stages pour l'admin
    public function listeStages(Request $request)
    {
        $stages = Stage::with(['societe.societeProfile'])
            ->withCount('candidatures')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($stages);
    }

    // modifier un stage (admin)
    public function modifierStage(Request $request, $id)
    {
        $request->validate([
            'title'           => 'required|string|max:255',
            'description'     => 'required|string',
            'tasks'           => 'nullable|string',
            'skills_required' => 'nullable|string',
            'sector'          => 'nullable|string|max:100',
            'city'            => 'nullable|string|max:100',
            'duration'        => 'nullable|string|max:100',
            'deadline'        => 'nullable|date',
        ]);

        $stage = Stage::findOrFail($id);
        $stage->update($request->only([
            'title', 'description', 'tasks', 'skills_required',
            'sector', 'city', 'duration', 'deadline',
        ]));

        return response()->json(['message' => 'Stage mis à jour.', 'stage' => $stage]);
    }

    // supprimer un stage (admin)
    public function supprimerStage($id)
    {
        $stage = Stage::findOrFail($id);
        $stage->delete();

        return response()->json(['message' => 'Stage supprimé.']);
    }
}
