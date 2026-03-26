<script>
  import { router } from '@inertiajs/svelte';
  import KlikAjaLogo from '../../Components/KlikAjaLogo.svelte';
  import Icon from '../../Components/Icon.svelte';
  import axios from 'axios';

  let url = $state('');
  let customAlias = $state('');
  let isLoading = $state(false);
  let isCheckingAlias = $state(false);
  let aliasAvailable = $state(null);
  let debounceTimer;
  let mobileMenuOpen = $state(false);

  // Advanced settings
  let isAdvancedOpen = $state(false);
  let password = $state('');
  let expiresAt = $state('');
  let maxClicks = $state('');

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
      return;
    }

    isLoading = true;
    router.post('/shorten', {
      url: url,
      alias: customAlias || null,
      password: password || null,
      expires_at: expiresAt ? new Date(expiresAt).getTime() : null,
      max_clicks: maxClicks ? parseInt(maxClicks) : null
    }, {
      onFinish: () => {
        isLoading = false;
      }
    });
  }

  // Features data
  const features = [
    {
      icon: 'zap',
      title: 'Instant & Seamless',
      description: 'Shorten links in seconds without registration. Claim ownership later if needed.',
      iconBg: 'bg-orange-50 dark:bg-orange-500/10',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      icon: 'rotate-cw',
      title: 'Smart Link Rotation',
      description: 'Sequential, Random, or Weighted rotation. Perfect for robust A/B tests.',
      iconBg: 'bg-blue-50 dark:bg-blue-500/10',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: 'bar-chart-3',
      title: 'Deep Analytics',
      description: 'Track clicks, geolocation, devices, and referrers with professional dashboards.',
      iconBg: 'bg-cyan-50 dark:bg-cyan-500/10',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
    },
    {
      icon: 'sparkles',
      title: 'Custom Branded Links',
      description: 'Create memorable short URLs like klikaja.app/promo-summer quickly.',
      iconBg: 'bg-purple-50 dark:bg-purple-500/10',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      icon: 'shield',
      title: 'Secure & Protected',
      description: 'Safeguard links with passwords, set precise expirations, and limit click counts.',
      iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      icon: 'qr-code',
      title: 'Auto QR Code Generator',
      description: 'Every URL automatically receives a high-quality QR code. Ready to print.',
      iconBg: 'bg-amber-50 dark:bg-amber-500/10',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      icon: 'code',
      title: '100% Open Source',
      description: 'Transparent and auditable code. Hosted reliably or absolutely free to self-host.',
      iconBg: 'bg-gray-100 dark:bg-gray-800',
      iconColor: 'text-gray-700 dark:text-gray-300',
    },
    {
      icon: 'moon',
      title: 'Refined Dark Mode',
      description: 'Engineered for late-night productivity with beautiful dark-theme contrast.',
      iconBg: 'bg-indigo-50 dark:bg-indigo-500/10',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      icon: 'activity',
      title: 'Link Health Monitoring',
      description: 'We pro-actively detect broken destinations, SSL expirations, and security risks.',
      iconBg: 'bg-teal-50 dark:bg-teal-500/10',
      iconColor: 'text-teal-600 dark:text-teal-400',
    }
  ];

  // Stats data
  const stats = [
    { value: '10K+', label: 'Links Shortened' },
    { value: '50K+', label: 'Total Clicks' },
    { value: '99.9%', label: 'Uptime' },
    { value: '<200ms', label: 'Redirect Speed' }
  ];
</script>

