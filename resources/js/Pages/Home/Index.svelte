<script>
  import { router } from '@inertiajs/svelte';
  import KlikAjaLogo from '../../Components/KlikAjaLogo.svelte';
  import axios from 'axios';
  
  let url = $state('');
  let customAlias = $state('');
  let isLoading = $state(false);
  let isCheckingAlias = $state(false);
  let aliasAvailable = $state(null);
  let debounceTimer;
  
  // Debounce alias check
  async function checkAliasAvailability(alias) {
    if (!alias || alias.trim() === '') {
      aliasAvailable = null;
      return;
    }

    isCheckingAlias = true;
    
    try {
      const response = await axios.get(`/api/alias/check/${alias}`);
      aliasAvailable = response.data.available;
    } catch (error) {
      console.error('Error checking alias:', error);
      aliasAvailable = null;
    } finally {
      isCheckingAlias = false;
    }
  }

  // Watch customAlias changes with debounce
  $effect(() => {
    if (customAlias) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        checkAliasAvailability(customAlias);
      }, 500);
    } else {
      aliasAvailable = null;
    }
  });
  
  function handleShorten() {
    if (!url) return;
    if (customAlias && aliasAvailable === false) {
      return; // Don't submit if alias is taken
    }
    
    isLoading = true;
    router.post('/shorten', {
      url: url,
      alias: customAlias || null
    }, {
      onFinish: () => {
        isLoading = false;
      }
    });
  }
  
  // Features data
  const features = [
    {
      icon: '⚡',
      title: 'Cepat & Mudah',
      description: 'Perpendek link dalam hitungan detik tanpa perlu login'
    },
    {
      icon: '📊',
      title: 'Analytics Real-time',
      description: 'Lihat statistik klik, lokasi, dan device secara real-time'
    },
    {
      icon: '🎨',
      title: 'Custom Alias',
      description: 'Buat link yang mudah diingat dengan alias custom'
    },
    {
      icon: '📱',
      title: 'QR Code Gratis',
      description: 'Setiap link otomatis dapat QR code untuk kemudahan sharing'
    },
    {
      icon: '🔒',
      title: 'Aman & Terpercaya',
      description: 'Link monitoring dan password protection untuk keamanan'
    },
    {
      icon: '🚀',
      title: 'Link Rotation',
      description: 'Satu link pendek untuk multiple URL dengan rotation otomatis'
    }
  ];
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
  <!-- Header -->
  <header class="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <KlikAjaLogo />
        
        <div class="flex items-center gap-4">
          <a href="/login" class="text-sm font-medium text-gray-700 hover:text-[#FF6B35] dark:text-gray-300 dark:hover:text-[#00D9FF] transition-colors duration-200">
            Masuk
          </a>
          <a href="/register" class="px-4 py-2 text-sm font-semibold text-white bg-[#FF6B35] hover:bg-[#004E89] rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            Daftar Gratis
          </a>
        </div>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
    <!-- Early Access Banner -->
    <div class="max-w-3xl mx-auto mb-8">
      <div class="bg-gradient-to-r from-[#FF6B35]/10 to-[#004E89]/10 dark:from-[#FF6B35]/20 dark:to-[#004E89]/20 border-2 border-[#FF6B35]/30 rounded-xl p-4 text-center">
        <div class="flex items-center justify-center gap-2 mb-2">
          <span class="text-2xl">🚀</span>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Early Access</h3>
        </div>
        <p class="text-sm text-gray-700 dark:text-gray-300">
          KlikAja masih dalam tahap pengembangan awal. Jika menemukan masalah, silakan laporkan ke
          <a href="mailto:maulana@drip.id" class="text-[#FF6B35] hover:text-[#004E89] dark:hover:text-[#00D9FF] font-semibold underline">
            maulana@drip.id
          </a>
        </p>
      </div>
    </div>

    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
        <span class="text-[#FF6B35]">Satu Klik</span>, Semua Terhubung
      </h1>
      <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-2">
        Link yang lebih <span class="text-[#004E89] dark:text-[#00D9FF] font-semibold">cerdas</span>, 
        lebih <span class="text-[#004E89] dark:text-[#00D9FF] font-semibold">cepat</span>, 
        dan lebih <span class="text-[#004E89] dark:text-[#00D9FF] font-semibold">terukur</span>
      </p>
      <p class="text-gray-500 dark:text-gray-500">
        Perpendek, lacak, dan optimalkan link Anda dengan mudah
      </p>
    </div>

    <!-- Quick Shorten Widget -->
    <div class="max-w-3xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
        <form on:submit|preventDefault={handleShorten} class="space-y-4">
          <!-- URL Input -->
          <div>
            <label for="url" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Paste Link Panjang Anda
            </label>
            <input
              bind:value={url}
              type="url"
              id="url"
              placeholder="https://example.com/very-long-url-here"
              required
              class="w-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:border-[#FF6B35] focus:ring-0 focus:outline-none transition-colors duration-150"
            />
          </div>

          <!-- Custom Alias (Optional) -->
          <div>
            <label for="alias" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Custom Alias <span class="text-gray-400 font-normal">(opsional)</span>
            </label>
            <div class="relative">
              <div class="flex items-center gap-2">
                <span class="text-gray-500 dark:text-gray-400 text-sm">klikaja.app/</span>
                <div class="flex-1 relative">
                  <input
                    bind:value={customAlias}
                    type="text"
                    id="alias"
                    placeholder="promo-ramadan"
                    class="w-full bg-white dark:bg-gray-700 border-2 {aliasAvailable === false ? 'border-red-500' : aliasAvailable === true ? 'border-green-500' : 'border-gray-300 dark:border-gray-600'} text-gray-900 dark:text-white rounded-lg px-4 py-3 pr-10 focus:border-[#FF6B35] focus:ring-0 focus:outline-none transition-colors duration-150"
                  />
                  {#if isCheckingAlias}
                    <div class="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg class="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  {:else if customAlias && aliasAvailable === true}
                    <div class="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                  {:else if customAlias && aliasAvailable === false}
                    <div class="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                  {/if}
                </div>
              </div>
              {#if customAlias && aliasAvailable === false}
                <p class="mt-2 text-sm text-red-600 dark:text-red-400">
                  ❌ Alias sudah digunakan, pilih yang lain
                </p>
              {:else if customAlias && aliasAvailable === true}
                <p class="mt-2 text-sm text-green-600 dark:text-green-400">
                  ✅ Alias tersedia!
                </p>
              {/if}
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            disabled={isLoading || (customAlias && aliasAvailable === false)}
            class="w-full bg-[#FF6B35] hover:bg-[#004E89] text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {#if isLoading}
              <span class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </span>
            {:else}
              🚀 Perpendek Sekarang
            {/if}
          </button>

          <p class="text-xs text-center text-gray-500 dark:text-gray-400">
            Tanpa login • Gratis • Hasil instan • Bisa diklaim nanti
          </p>
        </form>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white dark:bg-gray-800/50 rounded-3xl my-16">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Kenapa Pilih <span class="text-[#FF6B35]">KlikAja.app</span>?
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        Fitur lengkap untuk kebutuhan link shortening Anda
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each features as feature}
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-[#FF6B35] dark:hover:border-[#00D9FF] transition-all duration-200 hover:shadow-lg">
          <div class="text-4xl mb-4">{feature.icon}</div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {feature.title}
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            {feature.description}
          </p>
        </div>
      {/each}
    </div>
  </section>

  <!-- CTA Section -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
    <div class="bg-gradient-to-r from-[#FF6B35] to-[#004E89] rounded-3xl p-12 text-white">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">
        Siap Untuk Mulai?
      </h2>
      <p class="text-xl mb-8 opacity-90">
        Daftar gratis dan dapatkan akses ke semua fitur premium
      </p>
      <a href="/register" class="inline-block bg-white text-[#FF6B35] font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
        Daftar Sekarang - Gratis!
      </a>
    </div>
  </section>

  <!-- Footer -->
  <footer class="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Early Access Notice -->
      <div class="text-center mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          🚀 <span class="font-semibold text-[#FF6B35]">Early Access</span> - KlikAja sedang dalam pengembangan aktif.
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">
          Ada masalah? Hubungi kami di <a href="mailto:maulana@drip.id" class="text-[#FF6B35] hover:underline font-medium">maulana@drip.id</a>
        </p>
      </div>

      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-2">
          <KlikAjaLogo size="small" />
          <span class="text-sm text-gray-500 dark:text-gray-400">
            © 2025 KlikAja. All rights reserved.
          </span>
        </div>
        <div class="flex gap-6 text-sm">
          <a href="mailto:maulana@drip.id" class="text-gray-600 hover:text-[#FF6B35] dark:text-gray-400 dark:hover:text-[#00D9FF] transition-colors">
            Kontak
          </a>
          <a href="https://github.com" target="_blank" rel="noopener" class="text-gray-600 hover:text-[#FF6B35] dark:text-gray-400 dark:hover:text-[#00D9FF] transition-colors">
            GitHub
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener" class="text-gray-600 hover:text-[#FF6B35] dark:text-gray-400 dark:hover:text-[#00D9FF] transition-colors">
            Twitter
          </a>
        </div>
      </div>
    </div>
  </footer>
</div>
