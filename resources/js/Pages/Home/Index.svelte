<script>
  import { router } from '@inertiajs/svelte';
  import KlikAjaLogo from '../../Components/KlikAjaLogo.svelte';
  
  let url = '';
  let customAlias = '';
  let isLoading = false;
  
  function handleShorten() {
    if (!url) return;
    
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
            <div class="flex items-center gap-2">
              <span class="text-gray-500 dark:text-gray-400 text-sm">klikaja.app/</span>
              <input
                bind:value={customAlias}
                type="text"
                id="alias"
                placeholder="promo-ramadan"
                class="flex-1 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-3 focus:border-[#FF6B35] focus:ring-0 focus:outline-none transition-colors duration-150"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            disabled={isLoading}
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
        Kenapa Pilih <span class="text-[#FF6B35]">KlikAja</span>?
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
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-2">
          <KlikAjaLogo size="small" />
          <span class="text-sm text-gray-500 dark:text-gray-400">
            © 2025 KlikAja. All rights reserved.
          </span>
        </div>
        <div class="flex gap-6 text-sm">
          <a href="#" class="text-gray-600 hover:text-[#FF6B35] dark:text-gray-400 dark:hover:text-[#00D9FF] transition-colors">
            Tentang
          </a>
          <a href="#" class="text-gray-600 hover:text-[#FF6B35] dark:text-gray-400 dark:hover:text-[#00D9FF] transition-colors">
            Fitur
          </a>
          <a href="#" class="text-gray-600 hover:text-[#FF6B35] dark:text-gray-400 dark:hover:text-[#00D9FF] transition-colors">
            Harga
          </a>
          <a href="#" class="text-gray-600 hover:text-[#FF6B35] dark:text-gray-400 dark:hover:text-[#00D9FF] transition-colors">
            Kontak
          </a>
        </div>
      </div>
    </div>
  </footer>
</div>
