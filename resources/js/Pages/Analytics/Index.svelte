<script>
  import { inertia, router } from '@inertiajs/svelte';
  import AppHeader from '../../Components/AppHeader.svelte';
  import Icon from '../../Components/Icon.svelte';

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
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  }

  function getDeviceIcon(device) {
    switch(device.toLowerCase()) {
      case 'mobile': return 'smartphone';
      case 'desktop': return 'monitor';
      case 'tablet': return 'tablet';
      case 'bot': return 'cpu';
      default: return 'help-circle';
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
          Analytics Dashboard
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Overview of all your link performance
        </p>
      </div>

      <!-- Date Range Filter -->
      <div class="flex gap-2">
        <button
          onclick={() => changeDateRange(7)}
          class="px-4 py-2 rounded-xl font-medium transition-colors {selectedDays === 7 ? 'bg-brand-orange-500 text-white' : 'bg-white dark:bg-[#111827] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-gray-700'} flex items-center gap-2"
        >
          <Icon name="calendar" size={16} />
          7 Days
        </button>
        <button
          onclick={() => changeDateRange(30)}
          class="px-4 py-2 rounded-xl font-medium transition-colors {selectedDays === 30 ? 'bg-brand-orange-500 text-white' : 'bg-white dark:bg-[#111827] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-gray-700'} flex items-center gap-2"
        >
          <Icon name="calendar" size={16} />
          30 Days
        </button>
        <button
          onclick={() => changeDateRange(90)}
          class="px-4 py-2 rounded-xl font-medium transition-colors {selectedDays === 90 ? 'bg-brand-orange-500 text-white' : 'bg-white dark:bg-[#111827] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-gray-700'} flex items-center gap-2"
        >
          <Icon name="calendar" size={16} />
          90 Days
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Clicks -->
      <div class="card-hover group relative overflow-hidden bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-4">
            <div class="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Icon name="mouse-pointer-2" size={28} color="#ffffff" />
            </div>
          </div>
          <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {formatNumber(stats.totalClicks)}
          </p>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Last {dateRange.days} days
          </p>
        </div>
      </div>

      <!-- Unique Visitors -->
      <div class="card-hover group relative overflow-hidden bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-4">
            <div class="w-14 h-14 bg-gradient-to-br from-blue-700 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Icon name="users" size={28} color="#ffffff" />
            </div>
          </div>
          <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {formatNumber(stats.uniqueVisitors)}
          </p>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Unique IP addresses
          </p>
        </div>
      </div>

      <!-- Total Links -->
      <div class="card-hover group relative overflow-hidden bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-4">
            <div class="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Icon name="link" size={28} color="#ffffff" />
            </div>
          </div>
          <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {formatNumber(stats.totalLinks)}
          </p>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Active links
          </p>
        </div>
      </div>

      <!-- Avg Clicks Per Link -->
      <div class="card-hover group relative overflow-hidden bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
        <div class="relative">
          <div class="flex items-center justify-between mb-4">
            <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-green-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Icon name="trending-up" size={28} color="#ffffff" />
            </div>
          </div>
          <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {formatNumber(stats.avgClicksPerLink)}
          </p>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Average performance
          </p>
        </div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Clicks Over Time Chart -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-400 rounded-xl flex items-center justify-center shadow-md">
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
            <div class="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="bar-chart-3" size={32} color="#9ca3af" />
            </div>
            <p>No clicks data yet</p>
          </div>
        {/if}
      </div>

      <!-- Device Breakdown -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-md">
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
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background-color: {getDeviceColor(device.device_type)}20">
                      <Icon name={getDeviceIcon(device.device_type)} size={18} color={getDeviceColor(device.device_type)} />
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
                    class="h-2 rounded-full transition-all duration-500"
                    style="width: {percentage}%; background-color: {getDeviceColor(device.device_type)}"
                  ></div>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <div class="text-center py-12 text-gray-500 dark:text-gray-400">
            <div class="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="smartphone" size={32} color="#9ca3af" />
            </div>
            <p>No device data yet</p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Additional Stats Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Top Performing Links -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-400 rounded-xl flex items-center justify-center shadow-md">
            <Icon name="trophy" size={20} color="#ffffff" />
          </div>
          Top Performing Links
        </h3>

        {#if topLinks.length > 0}
          <div class="space-y-3">
            {#each topLinks as link, index}
              <a
                href="/analytics/{link.alias}"
                use:inertia
                class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span class="text-2xl font-bold text-brand-orange-500">
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
            <div class="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="trophy" size={32} color="#9ca3af" />
            </div>
            <p>No data yet</p>
          </div>
        {/if}
      </div>

      <!-- Top Referrers -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-700 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
            <Icon name="link" size={20} color="#ffffff" />
          </div>
          Top Referrers
        </h3>

        {#if topReferrers.length > 0}
          <div class="space-y-2">
            {#each topReferrers as referrer}
              <div class="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50">
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
            <div class="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="link" size={32} color="#9ca3af" />
            </div>
            <p>No referrer data yet</p>
          </div>
        {/if}
      </div>

      <!-- Top Countries -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-green-400 rounded-xl flex items-center justify-center shadow-md">
            <Icon name="globe" size={20} color="#ffffff" />
          </div>
          Top Countries
        </h3>

        {#if countryBreakdown.length > 0}
          <div class="space-y-2">
            {#each countryBreakdown as country}
              <div class="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50">
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
            <div class="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="globe" size={32} color="#9ca3af" />
            </div>
            <p>No country data yet</p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Browser & OS Stats -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <!-- Browser Breakdown -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-md">
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
          <div class="text-center py-8 text-gray-500 dark:text-gray-400">
            <div class="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="globe" size={32} color="#9ca3af" />
            </div>
            <p>No browser data yet</p>
          </div>
        {/if}
      </div>

      <!-- OS Breakdown -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-700 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
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
          <div class="text-center py-8 text-gray-500 dark:text-gray-400">
            <div class="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="monitor" size={32} color="#9ca3af" />
            </div>
            <p>No OS data yet</p>
          </div>
        {/if}
      </div>
    </div>
  </main>
</div>
