<script>
    import { inertia, router } from "@inertiajs/svelte";
    import KlikAjaLogo from "../../Components/KlikAjaLogo.svelte";
    import { password_generator } from "../../Components/helper";

    export let id;
    export let error;

    let form = {
        password: "",
        password_confirmation: "",
        id,
    };

    function generatePassword() {
        const retVal = password_generator(10);
        form.password = retVal;
        form.password_confirmation = retVal;
    }

    function submitForm() {
        if (form.password != form.password_confirmation) {
            alert("Password dan konfirmasi password harus sama");
            return false;
        }

        router.post(`/reset-password`, form);
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
                class="w-12 h-12 bg-gradient-to-br from-brand-orange-500 to-brand-orange-400 rounded-xl flex items-center justify-center mx-auto mb-4"
            >
                <KlikAjaLogo size="small" />
            </div>
        </div>

        <!-- Reset Password Card -->
        <div
            class="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden animate-slide-up"
        >
            <div class="p-8 sm:p-10">
                <!-- Header -->
                <div class="text-center mb-8">
                    <h1
                        class="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                    >
                        Buat Password Baru
                    </h1>
                    <p class="text-gray-600 dark:text-gray-400">
                        Masukkan password baru untuk akun Anda
                    </p>
                </div>

                {#if error}
                    <div
                        class="p-4 mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-slide-down"
                        role="alert"
                    >
                        <div class="flex items-center gap-3">
                            <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                            </svg>
                            <p class="text-sm text-red-700 dark:text-red-400">{error}</p>
                        </div>
                    </div>
                {/if}

                <form class="space-y-5" onsubmit={submitForm}>
                    <div>
                        <label
                            for="password"
                            class="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
                            >Password Baru</label
                        >
                        <input
                            bind:value={form.password}
                            type="password"
                            name="password"
                            id="password"
                            placeholder="••••••••"
                            class="bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl w-full py-3 px-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-brand-orange-500/50 focus:border-transparent focus:outline-none transition-all duration-200"
                            required
                        />
                        <button
                            type="button"
                            onclick={generatePassword}
                            class="text-xs text-brand-orange-600 dark:text-brand-orange-400 hover:text-brand-orange-700 dark:hover:text-brand-orange-300 font-medium transition-colors duration-200 mt-1"
                            >Generate Password</button
                        >
                    </div>
                    <div>
                        <label
                            for="confirm-password"
                            class="block text-sm font-semibold text-gray-900 dark:text-white mb-2"
                            >Konfirmasi Password</label
                        >
                        <input
                            bind:value={form.password_confirmation}
                            type="password"
                            name="confirm-password"
                            id="confirm-password"
                            placeholder="••••••••"
                            class="bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl w-full py-3 px-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-brand-orange-500/50 focus:border-transparent focus:outline-none transition-all duration-200"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        class="w-full bg-brand-orange-500 hover:bg-brand-orange-600 rounded-xl shadow-md shadow-brand-orange-500/20 active:scale-[0.98] text-white font-semibold py-3.5 px-4 transition-all duration-200"
                    >
                        Reset Password
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
            <a href="/terms" class="text-brand-orange-600 dark:text-brand-orange-400 hover:underline font-medium">Terms of Service</a>
            and
            <a href="/privacy" class="text-brand-orange-600 dark:text-brand-orange-400 hover:underline font-medium">Privacy Policy</a>
        </p>
    </div>
</section>
