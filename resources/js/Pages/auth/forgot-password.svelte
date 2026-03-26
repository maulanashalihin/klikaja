<script>
    import { inertia, router } from "@inertiajs/svelte";
    import KlikAjaLogo from "../../Components/KlikAjaLogo.svelte";
    import axios from "axios";

    let form = {
        email: "",
        phone: "",
    };

    let success = false;
    export let error;

    function submitForm() {
        axios.post("/forgot-password", form).then((response) => {
            success = true;
            form.email = "";
            form.phone = "";
        });
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
                <KlikAjaLogo size="small" />
            </div>
        </div>

        <!-- Forgot Password Card -->
        <div
            class="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden animate-slide-up"
        >
            <div class="p-8 sm:p-10">
                <!-- Header -->
                <div class="text-center mb-8">
                    <h1
                        class="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                    >
                        Lupa Password?
                    </h1>
                    <p class="text-gray-600 dark:text-gray-400">
                        Masukkan email Anda dan kami akan mengirimkan link untuk
                        reset password
                    </p>
                </div>

                {#if error}
                    <div
                        class="p-4 mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-slide-down"
                        role="alert"
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

                {#if success}
                    <div
                        class="p-4 mb-6 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 animate-slide-down"
                        role="alert"
                    >
                        <div class="flex items-center gap-3">
                            <svg
                                class="w-5 h-5 text-green-500 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                            <span
                                class="text-sm text-green-700 dark:text-green-400"
                                >Link reset password telah dikirim ke email
                                Anda!</span
                            >
                        </div>
                    </div>
                {/if}

                <form class="space-y-5" onsubmit={submitForm}>
                    <div>
                        <label
                            for="email"
                            class="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
                        >
                            Email
                        </label>
                        <input
                            bind:value={form.email}
                            type="email"
                            name="email"
                            id="email"
                            class="bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl w-full py-3 px-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-brand-orange-500/50 focus:border-transparent focus:outline-none transition-all duration-200"
                            placeholder="nama@email.com"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        class="w-full bg-brand-orange-500 hover:bg-brand-orange-600 rounded-xl shadow-md shadow-brand-orange-500/20 active:scale-[0.98] text-white font-semibold py-3.5 px-4 transition-all duration-200"
                    >
                        Kirim Link Reset
                    </button>

                    <p
                        class="text-sm text-gray-600 dark:text-gray-400 text-center"
                    >
                        Ingat password Anda? <a
                            href="/login"
                            use:inertia
                            class="font-semibold text-brand-orange-600 dark:text-brand-orange-400 hover:text-brand-orange-700 dark:hover:text-brand-orange-300 transition-colors"
                            >Masuk di sini</a
                        >
                    </p>
                </form>
            </div>
        </div>

        <!-- Additional Info -->
        <p class="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
            By continuing, you agree to our
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
