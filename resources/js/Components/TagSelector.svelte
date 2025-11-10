<script>
import { onMount } from 'svelte';
import axios from 'axios';

let {
    selectedTags = $bindable([]),
    linkId = null
} = $props();

let tags = $state([]);
let loading = $state(true);
let showDropdown = $state(false);
let showCreateModal = $state(false);
let newTagName = $state('');
let newTagColor = $state('#00D9FF');
let creating = $state(false);

const colors = [
    '#FF6B35', '#004E89', '#00D9FF', '#FFB800',
    '#FF4757', '#10B981', '#8B5CF6', '#EC4899'
];

onMount(async () => {
    await fetchTags();
    if (linkId) {
        await fetchLinkTags();
    }
});

async function fetchTags() {
    try {
        loading = true;
        const response = await axios.get('/api/tags');
        tags = response.data.data || [];
    } catch (error) {
        console.error('Error fetching tags:', error);
    } finally {
        loading = false;
    }
}

async function fetchLinkTags() {
    try {
        const response = await axios.get(`/api/links/${linkId}/tags`);
        selectedTags = response.data.data || [];
    } catch (error) {
        console.error('Error fetching link tags:', error);
    }
}

async function createTag() {
    if (!newTagName.trim()) return;
    
    try {
        creating = true;
        const response = await axios.post('/api/tags', {
            name: newTagName.trim(),
            color: newTagColor
        });
        
        tags = [...tags, response.data.data];
        showCreateModal = false;
        newTagName = '';
        newTagColor = '#00D9FF';
    } catch (error) {
        console.error('Error creating tag:', error);
        alert(error.response?.data?.error || 'Failed to create tag');
    } finally {
        creating = false;
    }
}

function toggleTag(tag) {
    const index = selectedTags.findIndex(t => t.id === tag.id);
    if (index > -1) {
        selectedTags = selectedTags.filter(t => t.id !== tag.id);
    } else {
        selectedTags = [...selectedTags, tag];
    }
}

function removeTag(tagId) {
    selectedTags = selectedTags.filter(t => t.id !== tagId);
}

function isSelected(tag) {
    return selectedTags.some(t => t.id === tag.id);
}
</script>

