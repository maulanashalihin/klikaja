<script>
    import { inertia, router } from "@inertiajs/svelte";
    import KlikAjaLogo from "../../Components/KlikAjaLogo.svelte";

    let form = {
        email: "",
        password: "",
    };
    export let error;

    function submitForm() {
        router.post("/login", { email: form.email, password: form.password });
    }
</script>

<section
    class="min-h-screen bg-gray-50/50 dark:bg-[#0B1120] flex items-center justify-center px-4 py-12"
>
    <!-- Animated Background Elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div
            class="absolute -top-40 -right-40 w-96 h-96 bg-brand-orange-400/10 dark:bg-brand-orange-500/5 rounded-full blur-3xl animate-float-slow"
        ></div>
        <div
            class="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-cyan-400/10 dark:bg-brand-cyan-500/5 rounded-full blur-3xl animate-float"
        ></div>
    </div>

    <div class="w-full max-w-md relative z-10">
        <!-- Logo with gradient icon container -->
        <div class="text-center mb-8 animate-slide-down">
            <div
                class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
            >
                <a href="/" use:inertia class="block">
                    <KlikAjaLogo size="small" />
                </a>
            </div>
        </div>

        <!-- Login Card -->
        <div
            class="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden animate-slide-up"
        >
            <div class="p-8 sm:p-10">
                <!-- Header -->
                <div class="text-center mb-8">
                    <h1
                        class="text-3xl font-bold text-gray-900 dark:text-white mb-2"
                    >
                        Welcome Back
                    </h1>
                    <p class="text-gray-600 dark:text-gray-400">
                        Sign in to your account to continue
                    </p>
                </div>

                <!-- Error Message -->
                {#if error}
                    <div
                        class="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-slide-down"
                    >
                        <div class="flex items-center gap-3">
                            <svg
                                class="w-5 h-5 text-red-500 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                            <p class="text-sm text-red-700 dark:text-red-400">
                                {error}
                            </p>
                        </div>
                    </div>
                {/if}

                <!-- Google Login Button -->
                <a
                    href="/google/redirect"
                    class="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-brand-orange-300 dark:hover:border-brand-orange-600 transform hover:-translate-y-0.5 transition-all duration-200 shadow-sm hover:shadow-md mb-6"
                >
                    <svg class="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Continue with Google
                </a>

                <!-- Divider -->
                <div class="relative mb-6">
                    <div class="absolute inset-0 flex items-center">
                        <div
                            class="w-full border-t border-gray-200 dark:border-gray-700"
                        ></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span
                            class="px-4 bg-white dark:bg-[#111827] text-gray-500 dark:text-gray-400 font-medium"
                            >or continue with email</span
                        >
                    </div>
                </div>

                <!-- Login Form -->
                <form class="space-y-5" onsubmit={submitForm}>
                    <!-- Email Input -->
                    <div>
                        <label
                            for="email"
                            class="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
                        >
                            Email Address
                        </label>
                        <input
                            bind:value={form.email}
                            required
                            type="email"
                            name="email"
                            id="email"
                            class="bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl w-full py-3 px-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-brand-orange-500/50 focus:border-transparent focus:outline-none transition-all duration-200"
                            placeholder="you@example.com"
                            autocomplete="email"
                        />
                    </div>

                    <!-- Password Input -->
                    <div>
                        <label
                            for="password"
                            class="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
                        >
                            Password
                        </label>
                        <input
                            bind:value={form.password}
                            required
                            type="password"
                            name="password"
                            id="password"
                            class="bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl w-full py-3 px-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-brand-orange-500/50 focus:border-transparent focus:outline-none transition-all duration-200"
                            placeholder="••••••••"
                            autocomplete="current-password"
                        />
                    </div>

                    <!-- Forgot Password -->
                    <div class="flex items-center justify-end">
                        <a
                            href="/forgot-password"
                            use:inertia
                            class="text-sm font-semibold text-brand-orange-600 dark:text-brand-orange-400 hover:text-brand-orange-700 dark:hover:text-brand-orange-300 transition-colors"
                        >
                            Forgot password?
                        </a>
                    </div>

                    <!-- Submit Button -->
                    <button
                        type="submit"
                        class="w-full bg-brand-orange-500 hover:bg-brand-orange-600 rounded-xl shadow-md shadow-brand-orange-500/20 active:scale-[0.98] text-white font-semibold py-3.5 px-4 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <svg
                            class="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                            />
                        </svg>
                        Sign In
                    </button>
                </form>

                <!-- Sign Up Link -->
                <p
                    class="mt-8 text-center text-sm text-gray-600 dark:text-gray-400"
                >
                    Don't have an account?
                    <a
                        href="/register"
                        use:inertia
                        class="font-semibold text-brand-orange-600 dark:text-brand-orange-400 hover:text-brand-orange-700 dark:hover:text-brand-orange-300 transition-colors"
                    >
                        Create free account
                    </a>
                </p>
            </div>

            <!-- Card Footer with Benefits -->
            <div
                class="px-8 py-6 bg-gray-50 dark:bg-gray-900/30 border-t border-gray-100 dark:border-white/5"
            >
                <div
                    class="flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400"
                >
                    <div class="flex items-center gap-2">
                        <svg
                            class="w-4 h-4 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        <span>Free forever</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <svg
                            class="w-4 h-4 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        <span>No credit card</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <svg
                            class="w-4 h-4 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        <span>Instant access</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Additional Info -->
        <p class="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
            By signing in, you agree to our
            <a
                href="/terms"
                class="text-brand-orange-600 dark:text-brand-orange-400 hover:underline font-medium"
                >Terms of Service</a
            >
            and
            <a
                href="/privacy"
                class="text-brand-orange-600 dark:text-brand-orange-400 hover:underline font-medium"
                >Privacy Policy</a
            >
        </p>
    </div>
</section>
