<script>
  import { inertia, router } from '@inertiajs/svelte';
  import AppHeader from '../../Components/AppHeader.svelte';
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
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  }

  function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('id-ID', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(`https://klikaja.app/${link.alias}`);
      Toast('Link berhasil disalin!', 'success');
    } catch (error) {
      Toast('Gagal menyalin link', 'error');
    }
  }

  function exportCSV() {
    window.location.href = `/analytics/${link.alias}/export`;
  }

  let showQRModal = $state(false);
  let qrCodeDataURL = $state('');

  async function generateQR() {
    try {
      const QRCode = (await import('qrcode')).default;
      const url = `https://klikaja.app/${link.alias}`;
      qrCodeDataURL = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      showQRModal = true;
    } catch (error) {
      Toast('Gagal generate QR code', 'error');
    }
  }

  function downloadQR() {
    const link = document.createElement('a');
    link.download = `qr-${link.alias}.png`;
    link.href = qrCodeDataURL;
    link.click();
    Toast('QR Code berhasil didownload!', 'success');
  }

  function getDeviceIcon(device) {
    switch(device?.toLowerCase()) {
      case 'mobile': return '📱';
      case 'desktop': return '💻';
      case 'tablet': return '📱';
      case 'bot': return '🤖';
      default: return '❓';
    }
  }

  function getDeviceColor(device) {
    switch(device?.toLowerCase()) {
      case 'mobile': return '#FF6B35';
      case 'desktop': return '#004E89';
      case 'tablet': return '#00D9FF';
      case 'bot': return '#FFB800';
      default: return '#gray';
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
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Kembali ke Dashboard
      </a>
    </div>

    <!-- Link Info Card -->
    <div class="bg-gradient-to-r from-[#FF6B35]/10 to-[#004E89]/10 dark:from-[#FF6B35]/20 dark:to-[#004E89]/20 rounded-xl p-6 mb-8 border border-[#FF6B35]/20">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              klikaja.app/{link.alias}
            </h1>
            <span class="px-3 py-1 rounded-full text-xs font-semibold {link.is_active ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'}">
              {link.is_active ? '✓ Active' : '✗ Inactive'}
            </span>
          </div>
          
          {#if link.title}
            <p class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              {link.title}
            </p>
          {/if}

          <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
            → {Array.isArray(link.urls) ? link.urls[0].url || link.urls[0] : link.urls}
            {#if Array.isArray(link.urls) && link.urls.length > 1}
              <span class="text-[#FF6B35] font-semibold">+{link.urls.length - 1} more</span>
            {/if}
          </p>

          <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>Total: {link.click_count} clicks</span>
            <span>•</span>
            <span>Created: {formatDate(link.created_at)}</span>
          </div>
        </div>

        <div class="flex gap-2">
          <button
            onclick={copyToClipboard}
            class="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            📋 Copy Link
          </button>
          <button
            onclick={generateQR}
            class="px-4 py-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-lg hover:shadow-lg transition-all font-medium"
          >
            🎯 QR Code
          </button>
          <button
            onclick={exportCSV}
            class="px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#ff5722] transition-colors font-medium"
          >
            📥 Export CSV
          </button>
        </div>
      </div>
    </div>

    <!-- Date Range Filter -->
    <div class="flex justify-end gap-2 mb-6">
      <button
        onclick={() => changeDateRange(7)}
        class="px-4 py-2 rounded-lg font-medium transition-colors {selectedDays === 7 ? 'bg-[#FF6B35] text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}"
      >
        7 Days
      </button>
      <button
        onclick={() => changeDateRange(30)}
        class="px-4 py-2 rounded-lg font-medium transition-colors {selectedDays === 30 ? 'bg-[#FF6B35] text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}"
      >
        30 Days
      </button>
      <button
        onclick={() => changeDateRange(90)}
        class="px-4 py-2 rounded-lg font-medium transition-colors {selectedDays === 90 ? 'bg-[#FF6B35] text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}"
      >
        90 Days
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <!-- Total Clicks -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Clicks</span>
          <span class="text-2xl">👆</span>
        </div>
        <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {formatNumber(stats.totalClicks)}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Last {dateRange.days} days
        </p>
      </div>

      <!-- Unique Visitors -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Unique Visitors</span>
          <span class="text-2xl">👥</span>
        </div>
        <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {formatNumber(stats.uniqueVisitors)}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Unique IP addresses
        </p>
      </div>

      <!-- Click Through Rate -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">CTR</span>
          <span class="text-2xl">📈</span>
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
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
          📈 Clicks Over Time
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
                    class="bg-gradient-to-r from-[#FF6B35] to-[#ff5722] h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
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
          <div class="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>Belum ada data clicks</p>
          </div>
        {/if}
      </div>

      <!-- Device Breakdown -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
          📱 Device Breakdown
        </h3>
        
        {#if deviceBreakdown.length > 0}
          <div class="space-y-3">
            {#each deviceBreakdown as device}
              {@const percentage = ((device.count / stats.totalClicks) * 100).toFixed(1)}
              <div>
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <span class="text-xl">{getDeviceIcon(device.device_type)}</span>
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
                    class="h-2 rounded-full transition-all duration-500"
                    style="width: {percentage}%; background-color: {getDeviceColor(device.device_type)}"
                  ></div>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <div class="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>Belum ada data device</p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Additional Stats Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Top Referrers -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
          🔗 Top Referrers
        </h3>
        
        {#if referrers.length > 0}
          <div class="space-y-2">
            {#each referrers as referrer}
              <div class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
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
          <div class="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Belum ada data</p>
          </div>
        {/if}
      </div>

      <!-- Top Countries -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
          🌍 Top Countries
        </h3>
        
        {#if countryBreakdown.length > 0}
          <div class="space-y-2">
            {#each countryBreakdown as country}
              <div class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
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
          <div class="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Belum ada data</p>
          </div>
        {/if}
      </div>

      <!-- Top Cities -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
          🏙️ Top Cities
        </h3>
        
        {#if cityBreakdown.length > 0}
          <div class="space-y-2">
            {#each cityBreakdown as city}
              <div class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
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
          <div class="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Belum ada data</p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Browser & OS Stats -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Browser Breakdown -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
          🌐 Browser Breakdown
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
          <div class="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Belum ada data</p>
          </div>
        {/if}
      </div>

      <!-- OS Breakdown -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
          💻 Operating System
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
          <div class="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Belum ada data</p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Recent Clicks Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
        🕐 Recent Clicks
      </h3>
      
      {#if recentClicks.length > 0}
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
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
                      {getDeviceIcon(click.device_type)}
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
        <div class="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>Belum ada clicks</p>
        </div>
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
      class="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl" 
      role="document"
      onclick={(e) => e.stopPropagation()}
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white">QR Code</h3>
        <button
          onclick={() => showQRModal = false}
          aria-label="Close modal"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg class="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- QR Code Display -->
      <div class="bg-white p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 mb-6">
        <img src={qrCodeDataURL} alt="QR Code" class="w-full h-auto" />
      </div>

      <!-- Link Info -->
      <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Short Link:</p>
        <p class="text-lg font-semibold text-gray-900 dark:text-white break-all">
          klikaja.app/{link.alias}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <button
          onclick={downloadQR}
          class="flex-1 px-6 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-lg hover:shadow-lg transition-all font-semibold"
        >
          📥 Download PNG
        </button>
        <button
          onclick={() => showQRModal = false}
          class="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold"
        >
          Close
        </button>
      </div>

      <!-- Tip -->
      <p class="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
        💡 Scan QR code ini untuk langsung mengakses link
      </p>
    </div>
  </div>
{/if}