<div class="tag-selector">
    <label class="form-label">Tags</label>
    
    <!-- Selected Tags -->
    <div class="selected-tags">
        {#if selectedTags.length === 0}
            <button
                type="button"
                onclick={() => showDropdown = !showDropdown}
                class="add-tag-btn"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add tags
            </button>
        {:else}
            {#each selectedTags as tag}
                <span class="tag-badge" style="background-color: {tag.color}20; border-color: {tag.color}">
                    <span class="tag-name" style="color: {tag.color}">{tag.name}</span>
                    <button
                        type="button"
                        onclick={() => removeTag(tag.id)}
                        class="tag-remove"
                        aria-label="Remove tag"
                    >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </span>
            {/each}
            <button
                type="button"
                onclick={() => showDropdown = !showDropdown}
                class="add-more-btn"
                title="Add more tags"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
            </button>
        {/if}
    </div>

    <!-- Tags Dropdown -->
    {#if showDropdown}
        <div class="tags-dropdown">
            <div class="dropdown-header">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Select Tags</span>
                <button
                    type="button"
                    onclick={() => showCreateModal = true}
                    class="text-xs text-orange-500 hover:text-orange-600"
                >
                    + New Tag
                </button>
            </div>

            {#if loading}
                <div class="dropdown-loading">Loading tags...</div>
            {:else if tags.length === 0}
                <div class="dropdown-empty">
                    <p class="text-sm text-gray-500 dark:text-gray-400">No tags yet</p>
                    <button
                        type="button"
                        onclick={() => showCreateModal = true}
                        class="text-sm text-orange-500 hover:text-orange-600"
                    >
                        Create your first tag
                    </button>
                </div>
            {:else}
                <div class="tags-list">
                    {#each tags as tag}
                        <button
                            type="button"
                            onclick={() => toggleTag(tag)}
                            class="tag-option {isSelected(tag) ? 'selected' : ''}"
                        >
                            <span class="tag-color" style="background-color: {tag.color}"></span>
                            <span class="tag-name">{tag.name}</span>
                            {#if isSelected(tag)}
                                <svg class="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                            {/if}
                        </button>
                    {/each}
                </div>
            {/if}

            <div class="dropdown-footer">
                <button
                    type="button"
                    onclick={() => showDropdown = false}
                    class="btn-done"
                >
                    Done
                </button>
            </div>
        </div>
    {/if}
</div>

<!-- Create Tag Modal -->
{#if showCreateModal}
    <div class="modal-overlay" onclick={() => showCreateModal = false} role="dialog" aria-modal="true">
        <div class="modal-content" onclick={(e) => e.stopPropagation()} role="document">
            <div class="modal-header">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">Create Tag</h3>
                <button onclick={() => showCreateModal = false} class="close-btn" aria-label="Close modal">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div class="modal-body">
                <div class="form-group">
                    <label for="tag-name" class="form-label">Tag Name</label>
                    <input
                        id="tag-name"
                        type="text"
                        bind:value={newTagName}
                        placeholder="e.g., Marketing, Social Media, Important"
                        class="form-input"
                        maxlength="100"
                    />
                </div>

                <div class="form-group">
                    <label for="tag-color" class="form-label">Color</label>
                    <div class="color-grid">
                        {#each colors as color}
                            <button
                                type="button"
                                onclick={() => newTagColor = color}
                                class="color-option {newTagColor === color ? 'selected' : ''}"
                                style="background-color: {color}"
                                aria-label="Select color {color}"
                            >
                                {#if newTagColor === color}
                                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                    </svg>
                                {/if}
                            </button>
                        {/each}
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button
                    type="button"
                    onclick={() => showCreateModal = false}
                    class="btn-secondary"
                    disabled={creating}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onclick={createTag}
                    class="btn-primary"
                    disabled={creating || !newTagName.trim()}
                >
                    {creating ? 'Creating...' : 'Create Tag'}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
.tag-selector {
    @apply space-y-2;
}

.form-label {
    @apply block text-sm font-medium text-gray-700 dark:text-gray-300;
}

.selected-tags {
    @apply flex flex-wrap gap-2 items-center;
}

.add-tag-btn {
    @apply flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed;
    @apply border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400;
    @apply hover:border-orange-500 hover:text-orange-500 transition-all;
}

.tag-badge {
    @apply inline-flex items-center gap-2 px-3 py-2 md:py-1.5 rounded-lg border-2;
    @apply transition-all;
    /* Better touch target on mobile */
    @apply text-sm md:text-base;
}

.tag-name {
    @apply text-sm font-medium;
}

.tag-remove {
    @apply text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors;
}

.add-more-btn {
    @apply p-2 rounded-lg border-2 border-dashed;
    @apply border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400;
    @apply hover:border-orange-500 hover:text-orange-500 transition-all;
}

.tags-dropdown {
    @apply mt-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg;
    @apply max-h-80 overflow-hidden flex flex-col;
    @apply md:max-h-80;
    /* Full height on mobile for better UX */
    @apply fixed md:relative inset-x-0 bottom-0 md:inset-auto;
    @apply rounded-b-none md:rounded-lg;
    @apply max-h-[70vh] md:max-h-80;
    z-index: 50;
}

.dropdown-header {
    @apply flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700;
}

.dropdown-loading, .dropdown-empty {
    @apply text-center py-8 px-4;
}

.tags-list {
    @apply overflow-y-auto max-h-60 p-2;
}

.tag-option {
    @apply w-full flex items-center gap-3 px-4 py-3 md:py-2 rounded-lg text-left;
    @apply hover:bg-gray-100 dark:hover:bg-gray-700 transition-all;
    /* Larger touch target on mobile */
    min-height: 48px;
}

.tag-option.selected {
    @apply bg-orange-50 dark:bg-orange-900/20;
}

.tag-color {
    @apply w-4 h-4 rounded-full flex-shrink-0;
}

.dropdown-footer {
    @apply px-4 py-3 border-t border-gray-200 dark:border-gray-700;
}

.btn-done {
    @apply w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600;
    @apply text-white font-medium rounded-lg;
    @apply hover:from-orange-600 hover:to-orange-700 transition-all;
}

/* Modal Styles */
.modal-overlay {
    @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4;
}

.modal-content {
    @apply bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full;
    /* Full screen on mobile for better UX */
    @apply h-full md:h-auto rounded-none md:rounded-xl;
    @apply max-w-full md:max-w-md;
}

.modal-header {
    @apply flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700;
}

.close-btn {
    @apply text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors;
}

.modal-body {
    @apply p-6 space-y-4;
}

.modal-footer {
    @apply flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700;
}

.form-group {
    @apply space-y-2;
}

.form-input {
    @apply w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600;
    @apply bg-white dark:bg-gray-700 text-gray-900 dark:text-white;
    @apply focus:ring-2 focus:ring-orange-500 focus:border-transparent;
}

.color-grid {
    @apply grid grid-cols-8 gap-2;
}

.color-option {
    @apply w-10 h-10 rounded-lg border-2 border-transparent;
    @apply flex items-center justify-center transition-all;
    @apply hover:scale-110;
}

.color-option.selected {
    @apply border-gray-900 dark:border-white scale-110;
}

.btn-primary {
    @apply px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600;
    @apply text-white font-medium rounded-lg;
    @apply hover:from-orange-600 hover:to-orange-700 transition-all;
    @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
    @apply px-6 py-2.5 bg-gray-100 dark:bg-gray-700;
    @apply text-gray-700 dark:text-gray-300 font-medium rounded-lg;
    @apply hover:bg-gray-200 dark:hover:bg-gray-600 transition-all;
    @apply disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>
