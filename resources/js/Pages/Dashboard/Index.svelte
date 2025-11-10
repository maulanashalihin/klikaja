<script>
  import { inertia, router } from '@inertiajs/svelte';
  import AppHeader from '../../Components/AppHeader.svelte';
  import { Toast } from '../../Components/helper.js';
  import axios from 'axios';

  let { stats, recentLinks, user } = $props();

  function formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hari ini';
    if (days === 1) return 'Kemarin';
    if (days < 7) return `${days} hari lalu`;
    
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  }

  function openLink(alias) {
    window.open(`/${alias}`, '_blank');
  }

  async function copyToClipboard(alias) {
    try {
      await navigator.clipboard.writeText(`https://klikaja.com/${alias}`);
      Toast('Link berhasil disalin!', 'success');
    } catch (error) {
      Toast('Gagal menyalin link', 'error');
    }
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
      await axios.post(`/links/${linkId}/toggle`);
      Toast('Status link berhasil diubah!', 'success');
      router.reload();
    } catch (error) {
      Toast('Gagal mengubah status link', 'error');
    }
  }
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <!-- Header -->
  <AppHeader {user} currentPage="dashboard" />

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Welcome Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Selamat Datang, {user.name}! 👋
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Berikut adalah ringkasan aktivitas link Anda
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Links -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-[#FF6B35]" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"/>
            </svg>
          </div>
          <span class="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
            +{stats.newLinksThisMonth}
          </span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {formatNumber(stats.totalLinks)}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">Total Links</p>
      </div>

      <!-- Total Clicks -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-[#004E89]/10 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-[#004E89]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
            </svg>
          </div>
          <span class="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
            +{formatNumber(stats.clicksToday)}
          </span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {formatNumber(stats.totalClicks)}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">Total Klik</p>
      </div>

      <!-- Active Links -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
          </div>
          <span class="text-xs font-semibold text-gray-600 dark:text-gray-400">
            {Math.round((stats.activeLinks / stats.totalLinks) * 100)}%
          </span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {stats.activeLinks}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">Link Aktif</p>
      </div>

      <!-- Avg Click Rate -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-[#00D9FF]/10 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-[#00D9FF]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
            </svg>
          </div>
          <span class="text-xs font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/30 px-2 py-1 rounded">
            Per link
          </span>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {stats.avgClicksPerLink}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">Rata-rata Klik</p>
      </div>
    </div>

    <!-- Recent Links Section -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Link Terbaru</h2>
        <a
          href="/links"
          use:inertia
          class="text-sm font-semibold text-[#FF6B35] hover:text-[#ff5722] transition-colors duration-200"
        >
          Lihat Semua →
        </a>
      </div>

      {#if recentLinks.length === 0}
        <div class="px-6 py-12 text-center">
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Belum Ada Link
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            Mulai buat link pertama Anda sekarang!
          </p>
          <a
            href="/links/create"
            use:inertia
            class="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B35] text-white font-semibold rounded-lg hover:bg-[#ff5722] transition-colors duration-200"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
            </svg>
            Buat Link Baru
          </a>
        </div>
      {:else}
        <div class="space-y-4">
          {#each recentLinks as link}
            <div class="bg-white dark:bg-gray-800   p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
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
                      {formatNumber(link.click_count)} clicks
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
      {/if}
    </div>

    <!-- Quick Actions -->
    <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <a
        href="/links/create"
        use:inertia
        class="bg-gradient-to-br from-[#FF6B35] to-[#ff5722] rounded-xl p-6 text-white hover:shadow-lg transition-all duration-200 transform hover:scale-105"
      >
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-lg">Buat Link Baru</h3>
            <p class="text-sm opacity-90">Buat short link dengan fitur lengkap</p>
          </div>
        </div>
      </a>

      <a
        href="/links"
        use:inertia
        class="bg-gradient-to-br from-[#004E89] to-[#003d6b] rounded-xl p-6 text-white hover:shadow-lg transition-all duration-200 transform hover:scale-105"
      >
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-lg">Kelola Links</h3>
            <p class="text-sm opacity-90">Edit, hapus, dan atur semua link</p>
          </div>
        </div>
      </a>

      <a
        href="/analytics"
        use:inertia
        class="bg-gradient-to-br from-[#00D9FF] to-[#00b8d4] rounded-xl p-6 text-white hover:shadow-lg transition-all duration-200 transform hover:scale-105"
      >
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-lg">Lihat Analytics</h3>
            <p class="text-sm opacity-90">Analisa performa link Anda</p>
          </div>
        </div>
      </a>
    </div>
  </main>
</div>
