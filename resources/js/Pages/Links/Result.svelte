<script>
  import { inertia } from '@inertiajs/svelte';
  import KlikAjaLogo from '../../Components/KlikAjaLogo.svelte';
  import Icon from '../../Components/Icon.svelte';

  let { link } = $props(); // { alias, short_url, original_url, qr_code_path, claim_token, created_at }

  let copied = $state(false);

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
  <header class="border-b border-gray-100 dark:border-white/5 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <a href="/">
          <KlikAjaLogo />
        </a>

        <div class="flex items-center gap-2 sm:gap-4">
          <a href="/login" class="text-sm font-medium text-gray-700 hover:text-brand-orange-500 dark:text-gray-300 dark:hover:text-brand-orange-500 transition-colors duration-200 px-3 py-2">
            Sign In
          </a>
          <a href="/register" class="px-4 py-2 text-sm font-semibold text-white bg-brand-orange-500 hover:bg-brand-orange-600 rounded-xl transition-all duration-200 shadow-md shadow-brand-orange-500/20 active:scale-[0.98] min-h-[40px] flex items-center">
            Sign Up Free
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
        <Icon name="check" size={32} class="text-green-600 dark:text-green-400" />
      </div>
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        Link Shortened Successfully!
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Your link is ready to share
      </p>
    </div>

    <!-- Link Card -->
    <div class="bg-white dark:bg-[#111827] rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 dark:border-white/5 mb-6">
      <!-- Short URL -->
      <div class="mb-6">
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Your Short Link
        </label>
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="text"
            value={link.short_url}
            readonly
            class="flex-1 bg-gray-50/50 dark:bg-black/20 border-2 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl px-4 py-3 font-mono text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-brand-orange-500/50"
          />
          <button
            onclick={copyToClipboard}
            class="px-6 py-3 bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-md shadow-brand-orange-500/20 active:scale-[0.98] whitespace-nowrap min-h-[48px] flex items-center justify-center gap-2"
          >
            {#if copied}
              <Icon name="check" size={20} />
              Copied!
            {:else}
              <Icon name="copy" size={20} />
              Copy
            {/if}
          </button>
        </div>
      </div>

      <!-- Original URL -->
      <div class="mb-6">
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Original Link
        </label>
        <div class="bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3">
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
          <div class="flex justify-center bg-white p-4 rounded-xl border border-gray-200 dark:border-white/10">
            <img src={link.qr_code_path} alt="QR Code" class="w-48 h-48" />
          </div>
          <p class="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
            Scan to open the link
          </p>
        </div>
      {/if}

      <!-- Share Buttons -->
      <div class="border-t border-gray-100 dark:border-white/5 pt-6">
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Share to
        </label>
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            onclick={shareToWhatsApp}
            class="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors duration-200 min-h-[48px]"
          >
            <Icon name="message-circle" size={20} />
            WhatsApp
          </button>

          <button
            onclick={shareToTwitter}
            class="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors duration-200 min-h-[48px]"
          >
            <Icon name="send" size={20} />
            Twitter
          </button>
        </div>
      </div>
    </div>

    <!-- Claim Banner -->
    <div class="bg-gradient-to-r from-brand-orange-500 to-blue-600 rounded-3xl p-4 sm:p-6 md:p-8 text-white shadow-xl mb-6">
      <div class="flex flex-col md:flex-row items-center gap-4 md:gap-6">
        <div class="flex-1 w-full text-center md:text-left">
          <div class="flex items-center justify-center md:justify-start gap-2 mb-3">
            <Icon name="gift" size={36} />
            <h2 class="text-xl sm:text-2xl md:text-3xl font-bold">
              Claim This Link Now!
            </h2>
          </div>
          <p class="text-base sm:text-lg opacity-90 mb-4">
            Sign up <span class="font-bold">FREE</span> and get access to all premium features:
          </p>

          <!-- Top 3 Key Features -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div class="bg-white/10 rounded-xl p-4 backdrop-blur-sm text-center">
              <div class="flex justify-center mb-2">
                <Icon name="bar-chart-3" size={32} />
              </div>
              <h3 class="font-bold text-sm mb-1">Deep Analytics</h3>
              <p class="text-xs opacity-80">Real-time tracking & insights</p>
            </div>
            <div class="bg-white/10 rounded-xl p-4 backdrop-blur-sm text-center">
              <div class="flex justify-center mb-2">
                <Icon name="refresh" size={32} />
              </div>
              <h3 class="font-bold text-sm mb-1">Link Rotation</h3>
              <p class="text-xs opacity-80">A/B testing & load balancing</p>
            </div>
            <div class="bg-white/10 rounded-xl p-4 backdrop-blur-sm text-center">
              <div class="flex justify-center mb-2">
                <Icon name="shield" size={32} />
              </div>
              <h3 class="font-bold text-sm mb-1">Full Control</h3>
              <p class="text-xs opacity-80">Password, expiration, limits</p>
            </div>
          </div>

          <!-- Complete Features List -->
          <div class="bg-white/10 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
            <p class="font-semibold text-sm mb-2 text-center">✨ Plus 10+ More Premium Features:</p>
            <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs opacity-90">
              <div class="flex items-center gap-1">
                <Icon name="check" size={12} class="text-green-300" />
                <span>Edit & manage links</span>
              </div>
              <div class="flex items-center gap-1">
                <Icon name="check" size={12} class="text-green-300" />
                <span>Custom QR codes</span>
              </div>
              <div class="flex items-center gap-1">
                <Icon name="check" size={12} class="text-green-300" />
                <span>Folders & tags</span>
              </div>
              <div class="flex items-center gap-1">
                <Icon name="check" size={12} class="text-green-300" />
                <span>Export analytics</span>
              </div>
              <div class="flex items-center gap-1">
                <Icon name="check" size={12} class="text-green-300" />
                <span>Team collaboration</span>
              </div>
              <div class="flex items-center gap-1">
                <Icon name="check" size={12} class="text-green-300" />
                <span>Unlimited links</span>
              </div>
              <div class="flex items-center gap-1">
                <Icon name="check" size={12} class="text-green-300" />
                <span>Link health monitoring</span>
              </div>
              <div class="flex items-center gap-1">
                <Icon name="check" size={12} class="text-green-300" />
                <span>Smart routing</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3 w-full md:w-auto md:min-w-[200px]">
          <a
            href="/claim/{link.claim_token}"
            use:inertia
            class="px-6 py-4 bg-white text-brand-orange-500 font-bold text-lg rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-xl text-center transform hover:scale-105"
          >
            <div class="flex items-center justify-center gap-2 mb-2">
              <Icon name="lock" size={24} />
            </div>
            <div>Claim Now</div>
          </a>
          <div class="text-center space-y-2">
            <p class="text-xs opacity-90">
              100% Free • No Credit Card Required
            </p>
            <p class="text-sm font-bold bg-white/20 rounded-xl px-3 py-2 flex items-center justify-center gap-2">
              <Icon name="clock" size={16} />
              Claim within 7 days
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Another Link -->
    <div class="text-center">
      <a
        href="/"
        class="inline-flex items-center gap-2 text-brand-orange-500 hover:text-brand-orange-600 font-semibold transition-colors duration-200"
      >
        <Icon name="plus" size={20} />
        Create Another Link
      </a>
    </div>
  </div>
</div>
