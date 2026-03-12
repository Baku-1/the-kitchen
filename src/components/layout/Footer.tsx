import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full bg-char py-12 border-t border-smoke">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">

                <div className="flex flex-col items-center md:items-start gap-2">
                    <Link href="/" className="text-3xl font-bebas text-ember tracking-wider">
                        THE KITCHEN
                    </Link>
                    <p className="font-barlow-condensed text-sm text-smoke uppercase tracking-widest">
                        If you can&apos;t take the heat, get out of the kitchen.
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 font-barlow text-sm text-smoke/80 hover:text-smoke transition-colors">
                    <Link href="/terms" className="hover:text-white-app">Terms</Link>
                    <Link href="/rules" className="hover:text-white-app">Community Rules</Link>
                    <Link href="/for-artists" className="hover:text-white-app">For Artists</Link>
                    <Link href="/contact" className="hover:text-white-app">Contact</Link>
                </div>

                <div className="text-xs text-smoke/50 font-barlow">
                    &copy; {new Date().getFullYear()} The Kitchen. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
