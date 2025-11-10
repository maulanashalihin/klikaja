<script>
  import { inertia } from '@inertiajs/svelte';
  import KlikAjaLogo from '../../Components/KlikAjaLogo.svelte';
  
  export let link; // { alias, short_url, original_url, qr_code_path, claim_token, created_at }
  
  let copied = false;
  
  function copyToClipboard() {
    navigator.clipboard.writeText(link.short_url).then(() => {
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    });
  }
  
  function shareToWhatsApp() {
    const text = encodeURIComponent(`Check out this link: ${link.short_url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }
  
  function shareToTwitter() {
    const text = encodeURIComponent(`Check this out: ${link.short_url}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
  <!-- Header -->
  <header class="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <a href="/">
          <KlikAjaLogo />
        </a>
        
        <div class="flex items-center gap-2 sm:gap-4">
          <a href="/login" class="text-sm font-medium text-gray-700 hover:text-[#FF6B35] dark:text-gray-300 dark:hover:text-[#00D9FF] transition-colors duration-200 px-3 py-2">
            Masuk
          </a>
          <a href="/register" class="px-4 py-2 text-sm font-semibold text-white bg-[#FF6B35] hover:bg-[#004E89] rounded-lg transition-all duration-200 shadow-md hover:shadow-lg min-h-[40px] flex items-center">
            Daftar Gratis
          </a>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Success Message -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
        <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        Link Berhasil Diperpendek! 🎉
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Link Anda siap untuk dibagikan
      </p>
    </div>

    <!-- Link Card -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 mb-6">
      <!-- Short URL -->
      <div class="mb-6">
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Link Pendek Anda
        </label>
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="text"
            value={link.short_url}
            readonly
            class="flex-1 bg-gray-50 dark:bg-gray-700 border-2 focus:outline-none border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-base sm:text-lg"
          />
          <button
            on:click={copyToClipboard}
            class="px-6 py-3 bg-[#FF6B35] hover:bg-[#004E89] text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap min-h-[48px]"
          >
            {#if copied}
              ✓ Copied!
            {:else}
              📋 Copy
            {/if}
          </button>
        </div>
      </div>

      <!-- Original URL -->
      <div class="mb-6">
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Link Asli
        </label>
        <div class="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3">
          <p class="text-gray-700 dark:text-gray-300 break-all text-sm">
            {link.original_url}
          </p>
        </div>
      </div>

      <!-- QR Code -->
      {#if link.qr_code_path}
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            QR Code
          </label>
          <div class="flex justify-center bg-white p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <img src={link.qr_code_path} alt="QR Code" class="w-48 h-48" />
          </div>
          <p class="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
            Scan untuk membuka link
          </p>
        </div>
      {/if}

      <!-- Share Buttons -->
      <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Bagikan ke
        </label>
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            on:click={shareToWhatsApp}
            class="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 min-h-[48px]"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            WhatsApp
          </button>
          
          <button
            on:click={shareToTwitter}
            class="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 min-h-[48px]"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            Twitter
          </button>
        </div>
      </div>
    </div>

    <!-- Claim Banner -->
    <div class="bg-gradient-to-r from-[#FF6B35] to-[#004E89] rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-xl mb-6">
      <div class="flex flex-col md:flex-row items-start gap-4 md:gap-6">
        <div class="flex-1 w-full">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-2xl sm:text-3xl">🎁</span>
            <h2 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
              Klaim Link Ini Sekarang!
            </h2>
          </div>
          <p class="text-sm sm:text-base md:text-lg opacity-90 mb-3 sm:mb-4">
            Daftar <span class="font-bold">GRATIS</span> dan dapatkan akses penuh ke:
          </p>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <!-- Analytics -->
            <div class="flex items-start gap-2 sm:gap-3 bg-white/10 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
              <div class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-xs sm:text-sm mb-0.5 sm:mb-1">📊 Analytics Real-time</h3>
                <p class="text-xs opacity-80 leading-tight">Lihat klik, lokasi, device, browser secara detail</p>
              </div>
            </div>

            <!-- Edit & Manage -->
            <div class="flex items-start gap-2 sm:gap-3 bg-white/10 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
              <div class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-xs sm:text-sm mb-0.5 sm:mb-1">✏️ Edit & Kelola</h3>
                <p class="text-xs opacity-80 leading-tight">Ubah URL tujuan, alias, dan pengaturan</p>
              </div>
            </div>

            <!-- Password Protection -->
            <div class="flex items-start gap-2 sm:gap-3 bg-white/10 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
              <div class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-xs sm:text-sm mb-0.5 sm:mb-1">🔒 Password Protection</h3>
                <p class="text-xs opacity-80 leading-tight">Lindungi link dengan password</p>
              </div>
            </div>

            <!-- Expiration & Limits -->
            <div class="flex items-start gap-2 sm:gap-3 bg-white/10 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
              <div class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-xs sm:text-sm mb-0.5 sm:mb-1">⏰ Expiration & Limits</h3>
                <p class="text-xs opacity-80 leading-tight">Atur tanggal kadaluarsa dan max klik</p>
              </div>
            </div>

            <!-- Link Rotation -->
            <div class="flex items-start gap-2 sm:gap-3 bg-white/10 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
              <div class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-xs sm:text-sm mb-0.5 sm:mb-1">🔄 Link Rotation</h3>
                <p class="text-xs opacity-80 leading-tight">Multiple URL dengan A/B testing</p>
              </div>
            </div>

            <!-- Folders & Tags -->
            <div class="flex items-start gap-2 sm:gap-3 bg-white/10 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
              <div class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-xs sm:text-sm mb-0.5 sm:mb-1">📁 Folders & Tags</h3>
                <p class="text-xs opacity-80 leading-tight">Organisir link dengan folder dan tag</p>
              </div>
            </div>
          </div>

          <div class="bg-white/10 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
            <p class="text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2">✨ Plus Bonus:</p>
            <ul class="text-xs space-y-0.5 sm:space-y-1 opacity-90 leading-tight">
              <li>• <span class="font-semibold">Unlimited</span> link shortening</li>
              <li>• <span class="font-semibold">Custom QR</span> code dengan branding</li>
              <li>• <span class="font-semibold">Export data</span> analytics ke CSV/PDF</li>
              <li>• <span class="font-semibold">Team collaboration</span> workspace</li>
            </ul>
          </div>
        </div>
        
        <div class="flex flex-col gap-2 sm:gap-3 w-full md:min-w-[200px]">
          <a
            href="/claim/{link.claim_token}"
            use:inertia
            class="px-4 sm:px-6 py-3 sm:py-4 bg-white text-[#FF6B35] font-bold rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg text-center transform hover:scale-105"
          >
            <div class="text-xl sm:text-2xl mb-1">🔐</div>
            <div class="text-sm sm:text-base">Klaim Sekarang</div>
          </a>
          <div class="text-center">
            <p class="text-xs opacity-75 mb-1">
              100% Gratis • Tanpa Kartu Kredit
            </p>
            <p class="text-xs font-semibold bg-white/20 rounded px-2 py-1 inline-block">
              ⏰ Klaim dalam 7 hari
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Another Link -->
    <div class="text-center">
      <a
        href="/"
        class="inline-flex items-center gap-2 text-[#FF6B35] hover:text-[#004E89] dark:text-[#00D9FF] dark:hover:text-[#FF6B35] font-semibold transition-colors duration-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Buat Link Baru
      </a>
    </div>
  </div>
</div>
