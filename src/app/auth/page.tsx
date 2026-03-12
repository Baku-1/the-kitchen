import { SignIn, SignUp } from "@clerk/nextjs";

export default function AuthPage({
    searchParams,
}: {
    searchParams: { mode?: string };
}) {
    const isSignIn = searchParams.mode !== "signup";

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ember/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="z-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-6xl text-ember mb-2">THE KITCHEN</h1>
                    <p className="font-barlow-condensed text-xl text-heat tracking-widest uppercase">
                        If you can't take the heat, get out of the kitchen.
                    </p>
                </div>

                {isSignIn ? <SignIn routing="hash" /> : <SignUp routing="hash" />}

                <div className="mt-8 text-center text-sm text-smoke/60 font-barlow">
                    <p>By entering, you agree to The Kitchen&apos;s rules of the house.</p>
                </div>
            </div>
        </div>
    );
}
