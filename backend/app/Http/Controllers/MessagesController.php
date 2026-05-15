<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessagesController extends Controller
{
    // liste des conversations (un interlocuteur distinct par conversation)
    public function mesConversations(Request $request)
    {
        $userId = $request->user()->id;

        // récupérer les derniers messages par conversation
        $conversations = Message::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy(function ($message) use ($userId) {
                // clé = l'autre personne dans la conversation
                return $message->sender_id === $userId
                    ? $message->receiver_id
                    : $message->sender_id;
            })
            ->map(function ($messages, $interlocuteurId) use ($userId) {
                $dernier = $messages->first();
                $interlocuteur = User::with(['etudiantProfile', 'societeProfile'])
                    ->find($interlocuteurId);

                $nonLus = $messages->where('receiver_id', $userId)
                    ->where('is_read', false)
                    ->count();

                return [
                    'interlocuteur_id'   => $interlocuteurId,
                    'interlocuteur'      => $interlocuteur,
                    'dernier_message'    => $dernier->content,
                    'dernier_message_at' => $dernier->created_at,
                    'non_lus'            => $nonLus,
                ];
            })
            ->values();

        return response()->json($conversations);
    }

    // récupérer tous les messages avec un interlocuteur donné
    public function conversation(Request $request, $interlocuteurId)
    {
        $userId = $request->user()->id;

        // marquer comme lus les messages reçus de cet interlocuteur
        Message::where('sender_id', $interlocuteurId)
            ->where('receiver_id', $userId)
            ->update(['is_read' => true]);

        $messages = Message::where(function ($q) use ($userId, $interlocuteurId) {
                $q->where('sender_id', $userId)->where('receiver_id', $interlocuteurId);
            })
            ->orWhere(function ($q) use ($userId, $interlocuteurId) {
                $q->where('sender_id', $interlocuteurId)->where('receiver_id', $userId);
            })
            ->with(['sender:id,name', 'receiver:id,name', 'stage:id,title'])
            ->orderBy('created_at', 'asc')
            ->get();

        $interlocuteur = User::with(['etudiantProfile', 'societeProfile'])->find($interlocuteurId);

        return response()->json([
            'messages'      => $messages,
            'interlocuteur' => $interlocuteur,
        ]);
    }

    // envoyer un message
    public function envoyer(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'content'     => 'required|string|max:2000',
            'stage_id'    => 'nullable|exists:stages,id',
        ]);

        $message = Message::create([
            'sender_id'   => $request->user()->id,
            'receiver_id' => $request->receiver_id,
            'content'     => $request->content,
            'stage_id'    => $request->stage_id,
        ]);

        $message->load(['sender:id,name', 'receiver:id,name']);

        return response()->json([
            'message'  => 'Message envoyé.',
            'data'     => $message,
        ], 201);
    }

    // nombre de messages non lus (pour le badge navbar)
    public function nonLus(Request $request)
    {
        $count = Message::where('receiver_id', $request->user()->id)
            ->where('is_read', false)
            ->count();

        return response()->json(['non_lus' => $count]);
    }
}