<div class="min-h-screen bg-gray-50/50 dark:bg-[#0B1120] text-gray-900 dark:text-gray-100 font-sans selection:bg-brand-orange-500/30">

  <!-- Subtle UI Pattern Background -->
  <div class="fixed inset-0 pointer-events-none z-0 mix-blend-multiply dark:mix-blend-overlay opacity-40 dark:opacity-20 translate-z-0">
    <div class="absolute inset-0 bg-grid"></div>
  </div>

  <!-- Soft Glow Orbs -->
  <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div class="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-[120px]"></div>
    <div class="absolute top-[20%] -left-[10%] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[120px]"></div>
  </div>

  <!-- Header -->
  <header class="relative bg-white/70 dark:bg-[#0B1120]/70 backdrop-blur-xl shadow-sm border-b border-gray-200/50 dark:border-white/5 sticky top-0 z-50 transition-colors">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <a href="/" class="flex items-center gap-2 group">
          <KlikAjaLogo size="default" />
        </a>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-2">
          <a href="#features" class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Features</a>
          <a href="#pricing" class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Pricing</a>
          <a href="/about" class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">About</a>
          <div class="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-2"></div>
          <a href="/login" class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">Sign In</a>
          <a href="/register" class="bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 text-sm font-medium px-4 py-2 rounded-lg transition-all shadow-sm">
            Get Started Free
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <button
          onclick={() => mobileMenuOpen = !mobileMenuOpen}
          class="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {#if mobileMenuOpen}
            <Icon name="close" size={20} />
          {:else}
            <Icon name="menu" size={20} />
          {/if}
        </button>
      </div>

      <!-- Mobile Navigation -->
      {#if mobileMenuOpen}
        <div class="md:hidden py-4 border-t border-gray-100 dark:border-white/5 animate-slide-down bg-white dark:bg-[#0B1120]">
          <div class="flex flex-col space-y-1">
            <a href="#features" class="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg">Features</a>
            <a href="#pricing" class="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg">Pricing</a>
            <a href="/about" class="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg">About</a>
            <a href="/login" class="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg">Sign In</a>
            <div class="pt-2 px-4">
              <a href="/register" class="block w-full text-center bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 text-sm font-medium px-4 py-2 rounded-lg transition-all shadow-sm">
                Get Started Free
              </a>
            </div>
          </div>
        </div>
      {/if}
    </nav>
  </header>

  <!-- Hero Section -->
  <section class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 z-10">
    <div class="text-center mb-16 animate-slide-up">
      <!-- Minimal Badge -->
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-600 dark:text-gray-300 mb-8 shadow-sm">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
        </span>
        Trusted by premium teams globally
      </div>

      <!-- Main Headline -->
      <h1 class="text-5xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight text-balance leading-tight">
        Smarter Links,<br />
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-orange-600 to-orange-500 dark:from-white dark:via-orange-400 dark:to-orange-500">
          Better Connections.
        </span>
      </h1>

      <p class="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed text-balance">
        Shorten, track, and optimize your links securely. No friction, beautiful analytics, built for modern teams.
      </p>

      <!-- Stats -->
      <div class="flex flex-wrap justify-center gap-x-12 gap-y-8 mb-16 border-y border-gray-200/50 dark:border-white/5 py-8 max-w-3xl mx-auto">
        {#each stats as stat}
          <div class="text-center">
            <div class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{stat.value}</div>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">{stat.label}</div>
          </div>
        {/each}
      </div>
    </div>

    <!-- URL Component -->
    <div class="max-w-3xl mx-auto animate-slide-up" style="animation-delay: 0.1s;">
      <div class="relative group">
        <!-- Glow backing -->
        <div class="absolute -inset-1 bg-gradient-to-b from-orange-500/20 to-transparent dark:from-orange-400/20 dark:to-transparent rounded-3xl blur-md opacity-0 group-hover:opacity-100 transition duration-700"></div>

        <div class="relative bg-white dark:bg-[#111827] rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none p-6 md:p-8 border border-gray-200 dark:border-white/10">
          <form onsubmit={handleShorten} class="space-y-6">

            <!-- Long URL Input -->
            <div>
              <label for="url" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Destination URL</label>
              <div class="relative flex items-center">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Icon name="link" size={20} />
                </div>
                <input
                  bind:value={url}
                  type="url"
                  id="url"
                  placeholder="https://example.com/very-long-url-here"
                  required
                  class="w-full pl-11 pr-4 py-3 bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:focus:ring-orange-400/50 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <!-- Custom Domain/Alias -->
            <div>
              <label for="alias" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Custom Link <span class="text-gray-400 font-normal ml-1">(Optional)</span>
              </label>
              <div class="flex items-center">
                <div class="px-4 py-3 bg-gray-100 dark:bg-white/5 border border-r-0 border-gray-200 dark:border-white/10 rounded-l-xl text-gray-500 dark:text-gray-400 text-sm font-medium whitespace-nowrap">
                  klikaja.app/
                </div>
                <div class="flex-1 relative">
                  <input
                    bind:value={customAlias}
                    type="text"
                    id="alias"
                    placeholder="my-campaign"
                    class="w-full pr-10 pl-4 py-3 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-r-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:focus:ring-orange-400/50 focus:border-transparent transition-all"
                  />
                  <!-- Availability Icon -->
                  {#if isCheckingAlias}
                    <div class="absolute right-3 top-1/2 -translate-y-1/2">
                      <Icon name="loader" size={20} class="animate-spin text-gray-400" />
                    </div>
                  {:else if customAlias && aliasAvailable === true}
                    <div class="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                      <Icon name="check" size={20} />
                    </div>
                  {:else if customAlias && aliasAvailable === false}
                    <div class="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                      <Icon name="x" size={20} />
                    </div>
                  {/if}
                </div>
              </div>
              <!-- Status Messages -->
              {#if customAlias && aliasAvailable === false}
                <p class="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                  <Icon name="alert-circle" size={16} />
                  This link is already taken
                </p>
              {:else if customAlias && aliasAvailable === true}
                <p class="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center gap-1 font-medium">
                  <Icon name="check-circle" size={16} />
                  Link is available!
                </p>
              {/if}
            </div>

            <!-- Advanced Options Toggle -->
            <div class="border-t border-gray-100 dark:border-white/5 pt-4">
              <button
                type="button"
                onclick={() => isAdvancedOpen = !isAdvancedOpen}
                class="w-full flex items-center justify-between text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200 border border-transparent hover:border-gray-200 dark:hover:border-white/10"
              >
                <span class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Icon name="shield" size={16} class="text-gray-500" />
                  Link Security & Targeting
                </span>
                <Icon
                  name="chevron-down"
                  size={20}
                  class={isAdvancedOpen ? 'rotate-180 text-gray-500' : 'text-gray-500'}
                />
              </button>

              {#if isAdvancedOpen}
                <div class="mt-4 px-4 pb-2 space-y-5 animate-slide-down">
                  <!-- Password -->
                  <div>
                    <label for="password" class="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                       <Icon name="lock" size={16} class="text-gray-500" />
                       Password Protection
                    </label>
                    <input
                      bind:value={password}
                      type="password"
                      id="password"
                      placeholder="Optional. Leave blank to disable."
                      class="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-white/20 transition-all"
                    />
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <!-- Expiration -->
                    <div>
                      <label for="expiresAt" class="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Icon name="clock" size={16} class="text-gray-500" />
                        Valid Until
                      </label>
                      <input
                        bind:value={expiresAt}
                        type="datetime-local"
                        id="expiresAt"
                        class="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-white/20 transition-all"
                      />
                    </div>

                    <!-- Max Clicks -->
                    <div>
                      <label for="maxClicks" class="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Icon name="target" size={16} class="text-gray-500" />
                        Max Clicks
                      </label>
                      <input
                        bind:value={maxClicks}
                        type="number"
                        id="maxClicks"
                        min="1"
                        placeholder="Unlimited"
                        class="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-white/20 transition-all"
                      />
                    </div>
                  </div>
                </div>
              {/if}
            </div>

            <!-- Submit Action -->
            <button
              type="submit"
              disabled={isLoading || (customAlias && aliasAvailable === false)}
              class="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-500/20 active:scale-[0.98]"
            >
              {#if isLoading}
                <Icon name="loader" size={20} class="animate-spin" />
                Processing...
              {:else}
                <Icon name="link" size={20} />
                Shorten Link
              {/if}
            </button>

            <!-- Mini Benefits -->
            <div class="flex items-center justify-center gap-6 pt-2">
              <span class="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                <Icon name="check" size={14} class="text-gray-400" />
                No login required
              </span>
              <span class="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                <Icon name="check" size={14} class="text-gray-400" />
                100% Free
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>

  <!-- Professional Features Section -->
  <section id="features" class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 z-10">
    <div class="text-center mb-16 md:mb-24">
      <h2 class="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
        Powerful Tools for Modern Teams
      </h2>
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed text-balance">
        Stop wrestling with complex tools. KlikAja delivers everything you need to connect, track, and manage all your links in one streamlined platform.
      </p>
    </div>

    <!-- Feature Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each features as feature, i}
        <div class="group bg-white dark:bg-[#111827] rounded-3xl p-8 border border-gray-100 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <div class="flex flex-col gap-5">
            <div class="w-14 h-14 rounded-2xl {feature.iconBg} {feature.iconColor} flex items-center justify-center mb-2 shadow-sm transform group-hover:scale-110 transition-transform duration-300">
              <Icon name={feature.icon} size={24} />
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base">
                {feature.description}
              </p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- CTA Section -->
  <section class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 z-10">
    <div class="relative overflow-hidden rounded-[2.5rem] bg-gray-900 dark:bg-black p-10 md:p-20 shadow-2xl border border-gray-800 dark:border-white/10 text-center">
      <!-- Ambient Lights glow -->
      <div class="absolute inset-0 z-0">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-500/20 blur-[150px] rounded-full pointer-events-none"></div>
      </div>

      <div class="relative z-10 max-w-3xl mx-auto">
        <h2 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
          Ready to scale your reach?
        </h2>
        <p class="text-lg md:text-xl text-gray-400 mb-10 text-balance leading-relaxed">
          Join thousands of creators and professional teams who trust KlikAja to power their most important links.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/register" class="inline-flex items-center justify-center px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95">
            Create Free Account
          </a>
          <a href="/login" class="inline-flex items-center justify-center px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-all border border-gray-700 active:scale-95">
            Talk to Sales
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="relative bg-white dark:bg-[#0B1120] border-t border-gray-200 dark:border-white/5 pb-12 pt-20 z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-8 mb-8 border-b border-gray-200/50 dark:border-white/5 pb-8">
        <div class="flex items-center gap-2">
          <KlikAjaLogo size="small" />
        </div>
        <div class="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-gray-500 dark:text-gray-400">
          <a href="/about" class="hover:text-gray-900 dark:hover:text-white transition-colors">About</a>
          <a href="#features" class="hover:text-gray-900 dark:hover:text-white transition-colors">Features</a>
          <a href="#pricing" class="hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</a>
          <a href="/privacy" class="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</a>
          <a href="/terms" class="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</a>
        </div>
      </div>

      <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} KlikAja. All rights reserved.</p>
        <p>Open Source Technology built with ❤️</p>
      </div>
    </div>
  </footer>
</div>

<style>
  .rotate-180 {
    transform: rotate(180deg);
  }
</style>
