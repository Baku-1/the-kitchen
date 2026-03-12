"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, ShieldAlert } from "lucide-react";

export default function AdminTrigger() {
    const [input, setInput] = useState("");
    const [revealed, setRevealed] = useState(false);

    const checkTrigger = (val: string) => {
        setInput(val);
        if (val === "@dmin@ccess") {
            setRevealed(true);
        }
    };

    if (revealed) {
        return (
            <Link
                href="/admin"
                className="flex items-center gap-2 px-4 py-2 bg-ember text-white-app font-bebas text-lg tracking-widest animate-pulse clip-angled shadow-[0_0_15px_rgba(255,69,0,0.5)]"
            >
                <ShieldAlert className="w-4 h-4" /> ACCESS PORTAL
            </Link>
        );
    }

    return (
        <div className="relative group/trigger">
            <input
                type="password"
                value={input}
                onChange={e => checkTrigger(e.target.value)}
                placeholder="..."
                className="w-12 h-8 bg-transparent border-b border-smoke/10 focus:border-ember/30 outline-none text-[8px] text-smoke/20 font-black uppercase text-center transition-all focus:w-32 focus:placeholder:opacity-0"
            />
            <Lock className="w-3 h-3 absolute right-0 bottom-2 text-smoke/10 group-focus-within/trigger:text-ember/30 pointer-events-none" />
        </div>
    );
}
