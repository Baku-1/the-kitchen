export interface UserProfile {
    id: string;          // Database UUID
    clerk_id: string;
    username: string;
    display_name: string | null;
    bio?: string | null;
    city?: string | null;
    country?: string | null;
    genre?: string | null;
    avatar_url?: string | null;
    clout_score: number;
    wins: number;
    losses: number;
    is_admin: boolean;
    created_at: string;
}

export type BattleStatus = 'pending' | 'accepted' | 'upcoming' | 'live' | 'voting' | 'completed' | 'cancelled' | 'ghost_a' | 'ghost_b' | 'declined';

export interface BattleData {
    id: string;
    artist_a_id: string;
    artist_b_id: string;
    challenger_id?: string;
    status: BattleStatus;
    genre: string;
    title?: string;
    description?: string;
    scheduled_at: string | null;
    vote_count_a: number;
    vote_count_b: number;
    winner_id?: string | null;
    is_admin_scheduled: boolean;
    artist_a_accepted: boolean;
    artist_b_accepted: boolean;
    livekit_room_name?: string | null;
    voting_closes_at?: string | null;
    created_at: string;

    // View joins
    artist_a?: Partial<UserProfile>;
    artist_b?: Partial<UserProfile>;
    challenger?: Partial<UserProfile>;
}

export interface ChatMessage {
    id: string;
    battle_id: string;
    user_id: string;
    message: string;
    is_flagged: boolean;
    created_at: string;
    user?: Partial<UserProfile>; // Join
}

export interface VoteData {
    id: string;
    battle_id: string;
    voter_id: string;
    voted_for_id: string;
    created_at: string;
}

export interface ApplicationData {
    id: string;
    user_id: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}
