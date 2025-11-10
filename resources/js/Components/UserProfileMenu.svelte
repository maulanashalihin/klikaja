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

<svelte:window on:click={handleClickOutside} />

<div class="user-menu-container relative">
  {#if showDropdown}
    <!-- With Dropdown Menu -->
    <button
      onclick={toggleDropdown}
      class="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 transition-colors duration-200"
    >
      <div class="text-right">
        <p class="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
        {#if showEmail}
          <p class="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
        {/if}
      </div>
      <div class="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#004E89] rounded-full flex items-center justify-center text-white font-bold">
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
        class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
        transition:fly={{ y: -10, duration: 200 }}
      >
        <!-- User Info -->
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <p class="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
        </div>

        <!-- Menu Items -->
        <div class="py-1">
          <a
            href="/profile"
            use:inertia
            class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </a>
          
          <a
            href="/settings"
            use:inertia
            class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </a>

          <div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>

          <button
            onclick={handleLogout}
            class="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    {/if}
  {:else}
    <!-- Simple Display (No Dropdown) -->
    <div class="flex items-center gap-3">
      <div class="text-right">
        <p class="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
        {#if showEmail}
          <p class="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
        {/if}
      </div>
      <div class="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#004E89] rounded-full flex items-center justify-center text-white font-bold">
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
