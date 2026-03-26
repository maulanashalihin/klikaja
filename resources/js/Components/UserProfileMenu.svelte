<script>
  import { inertia, router } from '@inertiajs/svelte';
  import { fly } from 'svelte/transition';

  let { user, showEmail = true, showDropdown = false } = $props();

  let isDropdownOpen = $state(false);

  function handleLogout() {
    router.post('/logout');
  }

  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
  }

  // Close dropdown when clicking outside
  function handleClickOutside(event) {
    if (isDropdownOpen && !event.target.closest('.user-menu-container')) {
      isDropdownOpen = false;
    }
  }
</script>

<svelte:window onclick={handleClickOutside} />

<div class="user-menu-container relative">
  {#if showDropdown}
    <!-- With Dropdown Menu -->
    <button
      onclick={toggleDropdown}
      class="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl p-2 transition-all duration-200 hover:shadow-md"
    >
      <div class="text-right hidden sm:block">
        <p class="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
        {#if showEmail}
          <p class="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
        {/if}
      </div>
      <div class="w-10 h-10 bg-gradient-to-br from-brand-orange-500 via-brand-orange-400 to-brand-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white dark:ring-gray-800">
        {user.name.charAt(0).toUpperCase()}
      </div>
      <svg
        class="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200"
        class:rotate-180={isDropdownOpen}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    {#if isDropdownOpen}
      <div
        class="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 overflow-hidden"
        transition:fly={{ y: -10, duration: 200 }}
      >
        <!-- User Info Header -->
        <div class="px-5 py-4 bg-gradient-to-br from-brand-orange-50 to-brand-cyan-50 dark:from-brand-orange-900/20 dark:to-brand-cyan-900/20 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-br from-brand-orange-500 via-brand-orange-400 to-brand-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
              <p class="text-xs text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        <!-- Menu Items -->
        <div class="py-2">
          <a
            href="/profile"
            use:inertia
            class="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-brand-orange-50 dark:hover:bg-brand-orange-900/20 hover:text-brand-orange-600 dark:hover:text-brand-orange-400 transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </a>

          <a
            href="/settings"
            use:inertia
            class="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-brand-orange-50 dark:hover:bg-brand-orange-900/20 hover:text-brand-orange-600 dark:hover:text-brand-orange-400 transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </a>

          <a
            href="/help"
            use:inertia
            class="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-brand-orange-50 dark:hover:bg-brand-orange-900/20 hover:text-brand-orange-600 dark:hover:text-brand-orange-400 transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Help & Support
          </a>

          <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>

          <button
            onclick={handleLogout}
            class="flex items-center gap-3 w-full px-5 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    {/if}
  {:else}
    <!-- Simple Display (No Dropdown) -->
    <div class="flex items-center gap-3">
      <div class="text-right hidden sm:block">
        <p class="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
        {#if showEmail}
          <p class="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
        {/if}
      </div>
      <div class="w-10 h-10 bg-gradient-to-br from-brand-orange-500 via-brand-orange-400 to-brand-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white dark:ring-gray-800">
        {user.name.charAt(0).toUpperCase()}
      </div>
    </div>
  {/if}
</div>

<style>
  .rotate-180 {
    transform: rotate(180deg);
  }
</style>
