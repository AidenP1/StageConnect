<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\EtudiantProfile;
use App\Models\SocieteProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // inscription d'un nouvel utilisateur
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role'     => 'required|in:etudiant,societe',
        ]);

        $utilisateur = User::create([
            'name'        => $request->name,
            'email'       => $request->email,
            'password'    => Hash::make($request->password),
            'role'        => $request->role,
            'is_approved' => $request->role === 'etudiant',
        ]);

        // créer le profil selon le rôle
        if ($request->role === 'etudiant') {
            EtudiantProfile::create(['user_id' => $utilisateur->id]);
        } else {
            SocieteProfile::create(['user_id' => $utilisateur->id]);
        }

        Auth::login($utilisateur);

        return response()->json([
            'message'     => 'Inscription réussie.',
            'utilisateur' => $utilisateur,
        ], 201);
    }

    // connexion de l'utilisateur
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Email ou mot de passe incorrect.',
            ], 401);
        }

        $utilisateur = Auth::user();

        if ($utilisateur->role === 'societe' && !$utilisateur->is_approved) {
            Auth::guard('web')->logout();
            return response()->json([
                'message' => 'Votre compte est en attente d\'approbation par l\'admin.',
            ], 403);
        }

        $request->session()->regenerate();

        $utilisateur->load(['etudiantProfile', 'societeProfile']);

        return response()->json([
            'message'     => 'Connexion réussie.',
            'utilisateur' => $utilisateur,
        ]);
    }

    // déconnexion
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Déconnexion réussie.']);
    }

    // récupérer l'utilisateur connecté (avec son profil)
    public function me(Request $request)
    {
        $utilisateur = $request->user()->load(['etudiantProfile', 'societeProfile']);
        return response()->json(['utilisateur' => $utilisateur]);
    }
}
