<script>
  import { router } from '@inertiajs/svelte';
  import Icon from '../../Components/Icon.svelte';

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

<div class="min-h-screen bg-gradient-to-br from-brand-orange-500 via-orange-500 to-cyan-500 flex items-center justify-center p-4">
  <div class="max-w-md w-full">
    <!-- Card -->
    <div class="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl p-8">
      <!-- Icon -->
      <div class="flex justify-center mb-6">
        <div class="w-16 h-16 bg-gradient-to-br from-brand-orange-500 to-brand-orange-400 rounded-full flex items-center justify-center">
          <Icon name="lock" size={32} class="text-white" />
        </div>
      </div>

      <!-- Title -->
      <h1 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
        <Icon name="lock" size={24} />
        Protected Link
      </h1>

      {#if title}
        <p class="text-center text-gray-600 dark:text-gray-400 mb-6">
          {title}
        </p>
      {:else}
        <p class="text-center text-gray-600 dark:text-gray-400 mb-6">
          This link requires a password to access
        </p>
      {/if}

      <!-- Error Message -->
      {#if error}
        <div class="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p class="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
            <Icon name="alert-circle" size={20} />
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
            placeholder="Enter password"
            class="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-orange-500/50 focus:border-transparent bg-gray-50/50 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !password}
          class="w-full px-6 py-3 bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-semibold rounded-xl shadow-md shadow-brand-orange-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {#if isSubmitting}
            <Icon name="loader" size={20} class="animate-spin" />
            Verifying...
          {:else}
            <Icon name="unlock" size={20} />
            Unlock Link
          {/if}
        </button>
      </form>

      <!-- Footer -->
      <div class="mt-6 text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Powered by <span class="font-bold text-brand-orange-500">KlikAja</span>
        </p>
      </div>
    </div>

    <!-- Info -->
    <div class="mt-4 text-center">
      <p class="text-sm text-white/80 flex items-center justify-center gap-2">
        <Icon name="info" size={16} />
        Contact the link owner if you forgot the password
      </p>
    </div>
  </div>
</div>
