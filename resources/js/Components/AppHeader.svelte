<script>
  import { inertia, page } from '@inertiajs/svelte';
  import KlikAjaLogo from './KlikAjaLogo.svelte';
  import UserProfileMenu from './UserProfileMenu.svelte';

  let { user, currentPage = 'dashboard' } = $props();
  
  let isMobileMenuOpen = $state(false);

  const navItems = [
    { 
      href: '/home', 
      label: 'Dashboard', 
      icon: 'dashboard',
      active: currentPage === 'dashboard' 
    },
    { 
      href: '/links', 
      label: 'My Links', 
      icon: 'links',
      active: currentPage === 'links' 
    },
    { 
      href: '/analytics', 
      label: 'Analytics', 
      icon: 'analytics',
      active: currentPage === 'analytics',
      badge: null
    }
  ];

  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }

  function closeMobileMenu() {
    isMobileMenuOpen = false;
  }
</script>

<header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <!-- Logo & Brand -->
      <div class="flex items-center gap-8">
        <a href="/home" use:inertia class="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <KlikAjaLogo size="default" />
        </a>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-1">
          {#each navItems as item}
            <a
              href={item.href}
              use:inertia
              class="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 {item.active 
                ? 'text-[#FF6B35] bg-[#FF6B35]/10' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'}"
            >
              <div class="flex items-center gap-2">
                {#if item.icon === 'dashboard'}
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                {:else if item.icon === 'links'}
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                {:else if item.icon === 'analytics'}
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                {/if}
                <span>{item.label}</span>
                {#if item.badge}
                  <span class="px-2 py-0.5 text-xs font-semibold bg-[#FF6B35] text-white rounded-full">
                    {item.badge}
                  </span>
                {/if}
              </div>
              
              {#if item.active}
                <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B35]"></div>
              {/if}
            </a>
          {/each}
        </nav>
      </div>

      <!-- Right Side Actions -->
      <div class="flex items-center gap-3">
        <!-- Create Link Button -->
        <a
          href="/links/create"
          use:inertia
          class="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#ff5722] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Buat Link</span>
        </a>

        <!-- User Profile Menu -->
        <div class="hidden sm:block">
          <UserProfileMenu {user} showEmail={false} showDropdown={true} />
        </div>

        <!-- Mobile Menu Button -->
        <button
          onclick={toggleMobileMenu}
          class="sm:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Menu"
        >
          {#if !isMobileMenuOpen}
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          {:else}
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          {/if}
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Menu -->
  {#if isMobileMenuOpen}
    <div class="sm:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <nav class="px-4 py-3 space-y-1">
        {#each navItems as item}
          <a
            href={item.href}
            use:inertia
            onclick={closeMobileMenu}
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors {item.active 
              ? 'text-[#FF6B35] bg-[#FF6B35]/10' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}"
          >
            {#if item.icon === 'dashboard'}
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            {:else if item.icon === 'links'}
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            {:else if item.icon === 'analytics'}
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            {/if}
            <span>{item.label}</span>
            {#if item.badge}
              <span class="ml-auto px-2 py-0.5 text-xs font-semibold bg-[#FF6B35] text-white rounded-full">
                {item.badge}
              </span>
            {/if}
          </a>
        {/each}
      </nav>

      <!-- Mobile User Section -->
      <div class="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#004E89] rounded-full flex items-center justify-center text-white font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div class="flex-1">
            <p class="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>

        <a
          href="/links/create"
          use:inertia
          onclick={closeMobileMenu}
          class="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-[#FF6B35] to-[#ff5722] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Buat Link Baru</span>
        </a>
      </div>
    </div>
  {/if}
</header>
