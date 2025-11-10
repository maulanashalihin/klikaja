<script>
  import { inertia, router } from '@inertiajs/svelte';
  import AppHeader from '../../Components/AppHeader.svelte';

  let { user, errors = {} } = $props();

  // Form state
  let urls = $state([{ url: '', weight: 100 }]);
  let alias = $state('');
  let title = $state('');
  let description = $state('');
  let rotationMethod = $state('random');
  let password = $state('');
  let expiresAt = $state('');
  let maxClicks = $state('');
  let isAdvancedOpen = $state(false);
  let aliasAvailable = $state(null);
  let checkingAlias = $state(false);

  // Add URL field
  function addUrl() {
    urls.push({ url: '', weight: 100 });
  }

  // Remove URL field
  function removeUrl(index) {
    if (urls.length > 1) {
      urls = urls.filter((_, i) => i !== index);
    }
  }

  // Check alias availability
  let aliasCheckTimeout;
  function checkAlias() {
    if (!alias || alias.length < 3) {
      aliasAvailable = null;
      return;
    }

    clearTimeout(aliasCheckTimeout);
    checkingAlias = true;

    aliasCheckTimeout = setTimeout(async () => {
      try {
        const response = await fetch(`/api/alias/check/${alias}`);
        const data = await response.json();
        aliasAvailable = data.available;
      } catch (error) {
        console.error('Error checking alias:', error);
      } finally {
        checkingAlias = false;
      }
    }, 500);
  }

  // Generate random alias
  function generateAlias() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    alias = result;
    checkAlias();
  }

  // Submit form
  function handleSubmit() {
    const formData = {
      urls: rotationMethod === 'weighted' 
        ? urls.map(u => ({ url: u.url, weight: parseInt(u.weight) || 100 }))
        : urls.map(u => u.url),
      alias: alias || undefined,
      title: title || undefined,
      description: description || undefined,
      rotation_method: rotationMethod,
      password: password || undefined,
      expires_at: expiresAt ? new Date(expiresAt).getTime() : undefined,
      max_clicks: maxClicks ? parseInt(maxClicks) : undefined
    };

    router.post('/links', formData);
  }

  // Watch alias changes
  $effect(() => {
    if (alias) {
      checkAlias();
    }
  });
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <!-- Header -->
  <AppHeader {user} currentPage="links" />

  <!-- Main Content -->
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-6">
      
      <!-- URLs Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">
            Destination URLs
          </h2>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {urls.length} URL{urls.length > 1 ? 's' : ''}
          </span>
        </div>

        <div class="space-y-3">
          {#each urls as urlItem, index}
            <div class="flex gap-3">
              <div class="flex-1">
                <input
                  type="url"
                  bind:value={urlItem.url}
                  placeholder="https://example.com/your-long-url"
                  required
                  class="w-full px-4 py-3 bg-gray-50 focus:outline-none dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              {#if rotationMethod === 'weighted'}
                <div class="w-24">
                  <input
                    type="number"
                    bind:value={urlItem.weight}
                    min="1"
                    max="100"
                    placeholder="Weight"
                    class="w-full px-3 py-3 bg-gray-50 focus:outline-none dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-gray-900 dark:text-white text-center"
                  />
                </div>
              {/if}

              {#if urls.length > 1}
                <button
                  type="button"
                  onclick={() => removeUrl(index)}
                  class="px-3 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                  title="Remove URL"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                </button>
              {/if}
            </div>
          {/each}
        </div>

        <button
          type="button"
          onclick={addUrl}
          class="mt-3 w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors duration-200 font-medium"
        >
          + Tambah URL
        </button>

        {#if errors.urls}
          <p class="mt-2 text-sm text-red-600 dark:text-red-400">{errors.urls}</p>
        {/if}
      </div>

      <!-- Alias Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Custom Alias (Optional)
        </h2>

        <div class="flex gap-3">
          <div class="flex-1 relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span class="text-gray-500 dark:text-gray-400 font-mono text-sm">
                klikaja.com/
              </span>
            </div>
            <input
              type="text"
              bind:value={alias}
              placeholder="my-custom-alias"
              pattern="[a-zA-Z0-9-_]+"
              class="w-full pl-32 pr-4 py-3 bg-gray-50 focus:outline-none dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-mono"
            />
            
            {#if checkingAlias}
              <div class="absolute inset-y-0 right-0 pr-4 flex items-center">
                <svg class="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            {:else if aliasAvailable === true}
              <div class="absolute inset-y-0 right-0 pr-4 flex items-center">
                <svg class="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
              </div>
            {:else if aliasAvailable === false}
              <div class="absolute inset-y-0 right-0 pr-4 flex items-center">
                <svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
              </div>
            {/if}
          </div>

          <button
            type="button"
            onclick={generateAlias}
            class="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 font-medium whitespace-nowrap"
          >
            🎲 Generate
          </button>
        </div>

        {#if aliasAvailable === false}
          <p class="mt-2 text-sm text-red-600 dark:text-red-400">
            Alias ini sudah digunakan. Silakan pilih yang lain.
          </p>
        {:else if aliasAvailable === true}
          <p class="mt-2 text-sm text-green-600 dark:text-green-400">
            ✓ Alias tersedia!
          </p>
        {/if}

        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Kosongkan untuk generate otomatis. Hanya huruf, angka, dash (-), dan underscore (_).
        </p>

        {#if errors.alias}
          <p class="mt-2 text-sm text-red-600 dark:text-red-400">{errors.alias}</p>
        {/if}
      </div>

      <!-- Metadata Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Metadata (Optional)
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              bind:value={title}
              placeholder="My Campaign Link"
              maxlength="255"
              class="w-full px-4 py-3 bg-gray-50 focus:outline-none dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              bind:value={description}
              placeholder="Describe this link..."
              rows="3"
              class="w-full px-4 py-3 bg-gray-50 focus:outline-none dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Advanced Options -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          type="button"
          onclick={() => isAdvancedOpen = !isAdvancedOpen}
          class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
        >
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">
            Advanced Options
          </h2>
          <svg
            class="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200"
            class:rotate-180={isAdvancedOpen}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>

        {#if isAdvancedOpen}
          <div class="px-6 pb-6 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <!-- Rotation Method -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rotation Method
              </label>
              <div class="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onclick={() => rotationMethod = 'random'}
                  class="px-4 py-3 rounded-lg border-2 transition-all duration-200 {rotationMethod === 'random' ? 'border-[#FF6B35] bg-[#FF6B35]/10 text-[#FF6B35] font-semibold' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'}"
                >
                  🎲 Random
                </button>
                <button
                  type="button"
                  onclick={() => rotationMethod = 'sequential'}
                  class="px-4 py-3 rounded-lg border-2 transition-all duration-200 {rotationMethod === 'sequential' ? 'border-[#FF6B35] bg-[#FF6B35]/10 text-[#FF6B35] font-semibold' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'}"
                >
                  ➡️ Sequential
                </button>
                <button
                  type="button"
                  onclick={() => rotationMethod = 'weighted'}
                  class="px-4 py-3 rounded-lg border-2 transition-all duration-200 {rotationMethod === 'weighted' ? 'border-[#FF6B35] bg-[#FF6B35]/10 text-[#FF6B35] font-semibold' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'}"
                >
                  ⚖️ Weighted
                </button>
              </div>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {#if rotationMethod === 'random'}
                  Redirect ke URL secara acak setiap kali diklik
                {:else if rotationMethod === 'sequential'}
                  Redirect ke URL secara berurutan (round-robin)
                {:else}
                  Redirect berdasarkan bobot yang ditentukan
                {/if}
              </p>
            </div>

            <!-- Password Protection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password Protection
              </label>
              <input
                type="password"
                bind:value={password}
                placeholder="Leave empty for no password"
                class="w-full px-4 py-3 bg-gray-50 focus:outline-none dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                User harus memasukkan password sebelum redirect
              </p>
            </div>

            <!-- Expiration Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Expiration Date
              </label>
              <input
                type="datetime-local"
                bind:value={expiresAt}
                class="w-full px-4 py-3 bg-gray-50 focus:outline-none dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-gray-900 dark:text-white"
              />
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Link akan otomatis nonaktif setelah tanggal ini
              </p>
            </div>

            <!-- Max Clicks -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maximum Clicks
              </label>
              <input
                type="number"
                bind:value={maxClicks}
                min="1"
                placeholder="Unlimited"
                class="w-full px-4 py-3 bg-gray-50 focus:outline-none dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Link akan otomatis nonaktif setelah mencapai jumlah klik ini
              </p>
            </div>
          </div>
        {/if}
      </div>

      <!-- Submit Button -->
      <div class="flex gap-4">
        <a
          href="/links"
          use:inertia
          class="flex-1 px-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 font-semibold text-center"
        >
          Batal
        </a>
        <button
          type="submit"
          class="flex-1 px-6 py-4 bg-gradient-to-r from-[#FF6B35] to-[#ff5722] text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold"
        >
          🚀 Buat Link
        </button>
      </div>
    </form>
  </main>
</div>

<style>
  .rotate-180 {
    transform: rotate(180deg);
  }
</style>
