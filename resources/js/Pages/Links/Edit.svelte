<script>
  import { inertia, router } from '@inertiajs/svelte';
  import { onMount } from 'svelte';
  import AppHeader from '../../Components/AppHeader.svelte';
  import TagSelector from '../../Components/TagSelector.svelte';
  import Icon from '../../Components/Icon.svelte';
  import { Toast } from '../../Components/helper.js';
  import axios from 'axios';

  let { user, link, errors = {} } = $props();

  // Form state - Pre-fill with existing data
  let urls = $state(
    Array.isArray(link.urls)
      ? link.urls.map(u => typeof u === 'string' ? { url: u, weight: 100 } : u)
      : [{ url: link.urls, weight: 100 }]
  );
  let alias = $state(link.alias);
  let title = $state(link.title || '');
  let description = $state(link.description || '');
  let rotationMethod = $state(link.rotation_method || 'random');
  let password = $state('');
  let expiresAt = $state(link.expires_at ? new Date(link.expires_at).toISOString().slice(0, 16) : '');
  let maxClicks = $state(link.max_clicks || '');
  let folderId = $state(link.folder_id);
  let selectedTags = $state([]);
  let isAdvancedOpen = $state(false);
  let isActive = $state(link.is_active);

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

  // Submit form
  async function handleSubmit() {
    const formData = {
      urls: rotationMethod === 'weighted'
        ? urls.map(u => ({ url: u.url, weight: parseInt(u.weight) || 100 }))
        : urls.map(u => u.url),
      title: title || undefined,
      description: description || undefined,
      rotation_method: rotationMethod,
      password: password || undefined,
      expires_at: expiresAt ? new Date(expiresAt).getTime() : undefined,
      max_clicks: maxClicks ? parseInt(maxClicks) : undefined,
      is_active: isActive,
      folder_id: folderId
    };

    try {
      // Update link
      await axios.put(`/links/${link.id}`, formData);

      // Get current tags
      const currentTagsResponse = await axios.get(`/api/links/${link.id}/tags`);
      const currentTags = currentTagsResponse.data.data || [];

      // Find tags to attach and detach
      const currentTagIds = currentTags.map(t => t.id);
      const selectedTagIds = selectedTags.map(t => t.id);

      const toAttach = selectedTagIds.filter(id => !currentTagIds.includes(id));
      const toDetach = currentTagIds.filter(id => !selectedTagIds.includes(id));

      // Attach new tags
      if (toAttach.length > 0) {
        await axios.post(`/api/links/${link.id}/tags`, {
          tag_ids: toAttach
        });
      }

      // Detach removed tags
      if (toDetach.length > 0) {
        await axios.delete(`/api/links/${link.id}/tags`, {
          data: { tag_ids: toDetach }
        });
      }

      Toast('Link updated successfully!', 'success');

    } catch (error) {
      Toast(error.response?.data?.message || 'Failed to update link', 'error');
    }
  }
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <!-- Header -->
  <AppHeader {user} currentPage="links" />

  <!-- Main Content -->
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Link Info Card -->
    <div class="bg-gradient-to-r from-brand-orange-500/10 to-blue-600/10 dark:from-brand-orange-500/20 dark:to-blue-600/20 rounded-3xl p-6 mb-6 border border-brand-orange-500/20">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              klikaja.app/{alias}
            </h3>
            <span class="px-3 py-1 rounded-full text-xs font-semibold {isActive ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'}">
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div class="grid grid-cols-3 gap-4 mt-4">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Total Clicks</p>
              <p class="text-2xl font-bold text-brand-orange-500">{link.click_count || 0}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Created</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                {new Date(link.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Last Updated</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                {new Date(link.updated_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

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
            <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div class="flex-1">
                <input
                  type="url"
                  bind:value={urlItem.url}
                  placeholder="https://example.com/your-long-url"
                  required
                  class="w-full px-4 py-3 bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-orange-500/50 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <div class="flex gap-2 sm:gap-3">
                {#if rotationMethod === 'weighted'}
                  <div class="w-24 sm:w-24">
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
                    class="px-4 sm:px-3 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors duration-200 flex-shrink-0"
                    title="Remove URL"
                  >
                    <Icon name="trash-2" size={20} />
                  </button>
                {/if}
              </div>
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

      <!-- Alias Section (Read-only) -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Custom Alias
        </h2>

        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span class="text-gray-500 dark:text-gray-400 font-mono text-sm">
              klikaja.app/
            </span>
          </div>
          <input
            type="text"
            value={alias}
            disabled
            class="w-full pl-32 pr-4 py-3 bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-400 font-mono cursor-not-allowed"
          />
        </div>

        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <Icon name="info" size={16} />
          Alias cannot be changed after the link is created
        </p>
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

          <!-- Tags Selector (will auto-load existing tags) -->
          <TagSelector
            bind:selectedTags={selectedTags}
            linkId={link.id}
          />
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
            <!-- Link Status Toggle -->
            <div>
              <label class="flex items-center justify-between cursor-pointer">
                <div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Link Status</span>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {isActive ? 'Link is active and accessible' : 'Link is inactive, redirects will be rejected'}
                  </p>
                </div>
                <div class="relative">
                  <input
                    type="checkbox"
                    bind:checked={isActive}
                    class="sr-only peer"
                  />
                  <div class="w-14 h-7 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-orange-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-orange-500"></div>
                </div>
              </label>
            </div>

            <!-- Rotation Method -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rotation Method
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                placeholder={link.password ? "Enter new password to change" : "Leave empty for no password"}
                class="w-full px-4 py-3 bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-orange-500/50 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {#if link.password}
                  <span class="flex items-center gap-1">
                    <Icon name="alert-triangle" size={16} class="text-brand-orange-500" />
                    This link already has a password. Fill this field to change it.
                  </span>
                {:else}
                  Users must enter a password before being redirected
                {/if}
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
                {#if link.max_clicks}
                  <br />
                  <span class="text-brand-orange-500 font-semibold flex items-center gap-1 mt-1">
                    <Icon name="info" size={16} />
                    Current: {link.click_count}/{link.max_clicks} clicks
                  </span>
                {/if}
              </p>
            </div>
          </div>
        {/if}
      </div>

      <!-- Submit Button -->
      <div class="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
        <a
          href="/links"
          use:inertia
          class="w-full sm:flex-1 px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 font-semibold text-center flex items-center justify-center gap-2"
        >
          <Icon name="x" size={20} />
          Cancel
        </a>
        <button
          type="submit"
          class="w-full sm:flex-1 px-6 py-4 bg-brand-orange-500 hover:bg-brand-orange-600 text-white rounded-xl shadow-md shadow-brand-orange-500/20 active:scale-[0.98] transition-all duration-200 font-semibold flex items-center justify-center gap-2"
        >
          <Icon name="save" size={20} />
          Save Changes
        </button>
      </div>
    </form>
  </main>
</div>

