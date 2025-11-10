<script>
  import { inertia, router } from '@inertiajs/svelte';
  import AppHeader from '../../Components/AppHeader.svelte';
  import { Toast } from '../../Components/helper.js';
  import axios from 'axios';

  let { user, link, errors = {} } = $props();

  // Form state - Pre-fill with existing data
  let urls = $state(
    Array.isArray(link.urls) 
      ? link.urls.map(u => typeof u === 'string' ? { url: u, weight: 100 } : u)
      : [{ url: link.urls, weight: 100 }]
  );
  let alias = $state(link.alias);
  let title = $state(link.title || '');
  let description = $state(link.description || '');
  let rotationMethod = $state(link.rotation_method || 'random');
  let password = $state('');
  let expiresAt = $state(link.expires_at ? new Date(link.expires_at).toISOString().slice(0, 16) : '');
  let maxClicks = $state(link.max_clicks || '');
  let isAdvancedOpen = $state(false);
  let isActive = $state(link.is_active);

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

  // Submit form
  async function handleSubmit() {
    const formData = {
      urls: rotationMethod === 'weighted' 
        ? urls.map(u => ({ url: u.url, weight: parseInt(u.weight) || 100 }))
        : urls.map(u => u.url),
      title: title || undefined,
      description: description || undefined,
      rotation_method: rotationMethod,
      password: password || undefined,
      expires_at: expiresAt ? new Date(expiresAt).getTime() : undefined,
      max_clicks: maxClicks ? parseInt(maxClicks) : undefined,
      is_active: isActive
    };

    try {
      await axios.put(`/links/${link.id}`, formData);
      Toast('Link berhasil diupdate!', 'success');
       
    } catch (error) {
      Toast(error.response?.data?.message || 'Gagal update link', 'error');
    }
  }
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <!-- Header -->
  <AppHeader {user} currentPage="links" />

  <!-- Main Content -->
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Link Info Card -->
    <div class="bg-gradient-to-r from-[#FF6B35]/10 to-[#004E89]/10 dark:from-[#FF6B35]/20 dark:to-[#004E89]/20 rounded-xl p-6 mb-6 border border-[#FF6B35]/20">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              klikaja.com/{alias}
            </h3>
            <span class="px-3 py-1 rounded-full text-xs font-semibold {isActive ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'}">
              {isActive ? '✓ Active' : '✗ Inactive'}
            </span>
          </div>
          <div class="grid grid-cols-3 gap-4 mt-4">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Total Clicks</p>
              <p class="text-2xl font-bold text-[#FF6B35]">{link.click_count || 0}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Created</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                {new Date(link.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Last Updated</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                {new Date(link.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

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
            <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div class="flex-1">
                <input
                  type="url"
                  bind:value={urlItem.url}
                  placeholder="https://example.com/your-long-url"
                  required
                  class="w-full px-4 py-3 bg-gray-50 focus:outline-none dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <div class="flex gap-2 sm:gap-3">
                {#if rotationMethod === 'weighted'}
                  <div class="w-24 sm:w-24">
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
                    class="px-4 sm:px-3 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 flex-shrink-0"
                    title="Remove URL"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                  </button>
                {/if}
              </div>
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

      <!-- Alias Section (Read-only) -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Custom Alias
        </h2>

        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span class="text-gray-500 dark:text-gray-400 font-mono text-sm">
              klikaja.com/
            </span>
          </div>
          <input
            type="text"
            value={alias}
            disabled
            class="w-full pl-32 pr-4 py-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-400 font-mono cursor-not-allowed"
          />
        </div>

        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          ℹ️ Alias tidak dapat diubah setelah link dibuat
        </p>
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
            <!-- Link Status Toggle -->
            <div>
              <label class="flex items-center justify-between cursor-pointer">
                <div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Link Status</span>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {isActive ? 'Link aktif dan dapat diakses' : 'Link nonaktif, redirect akan ditolak'}
                  </p>
                </div>
                <div class="relative">
                  <input
                    type="checkbox"
                    bind:checked={isActive}
                    class="sr-only peer"
                  />
                  <div class="w-14 h-7 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF6B35]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#FF6B35]"></div>
                </div>
              </label>
            </div>

            <!-- Rotation Method -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rotation Method
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                placeholder={link.password ? "Enter new password to change" : "Leave empty for no password"}
                class="w-full px-4 py-3 bg-gray-50 focus:outline-none dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {#if link.password}
                  ⚠️ Link ini sudah memiliki password. Isi field ini untuk mengubahnya.
                {:else}
                  User harus memasukkan password sebelum redirect
                {/if}
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
                {#if link.max_clicks}
                  <br />
                  <span class="text-[#FF6B35] font-semibold">
                    Current: {link.click_count}/{link.max_clicks} clicks
                  </span>
                {/if}
              </p>
            </div>
          </div>
        {/if}
      </div>

      <!-- Submit Button -->
      <div class="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
        <a
          href="/links"
          use:inertia
          class="w-full sm:flex-1 px-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 font-semibold text-center"
        >
          Batal
        </a>
        <button
          type="submit"
          class="w-full sm:flex-1 px-6 py-4 bg-gradient-to-r from-[#FF6B35] to-[#ff5722] text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold"
        >
          💾 Simpan Perubahan
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
