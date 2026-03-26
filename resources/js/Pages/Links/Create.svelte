<script>
  import { inertia, router } from '@inertiajs/svelte';
  import { onMount } from 'svelte';
  import AppHeader from '../../Components/AppHeader.svelte';
  import TagSelector from '../../Components/TagSelector.svelte';
  import Icon from '../../Components/Icon.svelte';
  import axios from 'axios';

  let { user, errors = {} } = $props();

  // Form state
  let urls = $state([{ url: '', weight: 100 }]);
  let alias = $state('');
  let title = $state('');
  let description = $state('');
  let rotationMethod = $state('random');
  let password = $state('');
  let expiresAt = $state('');
  let maxClicks = $state('');
  let folderId = $state(null);
  let selectedTags = $state([]);
  let isAdvancedOpen = $state(false);
  let aliasAvailable = $state(null);
  let checkingAlias = $state(false);

  // Folders
  let folders = $state([]);
  let loadingFolders = $state(true);

  onMount(async () => {
    try {
      const response = await axios.get('/api/folders');
      folders = response.data.data || [];
    } catch (error) {
      console.error('Error loading folders:', error);
    } finally {
      loadingFolders = false;
    }
  });

  // Add URL field
  function addUrl() {
    urls.push({ url: '', weight: 100 });
  }

  // Remove URL field
  function removeUrl(index) {
    if (urls.length > 1) {
      urls = urls.filter((_, i) => i !== index);
    }
  }

  // Check alias availability
  let aliasCheckTimeout;
  function checkAlias() {
    if (!alias || alias.length < 3) {
      aliasAvailable = null;
      return;
    }

    clearTimeout(aliasCheckTimeout);
    checkingAlias = true;

    aliasCheckTimeout = setTimeout(async () => {
      try {
        const response = await fetch(`/api/alias/check/${alias}`);
        const data = await response.json();
        aliasAvailable = data.available;
      } catch (error) {
        console.error('Error checking alias:', error);
      } finally {
        checkingAlias = false;
      }
    }, 500);
  }

  // Generate random alias
  function generateAlias() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    alias = result;
    checkAlias();
  }

  // Submit form
  async function handleSubmit() {
    try {
      const formData = {
        urls: rotationMethod === 'weighted'
          ? urls.map(u => ({ url: u.url, weight: parseInt(u.weight) || 100 }))
          : urls.map(u => u.url),
        alias: alias || undefined,
        title: title || undefined,
        description: description || undefined,
        rotation_method: rotationMethod,
        password: password || undefined,
        expires_at: expiresAt ? new Date(expiresAt).getTime() : undefined,
        max_clicks: maxClicks ? parseInt(maxClicks) : undefined,
        folder_id: folderId || undefined
      };

      // Create link
      const response = await axios.post('/links', formData);
      const linkId = response.data?.data?.id;

      // Attach tags if any
      if (linkId && selectedTags.length > 0) {
        await axios.post(`/api/links/${linkId}/tags`, {
          tag_ids: selectedTags.map(t => t.id)
        });
      }

      // Redirect to links page
      router.visit('/links?success=Link created successfully!');
    } catch (error) {
      console.error('Error creating link:', error);
      alert(error.response?.data?.error || 'Failed to create link');
    }
  }

  // Watch alias changes
  $effect(() => {
    if (alias) {
      checkAlias();
    }
  });
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <!-- Header -->
  <AppHeader {user} currentPage="links" />

  <!-- Main Content -->
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-6">

      <!-- URLs Section -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">
            Destination URLs
          </h2>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {urls.length} URL{urls.length > 1 ? 's' : ''}
          </span>
        </div>

        <div class="space-y-3">
          {#each urls as urlItem, index}
            <div class="flex gap-3">
              <div class="flex-1">
                <input
                  type="url"
                  bind:value={urlItem.url}
                  placeholder="https://example.com/your-long-url"
                  required
                  class="w-full px-4 py-3 bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-orange-500/50 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              {#if rotationMethod === 'weighted'}
                <div class="w-24">
                  <input
                    type="number"
                    bind:value={urlItem.weight}
                    min="1"
                    max="100"
                    placeholder="Weight"
                    class="w-full px-3 py-3 bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-orange-500/50 focus:border-transparent text-gray-900 dark:text-white text-center"
                  />
                </div>
              {/if}

              {#if urls.length > 1}
                <button
                  type="button"
                  onclick={() => removeUrl(index)}
                  class="px-3 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors duration-200"
                  title="Remove URL"
                >
                  <Icon name="trash-2" size={20} />
                </button>
              {/if}
            </div>
          {/each}
        </div>

        <button
          type="button"
          onclick={addUrl}
          class="mt-3 w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:border-brand-orange-500 hover:text-brand-orange-500 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
        >
          <Icon name="plus" size={20} />
          Add URL
        </button>

        {#if errors.urls}
          <p class="mt-2 text-sm text-red-600 dark:text-red-400">{errors.urls}</p>
        {/if}
      </div>

      <!-- Alias Section -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Custom Alias (Optional)
        </h2>

        <div class="flex gap-3">
          <div class="flex-1 relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span class="text-gray-500 dark:text-gray-400 font-mono text-sm">
                klikaja.com/
              </span>
            </div>
            <input
              type="text"
              bind:value={alias}
              placeholder="my-custom-alias"
              pattern="[a-zA-Z0-9-_]+"
              class="w-full pl-32 pr-4 py-3 bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-orange-500/50 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-mono"
            />

            {#if checkingAlias}
              <div class="absolute inset-y-0 right-0 pr-4 flex items-center">
                <Icon name="loader" size={20} class="animate-spin text-gray-400" />
              </div>
            {:else if aliasAvailable === true}
              <div class="absolute inset-y-0 right-0 pr-4 flex items-center">
                <Icon name="check-circle" size={20} class="text-green-500" />
              </div>
            {:else if aliasAvailable === false}
              <div class="absolute inset-y-0 right-0 pr-4 flex items-center">
                <Icon name="x-circle" size={20} class="text-red-500" />
              </div>
            {/if}
          </div>

          <button
            type="button"
            onclick={generateAlias}
            class="px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 font-medium whitespace-nowrap flex items-center gap-2"
          >
            <Icon name="sparkles" size={20} />
            Generate
          </button>
        </div>

        {#if aliasAvailable === false}
          <p class="mt-2 text-sm text-red-600 dark:text-red-400">
            This alias is already taken. Please choose another one.
          </p>
        {:else if aliasAvailable === true}
          <p class="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
            <Icon name="check" size={16} />
            Alias is available!
          </p>
        {/if}

        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Leave blank to auto-generate. Only letters, numbers, dashes (-), and underscores (_) allowed.
        </p>

        {#if errors.alias}
          <p class="mt-2 text-sm text-red-600 dark:text-red-400">{errors.alias}</p>
        {/if}
      </div>

      <!-- Metadata Section -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Metadata (Optional)
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              bind:value={title}
              placeholder="My Campaign Link"
              maxlength="255"
              class="w-full px-4 py-3 bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-orange-500/50 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              bind:value={description}
              placeholder="Describe this link..."
              rows="3"
              class="w-full px-4 py-3 bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-orange-500/50 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Organization Section -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Organization (Optional)
        </h2>

        <div class="space-y-4">
          <!-- Folder Selector -->
          <div>
            <label for="folder" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Folder
            </label>
            {#if loadingFolders}
              <div class="text-sm text-gray-500 dark:text-gray-400">Loading folders...</div>
            {:else}
              <select
                id="folder"
                bind:value={folderId}
                class="w-full px-4 py-3 bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-orange-500/50 focus:border-transparent text-gray-900 dark:text-white"
              >
                <option value={null}>No Folder</option>
                {#each folders as folder}
                  <option value={folder.id}>
                    {folder.icon || '📁'} {folder.name}
                  </option>
                {/each}
              </select>
            {/if}
          </div>

          <!-- Tags Selector -->
          <TagSelector bind:selectedTags={selectedTags} />
        </div>
      </div>

      <!-- Advanced Options -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
        <button
          type="button"
          onclick={() => isAdvancedOpen = !isAdvancedOpen}
          class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
        >
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">
            Advanced Options
          </h2>
          <Icon
            name="chevron-down"
            size={20}
            class={isAdvancedOpen ? 'rotate-180 text-gray-500 dark:text-gray-400' : 'text-gray-500 dark:text-gray-400'}
          />
        </button>

        {#if isAdvancedOpen}
          <div class="px-6 pb-6 space-y-4 border-t border-gray-100 dark:border-white/5 pt-4">
            <!-- Rotation Method -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rotation Method
              </label>
              <div class="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onclick={() => rotationMethod = 'random'}
                  class="px-4 py-3 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 {rotationMethod === 'random' ? 'border-brand-orange-500 bg-brand-orange-500/10 text-brand-orange-500 font-semibold' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'}"
                >
                  <Icon name="sparkles" size={20} />
                  Random
                </button>
                <button
                  type="button"
                  onclick={() => rotationMethod = 'sequential'}
                  class="px-4 py-3 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 {rotationMethod === 'sequential' ? 'border-brand-orange-500 bg-brand-orange-500/10 text-brand-orange-500 font-semibold' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'}"
                >
                  <Icon name="arrow-right" size={20} />
                  Sequential
                </button>
                <button
                  type="button"
                  onclick={() => rotationMethod = 'weighted'}
                  class="px-4 py-3 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 {rotationMethod === 'weighted' ? 'border-brand-orange-500 bg-brand-orange-500/10 text-brand-orange-500 font-semibold' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'}"
                >
                  <Icon name="target" size={20} />
                  Weighted
                </button>
              </div>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {#if rotationMethod === 'random'}
                  Redirect to URLs randomly on each click
                {:else if rotationMethod === 'sequential'}
                  Redirect to URLs in order (round-robin)
                {:else}
                  Redirect based on assigned weights
                {/if}
              </p>
            </div>

            <!-- Password Protection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password Protection
              </label>
              <input
                type="password"
                bind:value={password}
                placeholder="Leave empty for no password"
                class="w-full px-4 py-3 bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-orange-500/50 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Users must enter a password before being redirected
              </p>
            </div>

            <!-- Expiration Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Expiration Date
              </label>
              <input
                type="datetime-local"
                bind:value={expiresAt}
                class="w-full px-4 py-3 bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-orange-500/50 focus:border-transparent text-gray-900 dark:text-white"
              />
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Link will automatically expire after this date
              </p>
            </div>

            <!-- Max Clicks -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maximum Clicks
              </label>
              <input
                type="number"
                bind:value={maxClicks}
                min="1"
                placeholder="Unlimited"
                class="w-full px-4 py-3 bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-orange-500/50 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Link will automatically expire after reaching this click count
              </p>
            </div>
          </div>
        {/if}
      </div>

      <!-- Submit Button -->
      <div class="flex gap-4">
        <a
          href="/links"
          use:inertia
          class="flex-1 px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 font-semibold text-center flex items-center justify-center gap-2"
        >
          <Icon name="x" size={20} />
          Cancel
        </a>
        <button
          type="submit"
          class="flex-1 px-6 py-4 bg-brand-orange-500 hover:bg-brand-orange-600 text-white rounded-xl shadow-md shadow-brand-orange-500/20 active:scale-[0.98] transition-all duration-200 font-semibold flex items-center justify-center gap-2"
        >
          <Icon name="plus" size={20} />
          Create Link
        </button>
      </div>
    </form>
  </main>
</div>

