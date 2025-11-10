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
  let mobileMenuOpen = $state(false);
  
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
  
  function handleShorten(e) {
    e.preventDefault();
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
    <header class="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <!-- Logo -->
                <a href="/" class="flex items-center gap-2 text-2xl">
                    <div class="relative">
                        <img src="/public/favicon-32x32.png" alt="KlikAja Logo" class="w-8 h-8">
                    </div>
                    <span class="font-bold">
                        <span class="text-[#FF6B35]">Klik</span><span class="text-[#004E89] dark:text-white">Aja</span>
                    </span>
                </a>

                <!-- Desktop Navigation -->
                <div class="hidden md:flex items-center space-x-6">
                    <a href="/about" class="text-gray-700 dark:text-gray-300 hover:text-[#FF6B35] dark:hover:text-[#00D9FF] transition-colors font-medium">
                        Tentang
                    </a>
                    <a href="/features" class="text-gray-700 dark:text-gray-300 hover:text-[#FF6B35] dark:hover:text-[#00D9FF] transition-colors font-medium">
                        Fitur
                    </a>
                    <a href="/pricing" class="text-gray-700 dark:text-gray-300 hover:text-[#FF6B35] dark:hover:text-[#00D9FF] transition-colors font-medium">
                        Harga
                    </a>
                    <a href="/login" class="text-[#FF6B35] dark:text-[#00D9FF] hover:text-[#004E89] dark:hover:text-[#FF6B35] font-semibold transition-colors">
                        Masuk
                    </a>
                    <a href="/register" class="bg-[#FF6B35] hover:bg-[#004E89] text-white font-semibold px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg">
                        Daftar Gratis
                    </a>
                </div>

                <!-- Mobile Menu Button -->
                <button
                    onclick={() => mobileMenuOpen = !mobileMenuOpen}
                    class="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Toggle menu"
                >
                    {#if mobileMenuOpen}
                        <!-- Close Icon -->
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    {:else}
                        <!-- Hamburger Icon -->
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                    {/if}
                </button>
            </div>

            <!-- Mobile Navigation -->
            {#if mobileMenuOpen}
                <div class="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
                    <div class="flex flex-col space-y-3">
                        <a href="/about" class="text-gray-700 dark:text-gray-300 hover:text-[#FF6B35] dark:hover:text-[#00D9FF] transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                            Tentang
                        </a>
                        <a href="/features" class="text-gray-700 dark:text-gray-300 hover:text-[#FF6B35] dark:hover:text-[#00D9FF] transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                            Fitur
                        </a>
                        <a href="/pricing" class="text-gray-700 dark:text-gray-300 hover:text-[#FF6B35] dark:hover:text-[#00D9FF] transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                            Harga
                        </a>
                        <div class="border-t border-gray-200 dark:border-gray-800 pt-3 mt-3 space-y-3">
                            <a href="/login" class="block text-center text-[#FF6B35] dark:text-[#00D9FF] hover:text-[#004E89] dark:hover:text-[#FF6B35] font-semibold px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                Masuk
                            </a>
                            <a href="/register" class="block text-center bg-[#FF6B35] hover:bg-[#004E89] text-white font-semibold px-4 py-3 rounded-lg transition-all shadow-md hover:shadow-lg">
                                Daftar Gratis
                            </a>
                        </div>
                    </div>
                </div>
            {/if}
        </nav>
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
        <form onsubmit={handleShorten} class="space-y-4">
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

  <!-- Roadmap Section -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        🗺️ Roadmap Pengembangan
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        Kami terus berinovasi untuk memberikan pengalaman terbaik
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Phase 1: MVP - COMPLETED -->
      <div class="relative">
        <div class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-2xl border-2 border-green-500 dark:border-green-600 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              Phase 1: MVP
            </h3>
            <span class="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              ✅ LIVE
            </span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Nov 2025
          </p>
          <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li class="flex items-start gap-2">
              <span class="text-green-500 mt-0.5">✓</span>
              <span>Link shortening & custom alias</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-500 mt-0.5">✓</span>
              <span>URL rotation (Sequential, Random, Weighted)</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-500 mt-0.5">✓</span>
              <span>Password protection & expiration</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-500 mt-0.5">✓</span>
              <span>Analytics dashboard & QR codes</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-green-500 mt-0.5">✓</span>
              <span>Dark mode & mobile responsive</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Phase 2: Enhanced Features - IN PROGRESS -->
      <div class="relative">
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-2xl border-2 border-blue-500 dark:border-blue-600 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              Phase 2: Enhanced
            </h3>
            <span class="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
              🔄 NEXT
            </span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Dec 2025 - Jan 2026
          </p>
          <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li class="flex items-start gap-2">
              <span class="text-blue-500 mt-0.5">⏳</span>
              <span>Link health monitoring</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-500 mt-0.5">⏳</span>
              <span>Real-time analytics (WebSocket)</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-500 mt-0.5">⏳</span>
              <span>Team collaboration & workspaces</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-500 mt-0.5">⏳</span>
              <span>Custom branded domains</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-500 mt-0.5">⏳</span>
              <span>Advanced link scheduling</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Phase 3: Premium Features - PLANNED -->
      <div class="relative">
        <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-2xl border-2 border-purple-500 dark:border-purple-600 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              Phase 3: Premium
            </h3>
            <span class="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              📋 PLANNED
            </span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Q1 2026
          </p>
          <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li class="flex items-start gap-2">
              <span class="text-purple-500 mt-0.5">○</span>
              <span>API for developers</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-purple-500 mt-0.5">○</span>
              <span>A/B testing for links</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-purple-500 mt-0.5">○</span>
              <span>Integrations (Zapier, Slack, etc)</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-purple-500 mt-0.5">○</span>
              <span>Advanced geo-targeting</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-purple-500 mt-0.5">○</span>
              <span>White-label solutions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Feedback CTA -->
    <div class="mt-12 text-center">
      <div class="inline-block bg-gradient-to-r from-[#FF6B35]/10 to-[#004E89]/10 dark:from-[#FF6B35]/20 dark:to-[#00D9FF]/20 rounded-2xl p-6 border border-[#FF6B35]/30 dark:border-[#00D9FF]/30">
        <p class="text-gray-700 dark:text-gray-300 mb-3">
          💡 <span class="font-semibold">Punya ide fitur?</span> Kami ingin mendengar dari Anda!
        </p>
        <a 
          href="mailto:maulana@drip.id?subject=Feature Request - KlikAja" 
          class="inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-[#ff5722] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <span>📧</span>
          <span>Kirim Saran Fitur</span>
        </a>
      </div>
    </div>
  </section>

  <!-- Open Source Section -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl border border-gray-700">
      <div class="flex flex-col md:flex-row items-center gap-8">
        <!-- Left: Content -->
        <div class="flex-1 text-center md:text-left">
          <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <span class="text-2xl">⭐</span>
            <span class="text-sm font-semibold">100% Open Source</span>
          </div>
          <h2 class="text-3xl md:text-4xl font-bold mb-4">
            Gratis, Terbuka, dan Transparan
          </h2>
          <p class="text-lg text-gray-300 mb-6">
            KlikAja adalah proyek open source yang dapat Anda gunakan, modifikasi, dan deploy sendiri. 
            Kode sumber tersedia untuk semua orang di GitHub.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a 
              href="https://github.com/maulanashalihin/klikaja" 
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>View on GitHub</span>
            </a>
            <a 
              href="https://github.com/maulanashalihin/klikaja/blob/main/LICENSE" 
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/20 transition-all duration-200"
            >
              <span>📄</span>
              <span>MIT License</span>
            </a>
          </div>
        </div>

        <!-- Right: Stats -->
        <div class="flex-shrink-0">
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <div class="text-3xl font-bold text-[#00D9FF]">100%</div>
              <div class="text-sm text-gray-300 mt-1">Free Forever</div>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <div class="text-3xl font-bold text-[#00D9FF]">MIT</div>
              <div class="text-sm text-gray-300 mt-1">License</div>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <div class="text-3xl font-bold text-[#00D9FF]">⭐</div>
              <div class="text-sm text-gray-300 mt-1">Star on GitHub</div>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <div class="text-3xl font-bold text-[#00D9FF]">🚀</div>
              <div class="text-sm text-gray-300 mt-1">Self-Host</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tech Stack -->
      <div class="mt-8 pt-8 border-t border-white/20">
        <div class="text-center mb-4">
          <div class="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 px-4 py-2 rounded-full mb-3">
            <span class="text-2xl">⚡</span>
            <span class="text-sm font-bold text-green-300">Built in 1 Day!</span>
          </div>
          <p class="text-sm text-gray-400">
            Powered by <a href="https://laju.dev" target="_blank" rel="noopener" class="text-[#00D9FF] hover:underline font-semibold">laju.dev</a> - Modern fullstack framework
          </p>
        </div>
        <p class="text-sm text-gray-400 text-center mb-4 mt-6">with modern technologies:</p>
        <div class="flex flex-wrap justify-center gap-3">
          <span class="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-sm border border-white/20">Svelte 5</span>
          <span class="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-sm border border-white/20">HyperExpress</span>
          <span class="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-sm border border-white/20">SQLite</span>
          <span class="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-sm border border-white/20">TailwindCSS</span>
          <span class="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-sm border border-white/20">TypeScript</span>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
    <div class="bg-gradient-to-r from-[#FF6B35] to-[#004E89] rounded-3xl p-12 text-white">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">
        Siap Untuk Mulai?
      </h2>
      <p class="text-xl mb-8 opacity-90">
        Gunakan hosted version atau deploy sendiri - pilihan ada di tangan Anda!
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="/register" class="inline-block bg-white text-[#FF6B35] font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          Coba Hosted Version
        </a>
        <a href="https://github.com/maulanashalihin/klikaja#installation" target="_blank" rel="noopener noreferrer" class="inline-block bg-white/10 backdrop-blur-sm border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white/20 transition-all duration-200">
          Self-Host Guide
        </a>
      </div>
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

      <!-- Footer Links -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Product</h3>
          <ul class="space-y-2 text-sm">
            <li><a href="/features" class="text-gray-600 hover:text-[#FF6B35] dark:text-gray-400 dark:hover:text-[#00D9FF] transition-colors">Fitur</a></li>
            <li><a href="/pricing" class="text-gray-600 hover:text-[#FF6B35] dark:text-gray-400 dark:hover:text-[#00D9FF] transition-colors">Harga</a></li>
            <li><a href="https://github.com/maulanashalihin/klikaja#installation" target="_blank" class="text-gray-600 hover:text-[#FF6B35] dark:text-gray-400 dark:hover:text-[#00D9FF] transition-colors">Self-Host</a></li>
          </ul>
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Company</h3>
          <ul class="space-y-2 text-sm">
            <li><a href="/about" class="text-gray-600 hover:text-[#FF6B35] dark:text-gray-400 dark:hover:text-[#00D9FF] transition-colors">Tentang</a></li>
            <li><a href="/contact" class="text-gray-600 hover:text-[#FF6B35] dark:text-gray-400 dark:hover:text-[#00D9FF] transition-colors">Kontak</a></li>
            <li><a href="https://github.com/maulanashalihin/klikaja" target="_blank" class="text-gray-600 hover:text-[#FF6B35] dark:text-gray-400 dark:hover:text-[#00D9FF] transition-colors">GitHub</a></li>
          </ul>
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Legal</h3>
          <ul class="space-y-2 text-sm">
            <li><a href="/privacy" class="text-gray-600 hover:text-[#FF6B35] dark:text-gray-400 dark:hover:text-[#00D9FF] transition-colors">Privacy Policy</a></li>
            <li><a href="/terms" class="text-gray-600 hover:text-[#FF6B35] dark:text-gray-400 dark:hover:text-[#00D9FF] transition-colors">Terms of Service</a></li>
            <li><a href="https://github.com/maulanashalihin/klikaja/blob/main/LICENSE" target="_blank" class="text-gray-600 hover:text-[#FF6B35] dark:text-gray-400 dark:hover:text-[#00D9FF] transition-colors">MIT License</a></li>
          </ul>
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-3">Resources</h3>
          <ul class="space-y-2 text-sm">
            <li><a href="https://github.com/maulanashalihin/klikaja#readme" target="_blank" class="text-gray-600 hover:text-[#FF6B35] dark:text-gray-400 dark:hover:text-[#00D9FF] transition-colors">Documentation</a></li>
            <li><a href="https://github.com/maulanashalihin/klikaja/issues" target="_blank" class="text-gray-600 hover:text-[#FF6B35] dark:text-gray-400 dark:hover:text-[#00D9FF] transition-colors">Report Bug</a></li>
            <li><a href="https://laju.dev" target="_blank" class="text-gray-600 hover:text-[#FF6B35] dark:text-gray-400 dark:hover:text-[#00D9FF] transition-colors">Built with laju.dev</a></li>
          </ul>
        </div>
      </div>

      <div class="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-2">
          <KlikAjaLogo size="small" />
          <span class="text-sm text-gray-500 dark:text-gray-400">
            © 2025 KlikAja. Open Source under MIT License.
          </span>
        </div>
        <div class="flex gap-4 text-sm">
          <a href="https://github.com/maulanashalihin/klikaja" target="_blank" rel="noopener" class="text-gray-600 hover:text-[#FF6B35] dark:text-gray-400 dark:hover:text-[#00D9FF] transition-colors" aria-label="GitHub">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a href="mailto:maulana@drip.id" class="text-gray-600 hover:text-[#FF6B35] dark:text-gray-400 dark:hover:text-[#00D9FF] transition-colors" aria-label="Email">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</div>
