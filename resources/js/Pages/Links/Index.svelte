<script>
  import { inertia, router } from '@inertiajs/svelte';
  import AppHeader from '../../Components/AppHeader.svelte';
  import { Toast } from '../../Components/helper.js';
  import axios from 'axios';

  let { user, links, pagination, filters } = $props();

  let searchQuery = $state(filters.search || '');
  let statusFilter = $state(filters.status || 'all');

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(`https://klikaja.com/${text}`);
      Toast('Link berhasil disalin!', 'success');
    } catch (error) {
      Toast('Gagal menyalin link', 'error');
    }
  }

  function openLink(alias) {
    window.open(`/${alias}`, '_blank');
  }

  function handleSearch() {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    router.get(`/links?${params.toString()}`);
  }

  async function handleDelete(linkId) {
    if (confirm('Yakin ingin menghapus link ini?')) {
      try {
        await axios.delete(`/links/${linkId}`);
        Toast('Link berhasil dihapus!', 'success');
        router.reload();
      } catch (error) {
        Toast('Gagal menghapus link', 'error');
      }
    }
  }

  async function handleToggle(linkId) {
    try {
      const response = await axios.post(`/links/${linkId}/toggle`);
      Toast(response.data.message, 'success');
      router.reload();
    } catch (error) {
      Toast('Gagal mengubah status link', 'error');
    }
  }

  function goToPage(page) {
    const params = new URLSearchParams();
    params.set('page', page);
    if (searchQuery) params.set('search', searchQuery);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    router.get(`/links?${params.toString()}`);
  }
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <AppHeader {user} currentPage="links" />

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Links
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Kelola semua short link Anda
        </p>
      </div>

      <a
        href="/links/create"
        use:inertia
        class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#ff5722] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Buat Link Baru
      </a>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1">
          <input
            type="text"
            bind:value={searchQuery}
            onkeydown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Cari alias, title, atau description..."
            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <!-- Status Filter -->
        <select
          bind:value={statusFilter}
          onchange={handleSearch}
          class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent text-gray-900 dark:text-white"
        >
          <option value="all">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Nonaktif</option>
        </select>

        <!-- Search Button -->
        <button
          onclick={handleSearch}
          class="px-6 py-3 bg-[#FF6B35] text-white font-semibold rounded-lg hover:bg-[#ff5722] transition-colors duration-200"
        >
          Cari
        </button>
      </div>

      <!-- Stats Summary -->
      <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Menampilkan <span class="font-semibold text-gray-900 dark:text-white">{links.length}</span> dari 
          <span class="font-semibold text-gray-900 dark:text-white">{pagination.total}</span> links
        </p>
      </div>
    </div>

    <!-- Links List -->
    {#if links.length === 0}
      <!-- Empty State -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
        <svg class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Belum ada link
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Mulai buat short link pertama Anda sekarang!
        </p>
        <a
          href="/links/create"
          use:inertia
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#ff5722] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Buat Link Baru
        </a>
      </div>
    {:else}
      <!-- Links Grid -->
      <div class="space-y-4">
        {#each links as link}
          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <!-- Link Info -->
              <div class="flex-1 min-w-0">
                <!-- Title First -->
                {#if link.title}
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate">
                    {link.title}
                  </h3>
                {/if}

                <!-- Alias & Status -->
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
                    klikaja.com/{link.alias}
                  </span>
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold {link.is_active ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'}">
                    {link.is_active ? '✓ Active' : '✗ Inactive'}
                  </span>
                </div>

                <!-- Destination -->
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-2 truncate">
                  → {Array.isArray(link.urls) ? link.urls[0].url || link.urls[0] : link.urls}
                  {#if Array.isArray(link.urls) && link.urls.length > 1}
                    <span class="text-[#FF6B35] font-semibold">+{link.urls.length - 1} more</span>
                  {/if}
                </p>

                <!-- Stats -->
                <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {link.click_count} clicks
                  </span>
                  <span>•</span>
                  <span>{formatDate(link.created_at)}</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2">
                <!-- Copy Button -->
                <button
                  onclick={() => copyToClipboard(link.alias)}
                  class="p-2 text-gray-600 dark:text-gray-400 hover:text-[#FF6B35] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  title="Copy Link"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>

                <!-- Open Link Button -->
                <button
                  onclick={() => openLink(link.alias)}
                  class="p-2 text-gray-600 dark:text-gray-400 hover:text-[#00D9FF] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  title="Buka Link"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>

                <!-- Toggle Status -->
                <button
                  onclick={() => handleToggle(link.id)}
                  class="p-2 text-gray-600 dark:text-gray-400 hover:text-[#00D9FF] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  title={link.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </button>

                <!-- Analytics Button -->
                <a
                  href="/analytics/{link.alias}"
                  use:inertia
                  class="p-2 text-gray-600 dark:text-gray-400 hover:text-[#00D9FF] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  title="Analytics"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </a>

                <!-- Edit Button -->
                <a
                  href="/links/{link.id}/edit"
                  use:inertia
                  class="p-2 text-gray-600 dark:text-gray-400 hover:text-[#004E89] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  title="Edit"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </a>

                <!-- Delete Button -->
                <button
                  onclick={() => handleDelete(link.id)}
                  class="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                  title="Delete"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>

      <!-- Pagination -->
      {#if pagination.totalPages > 1}
        <div class="mt-8 flex items-center justify-center gap-2">
          <!-- Previous Button -->
          <button
            onclick={() => goToPage(pagination.page - 1)}
            disabled={pagination.page === 1}
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Previous
          </button>

          <!-- Page Numbers -->
          {#each Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
            const start = Math.max(1, pagination.page - 2);
            return start + i;
          }).filter(p => p <= pagination.totalPages) as page}
            <button
              onclick={() => goToPage(page)}
              class="px-4 py-2 rounded-lg {page === pagination.page 
                ? 'bg-[#FF6B35] text-white' 
                : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} transition-colors duration-200"
            >
              {page}
            </button>
          {/each}

          <!-- Next Button -->
          <button
            onclick={() => goToPage(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Next
          </button>
        </div>
      {/if}
    {/if}
  </main>
</div>
