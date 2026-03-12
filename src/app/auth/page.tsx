import { SignIn, SignUp } from "@clerk/nextjs";

export default async function AuthPage({
    searchParams,
}: {
    searchParams: Promise<{ mode?: string }>;
}) {
    const params = await searchParams;
    const isSignIn = params.mode !== "signup";

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ember/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="z-10 w-full max-w-md">
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-8xl font-bebas text-white-app mb-2 tracking-wide drop-shadow-[0_0_15px_rgba(255,69,0,0.3)]">THE KITCHEN</h1>
                    <p className="font-barlow-condensed text-xl text-ember tracking-[0.2em] uppercase font-bold">
                        If you can't take the heat, get out of the kitchen.
                    </p>
                </div>

                <div className="bg-ash border border-smoke p-1 clip-angled shadow-2xl overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ember via-flame to-heat"></div>
                    <div className="p-4 bg-char/50">
                        {isSignIn ? (
                            <SignIn
                                routing="hash"
                                appearance={{
                                    elements: {
                                        card: "bg-transparent shadow-none border-none",
                                        headerTitle: "text-white-app font-bebas text-3xl",
                                        headerSubtitle: "text-smoke font-barlow",
                                        socialButtonsBlockButton: "bg-ash border border-smoke text-white-app hover:bg-smoke/30 transition-all font-barlow font-bold uppercase tracking-widest text-xs h-12",
                                        dividerLine: "bg-smoke/20",
                                        dividerText: "text-smoke uppercase text-[10px] tracking-widest font-bold",
                                        formFieldLabel: "text-smoke uppercase text-[10px] tracking-widest font-bold mb-1",
                                        formFieldInput: "bg-char border border-smoke text-white-app p-3 font-barlow transition-all focus:border-ember outline-none h-12",
                                        formButtonPrimary: "bg-ember hover:bg-flame text-white-app font-bebas text-2xl tracking-widest h-14 clip-angled shadow-[0_5px_15px_rgba(255,69,0,0.3)]",
                                        footerActionText: "text-smoke font-barlow",
                                        footerActionLink: "text-ember font-bold hover:text-flame transition-colors",
                                        identityPreviewText: "text-white-app",
                                        identityPreviewEditButtonIcon: "text-ember"
                                    }
                                }}
                            />
                        ) : (
                            <SignUp
                                routing="hash"
                                appearance={{
                                    elements: {
                                        card: "bg-transparent shadow-none border-none",
                                        headerTitle: "text-white-app font-bebas text-3xl",
                                        headerSubtitle: "text-smoke font-barlow",
                                        socialButtonsBlockButton: "bg-ash border border-smoke text-white-app hover:bg-smoke/30 transition-all font-barlow font-bold uppercase tracking-widest text-xs h-12",
                                        dividerLine: "bg-smoke/20",
                                        dividerText: "text-smoke uppercase text-[10px] tracking-widest font-bold",
                                        formFieldLabel: "text-smoke uppercase text-[10px] tracking-widest font-bold mb-1",
                                        formFieldInput: "bg-char border border-smoke text-white-app p-3 font-barlow transition-all focus:border-ember outline-none h-12",
                                        formButtonPrimary: "bg-ember hover:bg-flame text-white-app font-bebas text-2xl tracking-widest h-14 clip-angled shadow-[0_5px_15px_rgba(255,69,0,0.3)]",
                                        footerActionText: "text-smoke font-barlow",
                                        footerActionLink: "text-ember font-bold hover:text-flame transition-colors"
                                    }
                                }}
                            />
                        )}
                    </div>
                </div>

                <div className="mt-8 text-center text-[10px] text-smoke/40 font-barlow uppercase tracking-widest">
                    <p>New to The Kitchen? Creating an account means accepting our rules.</p>
                </div>
            </div>
        </div>
    );
}
