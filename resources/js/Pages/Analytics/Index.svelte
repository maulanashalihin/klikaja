<script>
  import { inertia, router } from '@inertiajs/svelte';
  import AppHeader from '../../Components/AppHeader.svelte';

  let { 
    user, 
    stats, 
    clicksOverTime, 
    deviceBreakdown, 
    browserBreakdown,
    osBreakdown,
    topReferrers, 
    topLinks,
    countryBreakdown,
    dateRange 
  } = $props();

  let selectedDays = $state(dateRange.days);

  function changeDateRange(days) {
    router.get(`/analytics?days=${days}`);
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

  function getDeviceIcon(device) {
    switch(device.toLowerCase()) {
      case 'mobile': return '📱';
      case 'desktop': return '💻';
      case 'tablet': return '📱';
      case 'bot': return '🤖';
      default: return '❓';
    }
  }

  function getDeviceColor(device) {
    switch(device.toLowerCase()) {
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
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          📊 Analytics Dashboard
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Overview performa semua link Anda
        </p>
      </div>

      <!-- Date Range Filter -->
      <div class="flex gap-2">
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
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      <!-- Total Links -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Links</span>
          <span class="text-2xl">🔗</span>
        </div>
        <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {formatNumber(stats.totalLinks)}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Active links
        </p>
      </div>

      <!-- Avg Clicks Per Link -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Clicks/Link</span>
          <span class="text-2xl">📈</span>
        </div>
        <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {formatNumber(stats.avgClicksPerLink)}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Average performance
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
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Top Performing Links -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
          🏆 Top Performing Links
        </h3>
        
        {#if topLinks.length > 0}
          <div class="space-y-3">
            {#each topLinks as link, index}
              <a
                href="/analytics/{link.alias}"
                use:inertia
                class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span class="text-2xl font-bold text-[#FF6B35]">
                  #{index + 1}
                </span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {link.alias}
                  </p>
                  {#if link.title}
                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {link.title}
                    </p>
                  {/if}
                </div>
                <span class="text-sm font-bold text-gray-900 dark:text-white">
                  {link.clicks}
                </span>
              </a>
            {/each}
          </div>
        {:else}
          <div class="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Belum ada data</p>
          </div>
        {/if}
      </div>

      <!-- Top Referrers -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
          🔗 Top Referrers
        </h3>
        
        {#if topReferrers.length > 0}
          <div class="space-y-2">
            {#each topReferrers as referrer}
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
    </div>

    <!-- Browser & OS Stats -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
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
  </main>
</div>
