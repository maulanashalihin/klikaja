<script>
  import { router } from '@inertiajs/svelte';
  
  let { alias, title, error } = $props();
  
  let password = $state('');
  let isSubmitting = $state(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!password) return;
    
    isSubmitting = true;
    // Redirect with password as query param
    window.location.href = `/${alias}?password=${encodeURIComponent(password)}`;
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-[#004E89] via-[#1A659E] to-[#00D9FF] flex items-center justify-center p-4">
  <div class="max-w-md w-full">
    <!-- Card -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
      <!-- Icon -->
      <div class="flex justify-center mb-6">
        <div class="w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#ff5722] rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>

      <!-- Title -->
      <h1 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
        🔒 Link Terproteksi
      </h1>
      
      {#if title}
        <p class="text-center text-gray-600 dark:text-gray-400 mb-6">
          {title}
        </p>
      {:else}
        <p class="text-center text-gray-600 dark:text-gray-400 mb-6">
          Link ini memerlukan password untuk diakses
        </p>
      {/if}

      <!-- Error Message -->
      {#if error}
        <div class="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p class="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            {error}
          </p>
        </div>
      {/if}

      <!-- Form -->
      <form onsubmit={handleSubmit}>
        <div class="mb-6">
          <label for="password" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            bind:value={password}
            placeholder="Masukkan password"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !password}
          class="w-full px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#ff5722] text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Memverifikasi...' : '🔓 Buka Link'}
        </button>
      </form>

      <!-- Footer -->
      <div class="mt-6 text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Powered by <span class="font-bold text-[#FF6B35]">KlikAja</span>
        </p>
      </div>
    </div>

    <!-- Info -->
    <div class="mt-4 text-center">
      <p class="text-sm text-white/80">
        💡 Hubungi pemilik link jika Anda lupa password
      </p>
    </div>
  </div>
</div>
