<script>
  import { onMount } from 'svelte';
  import { inertia } from '@inertiajs/svelte';
  import AppHeader from '../../Components/AppHeader.svelte';
  import DarkModeToggle from '../../Components/DarkModeToggle.svelte';
  import Icon from '../../Components/Icon.svelte';
  import { Toast } from '../../Components/helper.js';
  import axios from 'axios';

  let { user } = $props();

  // Settings state
  let settings = $state({
    emailNotifications: true,
    linkExpiredNotifications: true,
    weeklyReport: false,
    defaultLinkExpiry: 'never',
    defaultRotationMethod: 'random',
    showAnalyticsPreview: true,
    compactView: false
  });

  let darkMode = $state(false);
  let isLoading = $state(false);

  // Load settings from localStorage on mount (once)
  onMount(() => {
    const saved = localStorage.getItem('userSettings');
    if (saved) {
      try {
        settings = { ...settings, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    }
    darkMode = localStorage.getItem('darkMode') === 'true';
  });

  function handleDarkModeChange(mode) {
    darkMode = mode;
    Toast(mode ? 'Dark mode enabled' : 'Light mode enabled', 'success');
  }

  async function saveSettings() {
    isLoading = true;
    try {
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings));

      // Optionally save to backend
      // await axios.post('/api/settings', settings);

      Toast('Settings saved successfully', 'success');
    } catch (error) {
      Toast('Failed to save settings', 'error');
    } finally {
      isLoading = false;
    }
  }

  function resetSettings() {
    if (confirm('Reset all settings to default?')) {
      settings = {
        emailNotifications: true,
        linkExpiredNotifications: true,
        weeklyReport: false,
        defaultLinkExpiry: 'never',
        defaultRotationMethod: 'random',
        showAnalyticsPreview: true,
        compactView: false
      };
      localStorage.removeItem('userSettings');
      Toast('Settings reset to default', 'success');
    }
  }
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <AppHeader {user} currentPage="settings" />

  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
        <Icon name="settings" size={32} />
        Settings
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Manage your account preferences and application settings
      </p>
    </div>

    <!-- Settings Sections -->
    <div class="space-y-6">

      <!-- Appearance Settings -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-brand-orange-500 to-brand-orange-400 rounded-xl flex items-center justify-center">
            <Icon name="sun" size={24} color="#ffffff" />
          </div>
          Appearance
        </h2>

        <div class="space-y-4">
          <!-- Dark Mode Toggle -->
          <div class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/5">
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">Dark Mode</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Switch between light and dark theme
              </p>
            </div>
            <DarkModeToggle onchange={handleDarkModeChange} />
          </div>

          <!-- Compact View -->
          <div class="flex items-center justify-between py-3">
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">Compact View</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Show more links in less space
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                bind:checked={settings.compactView}
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-orange-500/20 dark:peer-focus:ring-brand-orange-500/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-orange-500"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Notifications Settings -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-brand-orange-500 to-brand-orange-400 rounded-xl flex items-center justify-center">
            <Icon name="bell" size={24} color="#ffffff" />
          </div>
          Notifications
        </h2>

        <div class="space-y-4">
          <!-- Email Notifications -->
          <div class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/5">
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">Email Notifications</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Receive email updates about your links
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                bind:checked={settings.emailNotifications}
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-orange-500/20 dark:peer-focus:ring-brand-orange-500/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-orange-500"></div>
            </label>
          </div>

          <!-- Link Expired Notifications -->
          <div class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/5">
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">Link Expiration Alerts</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Get notified when links are about to expire
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                bind:checked={settings.linkExpiredNotifications}
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-orange-500/20 dark:peer-focus:ring-brand-orange-500/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-orange-500"></div>
            </label>
          </div>

          <!-- Weekly Report -->
          <div class="flex items-center justify-between py-3">
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">Weekly Analytics Report</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Receive weekly summary of your link performance
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                bind:checked={settings.weeklyReport}
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-orange-500/20 dark:peer-focus:ring-brand-orange-500/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-orange-500"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Link Defaults Settings -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-brand-orange-500 to-brand-orange-400 rounded-xl flex items-center justify-center">
            <Icon name="link" size={24} color="#ffffff" />
          </div>
          Link Defaults
        </h2>

        <div class="space-y-4">
          <!-- Default Expiry -->
          <div class="py-3 border-b border-gray-100 dark:border-white/5">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Default Link Expiry</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Set default expiration time for new links
            </p>
            <select
              bind:value={settings.defaultLinkExpiry}
              class="w-full px-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50/50 dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange-500/50 focus:border-transparent"
            >
              <option value="never">Never expire</option>
              <option value="1day">1 Day</option>
              <option value="7days">7 Days</option>
              <option value="30days">30 Days</option>
              <option value="90days">90 Days</option>
              <option value="1year">1 Year</option>
            </select>
          </div>

          <!-- Default Rotation Method -->
          <div class="py-3">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Default Rotation Method</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Choose how multiple URLs are rotated
            </p>
            <select
              bind:value={settings.defaultRotationMethod}
              class="w-full px-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50/50 dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-orange-500/50 focus:border-transparent"
            >
              <option value="random">Random</option>
              <option value="sequential">Sequential</option>
              <option value="weighted">Weighted</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Analytics Settings -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-brand-orange-500 to-brand-orange-400 rounded-xl flex items-center justify-center">
            <Icon name="bar-chart-3" size={24} color="#ffffff" />
          </div>
          Analytics
        </h2>

        <div class="space-y-4">
          <!-- Show Analytics Preview -->
          <div class="flex items-center justify-between py-3">
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">Show Analytics Preview</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Display quick analytics on link cards
              </p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                bind:checked={settings.showAnalyticsPreview}
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-orange-500/20 dark:peer-focus:ring-brand-orange-500/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-orange-500"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Account Settings -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-brand-orange-500 to-brand-orange-400 rounded-xl flex items-center justify-center">
            <Icon name="user" size={24} color="#ffffff" />
          </div>
          Account
        </h2>

        <div class="space-y-4">
          <div class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/5">
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">Profile Settings</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Update your profile information
              </p>
            </div>
            <a
              href="/profile"
              use:inertia
              class="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium flex items-center gap-2"
            >
              <Icon name="edit" size={16} />
              Edit Profile
            </a>
          </div>

          <div class="flex items-center justify-between py-3">
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">Account Email</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="bg-red-50 dark:bg-red-900/20 rounded-3xl p-6 shadow-sm border border-red-200 dark:border-red-800">
        <h2 class="text-xl font-bold text-red-900 dark:text-red-400 mb-4 flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-red-500 to-red-400 rounded-xl flex items-center justify-center">
            <Icon name="alert-triangle" size={24} color="#ffffff" />
          </div>
          Danger Zone
        </h2>

        <div class="space-y-4">
          <div class="flex items-center justify-between py-3">
            <div>
              <h3 class="font-semibold text-red-900 dark:text-red-400">Reset Settings</h3>
              <p class="text-sm text-red-700 dark:text-red-500">
                Reset all settings to default values
              </p>
            </div>
            <button
              onclick={resetSettings}
              class="px-4 py-2 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors font-medium"
            >
              Reset Settings
            </button>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex justify-end gap-3 pt-4">
        <button
          onclick={saveSettings}
          disabled={isLoading}
          class="px-6 py-3 bg-brand-orange-500 hover:bg-brand-orange-600 text-white rounded-xl shadow-md shadow-brand-orange-500/20 active:scale-[0.98] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {#if isLoading}
            <Icon name="loader" size={20} class="animate-spin" />
            Saving...
          {:else}
            <Icon name="save" size={20} />
            Save Settings
          {/if}
        </button>
      </div>
    </div>
  </main>
</div>
