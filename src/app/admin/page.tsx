export default function AdminDashboard() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-16 w-full font-barlow">
            <div className="mb-12">
                <h1 className="text-5xl font-bebas text-white-app tracking-wide mb-2">ADMIN CLEARANCE DIRECTIVE</h1>
                <p className="text-ember font-barlow-condensed tracking-widest uppercase">
                    Moderation Queue & Override Controls
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Moderation Queue */}
                <section>
                    <h2 className="text-3xl font-bebas text-white-app mb-6 border-b border-smoke pb-2">FLAGGED CONTENT</h2>
                    <div className="flex flex-col gap-4">
                        <div className="bg-char border border-ember p-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 px-2 py-1 bg-ember text-white-app text-[10px] uppercase tracking-widest font-bold">STRIKE 2 PENDING</div>
                            <p className="text-smoke text-sm mb-1">Message by <span className="text-white-app font-bold">@drill_king</span> in Battle <span className="text-white-app">ba4</span></p>
                            <p className="bg-ash p-3 text-white-app italic border border-smoke mb-4">"I know where u live, dropping a pin on your head rn"</p>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-ember text-white-app font-bebas tracking-wide flex-1 hover:bg-flame clip-angled">BAN USER (STRIKE 3)</button>
                                <button className="px-4 py-2 bg-char border border-smoke text-smoke font-bebas tracking-wide flex-1 hover:text-white-app clip-angled">DISMISS FLAG</button>
                            </div>
                        </div>
                        <div className="bg-ash border border-smoke p-4 text-center text-smoke">
                            No other items in queue.
                        </div>
                    </div>
                </section>

                {/* User Management */}
                <section>
                    <h2 className="text-3xl font-bebas text-white-app mb-6 border-b border-smoke pb-2">USER OVERSIGHT</h2>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2 mb-2">
                            <input type="text" placeholder="Search by username or ID..." className="flex-1 bg-char border border-smoke p-3 outline-none focus:border-ember text-white-app" />
                            <button className="px-6 bg-char border border-smoke hover:border-ember text-smoke hover:text-white-app font-bebas text-xl clip-angled">SEARCH</button>
                        </div>
                        <div className="bg-ash border border-smoke p-4 text-center text-smoke">
                            Search to manage strikes, suspensions, or clout overrides.
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
