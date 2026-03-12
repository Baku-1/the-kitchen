import Link from "next/link";
import { UserButton, Show } from "@clerk/nextjs";
import { Bell } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-char/80 border-b border-smoke">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                <div className="flex items-center gap-8">
                    <Link href="/" className="text-3xl font-bebas text-transparent bg-clip-text bg-gradient-to-r from-ember to-heat tracking-wider">
                        THE KITCHEN
                    </Link>

                    <div className="hidden md:flex items-center gap-6 font-barlow-condensed text-lg tracking-wide uppercase text-smoke">
                        <Link href="/battles" className="hover:text-white-app transition-colors">Battles</Link>
                        <Link href="/leaderboard" className="hover:text-white-app transition-colors">Leaderboard</Link>
                        <Link href="/brackets" className="hover:text-white-app transition-colors">Brackets</Link>
                        <Link href="/artists" className="hover:text-white-app transition-colors">Artists</Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Show when="signed-in">
                        <button className="text-smoke hover:text-ember transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-ember rounded-full animate-pulse"></span>
                        </button>
                        <Link
                            href="/dashboard"
                            className="hidden sm:block text-sm font-barlow-condensed tracking-widest uppercase hover:text-ember transition-colors"
                        >
                            Dashboard
                        </Link>
                        <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 rounded-none border border-smoke" } }} />
                    </Show>

                    <Show when="signed-out">
                        <Link
                            href="/auth"
                            className="px-6 py-2 bg-char border hover:border-ember text-white-app font-barlow-condensed tracking-widest uppercase transition-colors clip-angled"
                            style={{ clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)" }}
                        >
                            Step Into The Kitchen
                        </Link>
                    </Show>
                </div>

            </div>
        </nav>
    );
}
