<script>
  import { inertia, router } from '@inertiajs/svelte';
  import AppHeader from '../../Components/AppHeader.svelte';
  import Icon from '../../Components/Icon.svelte';
  import { Toast } from '../../Components/helper.js';

  let {
    user,
    link,
    stats,
    clicksOverTime,
    deviceBreakdown,
    browserBreakdown,
    osBreakdown,
    referrers,
    countryBreakdown,
    cityBreakdown,
    recentClicks,
    dateRange
  } = $props();

  let selectedDays = $state(dateRange.days);

  function changeDateRange(days) {
    router.get(`/analytics/${link.alias}?days=${days}`);
  }

  function formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  }

  function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(`https://klikaja.app/${link.alias}`);
      Toast('Link copied successfully!', 'success');
    } catch (error) {
      Toast('Failed to copy link', 'error');
    }
  }

  function exportCSV() {
    window.location.href = `/analytics/${link.alias}/export`;
  }

  let showQRModal = $state(false);
  let qrCodeDataURL = $state('');
  let isGeneratingQR = $state(false);

  async function generateQR() {
    if (isGeneratingQR) return;

    isGeneratingQR = true;
    const url = `https://klikaja.app/${link.alias}`;

    try {
      const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&format=png&margin=10&data=${encodeURIComponent(url)}`;

      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise((resolve, reject) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 400;
          canvas.height = 400;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          qrCodeDataURL = canvas.toDataURL('image/png');
          resolve();
        };
        img.onerror = reject;
        img.src = apiUrl;
      });

      showQRModal = true;
    } catch (error) {
      console.error('QR generation failed:', error);
      Toast('Failed to generate QR code', 'error');
    } finally {
      isGeneratingQR = false;
    }
  }

  function downloadQR() {
    const downloadLink = document.createElement('a');
    downloadLink.download = `qr-klikaja-${link.alias}.png`;
    downloadLink.href = qrCodeDataURL;
    downloadLink.click();
    Toast('QR Code downloaded successfully!', 'success');
  }

  function getDeviceIcon(device) {
    switch(device?.toLowerCase()) {
      case 'mobile': return 'smartphone';
      case 'desktop': return 'monitor';
      case 'tablet': return 'tablet';
      case 'bot': return 'cpu';
      default: return 'help-circle';
    }
  }

  function getDeviceColor(device) {
    switch(device?.toLowerCase()) {
      case 'mobile': return '#f97316';
      case 'desktop': return '#2563eb';
      case 'tablet': return '#06b6d4';
      case 'bot': return '#f59e0b';
      default: return '#6b7280';
    }
  }

  function getDeviceBgColor(device) {
    switch(device?.toLowerCase()) {
      case 'mobile': return 'bg-orange-500';
      case 'desktop': return 'bg-blue-600';
      case 'tablet': return 'bg-cyan-500';
      case 'bot': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  }

  // Calculate max value for chart scaling
  const maxClicks = Math.max(...clicksOverTime.map(d => d.clicks), 1);
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <AppHeader {user} currentPage="analytics" />

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Back Button & Header -->
    <div class="mb-6">
      <a
        href="/analytics"
        use:inertia
        class="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
      >
        <Icon name="arrow-left" size={20} />
        Back to Dashboard
      </a>
    </div>

    <!-- Link Info Card -->
    <div class="bg-gradient-to-r from-brand-orange-500/10 to-blue-600/10 dark:from-brand-orange-500/20 dark:to-blue-600/20 rounded-3xl p-6 mb-8 border border-brand-orange-500/20">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              klikaja.app/{link.alias}
            </h1>
            <span class="px-3 py-1 rounded-full text-xs font-semibold {link.is_active ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'}">
              {link.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>

          {#if link.title}
            <p class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              {link.title}
            </p>
          {/if}

          <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
            <Icon name="arrow-right" size={14} class="inline mr-1" />
            {Array.isArray(link.urls) ? link.urls[0].url || link.urls[0] : link.urls}
            {#if Array.isArray(link.urls) && link.urls.length > 1}
              <span class="text-brand-orange-500 font-semibold">+{link.urls.length - 1} more</span>
            {/if}
          </p>

          <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span class="flex items-center gap-1">
              <Icon name="mouse-pointer-2" size={14} />
              Total: {link.click_count} clicks
            </span>
            <span>•</span>
            <span class="flex items-center gap-1">
              <Icon name="calendar" size={14} />
              Created: {formatDate(link.created_at)}
            </span>
          </div>
        </div>

        <div class="flex gap-2">
          <button
            onclick={copyToClipboard}
            class="px-4 py-2 bg-white dark:bg-[#111827] text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-white/5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium flex items-center gap-2"
          >
            <Icon name="copy" size={18} />
            Copy Link
          </button>
          <button
            onclick={generateQR}
            disabled={isGeneratingQR}
            class="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {#if isGeneratingQR}
              <Icon name="loader" size={18} class="animate-spin" />
              Generating...
            {:else}
              <Icon name="qr-code" size={18} />
              QR Code
            {/if}
          </button>
          <button
            onclick={exportCSV}
            class="px-4 py-2 bg-brand-orange-500 text-white rounded-xl hover:bg-brand-orange-600 transition-colors font-medium flex items-center gap-2"
          >
            <Icon name="download" size={18} />
            Export CSV
          </button>
        </div>
      </div>
    </div>

    <!-- Date Range Filter -->
    <div class="flex justify-end gap-2 mb-6">
      <button
        onclick={() => changeDateRange(7)}
        class="px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 {selectedDays === 7 ? 'bg-brand-orange-500 text-white' : 'bg-white dark:bg-[#111827] text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-gray-700'}"
      >
        <Icon name="calendar" size={16} />
        7 Days
      </button>
      <button
        onclick={() => changeDateRange(30)}
        class="px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 {selectedDays === 30 ? 'bg-brand-orange-500 text-white' : 'bg-white dark:bg-[#111827] text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-gray-700'}"
      >
        <Icon name="calendar" size={16} />
        30 Days
      </button>
      <button
        onclick={() => changeDateRange(90)}
        class="px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 {selectedDays === 90 ? 'bg-brand-orange-500 text-white' : 'bg-white dark:bg-[#111827] text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-gray-700'}"
      >
        <Icon name="calendar" size={16} />
        90 Days
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <!-- Total Clicks -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Clicks</span>
          <div class="w-10 h-10 bg-gradient-to-br from-brand-orange-500 to-brand-orange-400 rounded-xl flex items-center justify-center">
            <Icon name="mouse-pointer-2" size={20} color="#ffffff" />
          </div>
        </div>
        <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {formatNumber(stats.totalClicks)}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Last {dateRange.days} days
        </p>
      </div>

      <!-- Unique Visitors -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Unique Visitors</span>
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-400 rounded-xl flex items-center justify-center">
            <Icon name="users" size={20} color="#ffffff" />
          </div>
        </div>
        <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {formatNumber(stats.uniqueVisitors)}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Unique IP addresses
        </p>
      </div>

      <!-- Click Through Rate -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">CTR</span>
          <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-400 rounded-xl flex items-center justify-center">
            <Icon name="trending-up" size={20} color="#ffffff" />
          </div>
        </div>
        <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {stats.clickThroughRate}%
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Click-through rate
        </p>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Clicks Over Time Chart -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-brand-orange-500 to-brand-orange-400 rounded-xl flex items-center justify-center">
            <Icon name="activity" size={20} color="#ffffff" />
          </div>
          Clicks Over Time
        </h3>

        {#if clicksOverTime.length > 0}
          <div class="space-y-2">
            {#each clicksOverTime as day}
              <div class="flex items-center gap-3">
                <span class="text-xs text-gray-500 dark:text-gray-400 w-20">
                  {formatDate(day.date)}
                </span>
                <div class="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-8 relative overflow-hidden">
                  <div
                    class="bg-gradient-to-r from-brand-orange-500 to-brand-orange-400 h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                    style="width: {(day.clicks / maxClicks) * 100}%"
                  >
                    {#if day.clicks > 0}
                      <span class="text-xs font-semibold text-white">
                        {day.clicks}
                      </span>
                    {/if}
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <div class="w-20 h-20 bg-gradient-to-br from-brand-orange-100 to-brand-orange-50 dark:from-brand-orange-900/20 dark:to-brand-orange-800/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="bar-chart-3" size={48} class="opacity-50 text-brand-orange-500" />
          </div>
          <p class="text-center text-gray-500 dark:text-gray-400">No clicks data yet</p>
        {/if}
      </div>

      <!-- Device Breakdown -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-400 rounded-xl flex items-center justify-center">
            <Icon name="smartphone" size={20} color="#ffffff" />
          </div>
          Device Breakdown
        </h3>

        {#if deviceBreakdown.length > 0}
          <div class="space-y-3">
            {#each deviceBreakdown as device}
              {@const percentage = ((device.count / stats.totalClicks) * 100).toFixed(1)}
              <div>
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-300 rounded-xl flex items-center justify-center">
                      <Icon name={getDeviceIcon(device.device_type)} size={18} color="#ffffff" />
                    </div>
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {device.device_type}
                    </span>
                  </div>
                  <div class="text-right">
                    <span class="text-sm font-bold text-gray-900 dark:text-white">
                      {device.count}
                    </span>
                    <span class="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      ({percentage}%)
                    </span>
                  </div>
                </div>
                <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div
                    class="h-2 rounded-full transition-all duration-500 {getDeviceBgColor(device.device_type)}"
                    style="width: {percentage}%"
                  ></div>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <div class="w-20 h-20 bg-gradient-to-br from-brand-orange-100 to-brand-orange-50 dark:from-brand-orange-900/20 dark:to-brand-orange-800/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="smartphone" size={48} class="opacity-50 text-brand-orange-500" />
          </div>
          <p class="text-center text-gray-500 dark:text-gray-400">No device data yet</p>
        {/if}
      </div>
    </div>

    <!-- Additional Stats Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Top Referrers -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-400 rounded-xl flex items-center justify-center">
            <Icon name="link" size={20} color="#ffffff" />
          </div>
          Top Referrers
        </h3>

        {#if referrers.length > 0}
          <div class="space-y-2">
            {#each referrers as referrer}
              <div class="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700">
                <span class="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                  {referrer.referrer}
                </span>
                <span class="text-sm font-semibold text-gray-900 dark:text-white ml-2">
                  {referrer.count}
                </span>
              </div>
            {/each}
          </div>
        {:else}
          <div class="w-20 h-20 bg-gradient-to-br from-brand-orange-100 to-brand-orange-50 dark:from-brand-orange-900/20 dark:to-brand-orange-800/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="link" size={48} class="opacity-50 text-brand-orange-500" />
          </div>
          <p class="text-center text-gray-500 dark:text-gray-400">No referrer data yet</p>
        {/if}
      </div>

      <!-- Top Countries -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-green-400 rounded-xl flex items-center justify-center">
            <Icon name="globe" size={20} color="#ffffff" />
          </div>
          Top Countries
        </h3>

        {#if countryBreakdown.length > 0}
          <div class="space-y-2">
            {#each countryBreakdown as country}
              <div class="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700">
                <span class="text-sm text-gray-700 dark:text-gray-300">
                  {country.country || 'Unknown'}
                </span>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">
                  {country.count}
                </span>
              </div>
            {/each}
          </div>
        {:else}
          <div class="w-20 h-20 bg-gradient-to-br from-brand-orange-100 to-brand-orange-50 dark:from-brand-orange-900/20 dark:to-brand-orange-800/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="globe" size={48} class="opacity-50 text-brand-orange-500" />
          </div>
          <p class="text-center text-gray-500 dark:text-gray-400">No country data yet</p>
        {/if}
      </div>

      <!-- Top Cities -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-brand-orange-500 to-brand-orange-400 rounded-xl flex items-center justify-center">
            <Icon name="map-pin" size={20} color="#ffffff" />
          </div>
          Top Cities
        </h3>

        {#if cityBreakdown.length > 0}
          <div class="space-y-2">
            {#each cityBreakdown as city}
              <div class="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700">
                <span class="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                  {city.city || 'Unknown'}, {city.country || '?'}
                </span>
                <span class="text-sm font-semibold text-gray-900 dark:text-white ml-2">
                  {city.count}
                </span>
              </div>
            {/each}
          </div>
        {:else}
          <div class="w-20 h-20 bg-gradient-to-br from-brand-orange-100 to-brand-orange-50 dark:from-brand-orange-900/20 dark:to-brand-orange-800/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="map-pin" size={48} class="opacity-50 text-brand-orange-500" />
          </div>
          <p class="text-center text-gray-500 dark:text-gray-400">No city data yet</p>
        {/if}
      </div>
    </div>

    <!-- Browser & OS Stats -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Browser Breakdown -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-400 rounded-xl flex items-center justify-center">
            <Icon name="globe" size={20} color="#ffffff" />
          </div>
          Browser Breakdown
        </h3>

        {#if browserBreakdown.length > 0}
          <div class="space-y-2">
            {#each browserBreakdown as browser}
              {@const percentage = ((browser.count / stats.totalClicks) * 100).toFixed(1)}
              <div class="flex items-center justify-between p-2">
                <span class="text-sm text-gray-700 dark:text-gray-300">
                  {browser.browser}
                </span>
                <div class="flex items-center gap-2">
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">
                    {browser.count}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    ({percentage}%)
                  </span>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <div class="w-20 h-20 bg-gradient-to-br from-brand-orange-100 to-brand-orange-50 dark:from-brand-orange-900/20 dark:to-brand-orange-800/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="globe" size={48} class="opacity-50 text-brand-orange-500" />
          </div>
          <p class="text-center text-gray-500 dark:text-gray-400">No browser data yet</p>
        {/if}
      </div>

      <!-- OS Breakdown -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-400 rounded-xl flex items-center justify-center">
            <Icon name="monitor" size={20} color="#ffffff" />
          </div>
          Operating System
        </h3>

        {#if osBreakdown.length > 0}
          <div class="space-y-2">
            {#each osBreakdown as os}
              {@const percentage = ((os.count / stats.totalClicks) * 100).toFixed(1)}
              <div class="flex items-center justify-between p-2">
                <span class="text-sm text-gray-700 dark:text-gray-300">
                  {os.os}
                </span>
                <div class="flex items-center gap-2">
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">
                    {os.count}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    ({percentage}%)
                  </span>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <div class="w-20 h-20 bg-gradient-to-br from-brand-orange-100 to-brand-orange-50 dark:from-brand-orange-900/20 dark:to-brand-orange-800/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="monitor" size={48} class="opacity-50 text-brand-orange-500" />
          </div>
          <p class="text-center text-gray-500 dark:text-gray-400">No OS data yet</p>
        {/if}
      </div>
    </div>

    <!-- Recent Clicks Table -->
    <div class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
      <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <div class="w-10 h-10 bg-gradient-to-br from-brand-orange-500 to-brand-orange-400 rounded-xl flex items-center justify-center">
          <Icon name="clock" size={20} color="#ffffff" />
        </div>
        Recent Clicks
      </h3>

      {#if recentClicks.length > 0}
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-700">
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Time</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Device</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Browser</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">OS</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Location</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Referrer</th>
              </tr>
            </thead>
            <tbody>
              {#each recentClicks as click}
                <tr class="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td class="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                    {formatDateTime(click.clicked_at)}
                  </td>
                  <td class="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    <span class="flex items-center gap-2">
                      <Icon name={getDeviceIcon(click.device_type)} size={16} color={getDeviceColor(click.device_type)} />
                      <span class="capitalize">{click.device_type}</span>
                    </span>
                  </td>
                  <td class="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {click.browser}
                  </td>
                  <td class="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {click.os}
                  </td>
                  <td class="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {click.city || '-'}, {click.country || '-'}
                  </td>
                  <td class="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                    {click.referrer || 'Direct'}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <div class="w-20 h-20 bg-gradient-to-br from-brand-orange-100 to-brand-orange-50 dark:from-brand-orange-900/20 dark:to-brand-orange-800/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="clock" size={48} class="opacity-50 text-brand-orange-500" />
        </div>
        <p class="text-center text-gray-500 dark:text-gray-400">No clicks yet</p>
      {/if}
    </div>
  </main>
</div>

<!-- QR Code Modal -->
{#if showQRModal}
  <div
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    role="dialog"
    aria-modal="true"
    onclick={() => showQRModal = false}
    onkeydown={(e) => e.key === 'Escape' && (showQRModal = false)}
  >
    <div
      class="bg-white dark:bg-[#111827] rounded-3xl p-8 max-w-md w-full shadow-2xl"
      role="document"
      onclick={(e) => e.stopPropagation()}
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-brand-orange-500 to-brand-orange-400 rounded-xl flex items-center justify-center">
            <Icon name="qr-code" size={28} color="#ffffff" />
          </div>
          QR Code
        </h3>
        <button
          onclick={() => showQRModal = false}
          aria-label="Close modal"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
        >
          <Icon name="x" size={24} class="text-gray-500" />
        </button>
      </div>

      <!-- QR Code Display -->
      <div class="bg-white p-6 rounded-xl border-2 border-gray-100 dark:border-gray-700 mb-6">
        <img src={qrCodeDataURL} alt="QR Code" class="w-full h-auto" />
      </div>

      <!-- Link Info -->
      <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Short Link:</p>
        <p class="text-lg font-semibold text-gray-900 dark:text-white break-all">
          klikaja.app/{link.alias}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <button
          onclick={downloadQR}
          class="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
        >
          <Icon name="download" size={20} />
          Download PNG
        </button>
        <button
          onclick={() => showQRModal = false}
          class="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold"
        >
          Close
        </button>
      </div>

      <!-- Tip -->
      <p class="mt-4 text-xs text-center text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
        <Icon name="info" size={14} />
        Scan this QR code to instantly access the link
      </p>
    </div>
  </div>
{/if}
