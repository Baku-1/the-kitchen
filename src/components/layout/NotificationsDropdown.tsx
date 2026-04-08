"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, CheckSquare, Music, ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { acceptAdminBattle } from "@/app/actions/battles";
import { useRouter } from "next/navigation";

export default function NotificationsDropdown({ userId }: { userId: string | null }) {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [working, setWorking] = useState<string | null>(null);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!userId) return;

        const loadNotifications = async () => {
            // First we need to get the user's DB ID from their clerk ID
            const { data: profile } = await supabase
                .from("users")
                .select("id")
                .eq("clerk_id", userId)
                .single();

            if (!profile) return;

            const { data } = await supabase
                .from("notifications")
                .select("*")
                .eq("user_id", profile.id)
                .order("created_at", { ascending: false })
                .limit(10);

            if (data) {
                setNotifications(data);
                setUnreadCount(data.filter((n: any) => !n.is_read).length);
            }
        };

        loadNotifications();
        
        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [userId, open]); // Reload when opened too

    const handleAccept = async (battleId: string, notificationId: string) => {
        setWorking(notificationId);
        try {
            const res = await acceptAdminBattle(battleId);
            setNotifications(prev => 
                prev.map((n: any) => n.id === notificationId ? { ...n, is_read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
            
            if (res.bothAccepted) {
                alert("Battle scheduled! You are locked in.");
                router.refresh();
            } else {
                alert("You've accepted! Waiting for the other artist to accept.");
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setWorking(null);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await supabase.from("notifications").update({ is_read: true }).eq("id", id);
            setNotifications(prev => 
                prev.map((n: any) => n.id === id ? { ...n, is_read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setOpen(!open)}
                className="relative p-2 text-smoke hover:text-white-app transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-ember rounded-full animate-pulse border border-char" />
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-char border border-smoke/30 shadow-2xl z-50 rounded-sm">
                    <div className="p-3 border-b border-smoke/30 bg-ash/50 flex justify-between items-center sticky top-0 z-10">
                        <span className="font-bebas text-white-app tracking-widest uppercase">Notifications</span>
                        {unreadCount > 0 && (
                            <span className="text-[10px] text-smoke uppercase font-black">{unreadCount} UNREAD</span>
                        )}
                    </div>
                    
                    <div className="flex flex-col">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-smoke/50 text-xs italic">
                                No new notifications. Keep cooking.
                            </div>
                        ) : (
                            notifications.map((n: any) => (
                                <div 
                                    key={n.id} 
                                    className={`p-4 border-b border-smoke/10 hover:bg-ash/30 transition-colors ${!n.is_read ? 'bg-ash/10' : 'opacity-70'}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-1 ${n.type === 'admin_booking' ? 'text-ember' : 'text-smoke'}`}>
                                            {n.type === 'admin_booking' ? <ShieldAlert className="w-4 h-4" /> : <Music className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] uppercase font-black tracking-widest text-smoke mb-1">{n.title}</p>
                                            <p className="text-sm font-barlow text-white-app leading-snug">{n.body}</p>
                                            
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="text-[9px] text-smoke/50 uppercase tracking-widest">
                                                    {new Date(n.created_at).toLocaleDateString()}
                                                </span>
                                                
                                                {!n.is_read && n.type === 'admin_booking' && n.battle_id && (
                                                    <button 
                                                        disabled={working === n.id}
                                                        onClick={() => handleAccept(n.battle_id!, n.id)}
                                                        className="text-[10px] px-2 py-1 bg-ember text-white-app font-black tracking-widest uppercase hover:bg-flame disabled:opacity-50 flex items-center gap-1"
                                                    >
                                                        {working === n.id ? "WAIT..." : <><CheckSquare className="w-3 h-3" /> ACCEPT</>}
                                                    </button>
                                                )}
                                                
                                                {!n.is_read && n.type !== 'admin_booking' && (
                                                    <button 
                                                        onClick={() => markAsRead(n.id)}
                                                        className="text-[10px] text-smoke hover:text-white-app uppercase tracking-widest"
                                                    >
                                                        Mark Read
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
