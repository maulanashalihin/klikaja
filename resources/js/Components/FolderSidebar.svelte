<script>
import { onMount } from 'svelte';
import axios from 'axios';

let {
    selectedFolder = $bindable(null),
    onFolderChange = () => {}
} = $props();

let folders = $state([]);
let loading = $state(true);
let showCreateModal = $state(false);
let newFolderName = $state('');
let newFolderColor = $state('#FF6B35');
let newFolderIcon = $state('folder');
let creating = $state(false);

const icons = [
    { name: 'folder', emoji: '📁' },
    { name: 'briefcase', emoji: '💼' },
    { name: 'star', emoji: '⭐' },
    { name: 'heart', emoji: '❤️' },
    { name: 'bookmark', emoji: '🔖' },
    { name: 'fire', emoji: '🔥' },
    { name: 'rocket', emoji: '🚀' },
    { name: 'target', emoji: '🎯' }
];

const colors = [
    '#FF6B35', // Orange
    '#004E89', // Blue
    '#00D9FF', // Cyan
    '#FFB800', // Amber
    '#FF4757', // Red
    '#10B981', // Green
    '#8B5CF6', // Purple
    '#EC4899'  // Pink
];

onMount(async () => {
    await fetchFolders();
});

async function fetchFolders() {
    try {
        loading = true;
        const response = await axios.get('/api/folders');
        folders = response.data.data || [];
    } catch (error) {
        console.error('Error fetching folders:', error);
    } finally {
        loading = false;
    }
}

async function createFolder() {
    if (!newFolderName.trim()) return;
    
    try {
        creating = true;
        const response = await axios.post('/api/folders', {
            name: newFolderName.trim(),
            color: newFolderColor,
            icon: newFolderIcon
        });
        
        folders = [...folders, response.data.data];
        showCreateModal = false;
        newFolderName = '';
        newFolderColor = '#FF6B35';
        newFolderIcon = 'folder';
    } catch (error) {
        console.error('Error creating folder:', error);
        alert(error.response?.data?.error || 'Failed to create folder');
    } finally {
        creating = false;
    }
}

function selectFolder(folder) {
    selectedFolder = folder;
    onFolderChange(folder);
}

function selectAllLinks() {
    selectedFolder = null;
    onFolderChange(null);
}
</script>

<div class="folder-sidebar">
    <!-- Header -->
    <div class="sidebar-header">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Folders</h3>
        <button
            onclick={() => showCreateModal = true}
            class="create-btn"
            title="Create folder"
        >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
        </button>
    </div>

    <!-- All Links -->
    <button
        onclick={selectAllLinks}
        class="folder-item {selectedFolder === null ? 'active' : ''}"
    >
        <span class="folder-icon">📋</span>
        <span class="folder-name">All Links</span>
    </button>

    <!-- Folders List -->
    {#if loading}
        <div class="loading">Loading folders...</div>
    {:else if folders.length === 0}
        <div class="empty-state">
            <p class="text-sm text-gray-500 dark:text-gray-400">No folders yet</p>
            <button
                onclick={() => showCreateModal = true}
                class="text-sm text-orange-500 hover:text-orange-600"
            >
                Create your first folder
            </button>
        </div>
    {:else}
        {#each folders as folder}
            <button
                onclick={() => selectFolder(folder)}
                class="folder-item {selectedFolder?.id === folder.id ? 'active' : ''}"
            >
                <span class="folder-icon" style="color: {folder.color}">
                    {icons.find(i => i.name === folder.icon)?.emoji || '📁'}
                </span>
                <span class="folder-name">{folder.name}</span>
                <span class="folder-count">{folder.links_count || 0}</span>
            </button>
        {/each}
    {/if}
</div>

<!-- Create Folder Modal -->
{#if showCreateModal}
    <div class="modal-overlay" onclick={() => showCreateModal = false}>
        <div class="modal-content" onclick={(e) => e.stopPropagation()}>
            <div class="modal-header">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">Create Folder</h3>
                <button onclick={() => showCreateModal = false} class="close-btn">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div class="modal-body">
                <!-- Folder Name -->
                <div class="form-group">
                    <label class="form-label">Folder Name</label>
                    <input
                        type="text"
                        bind:value={newFolderName}
                        placeholder="e.g., Work Links, Personal, Marketing"
                        class="form-input"
                        maxlength="100"
                    />
                </div>

                <!-- Icon Selector -->
                <div class="form-group">
                    <label class="form-label">Icon</label>
                    <div class="icon-grid">
                        {#each icons as icon}
                            <button
                                type="button"
                                onclick={() => newFolderIcon = icon.name}
                                class="icon-option {newFolderIcon === icon.name ? 'selected' : ''}"
                            >
                                {icon.emoji}
                            </button>
                        {/each}
                    </div>
                </div>

                <!-- Color Selector -->
                <div class="form-group">
                    <label class="form-label">Color</label>
                    <div class="color-grid">
                        {#each colors as color}
                            <button
                                type="button"
                                onclick={() => newFolderColor = color}
                                class="color-option {newFolderColor === color ? 'selected' : ''}"
                                style="background-color: {color}"
                            >
                                {#if newFolderColor === color}
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
                    onclick={() => showCreateModal = false}
                    class="btn-secondary"
                    disabled={creating}
                >
                    Cancel
                </button>
                <button
                    onclick={createFolder}
                    class="btn-primary"
                    disabled={creating || !newFolderName.trim()}
                >
                    {creating ? 'Creating...' : 'Create Folder'}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
.folder-sidebar {
    @apply bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4;
    min-width: 250px;
}

.sidebar-header {
    @apply flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700;
}

.create-btn {
    @apply p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors;
}

.folder-item {
    @apply w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all;
    @apply text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700;
}

.folder-item.active {
    @apply bg-gradient-to-r from-orange-500 to-orange-600 text-white;
}

.folder-icon {
    @apply text-xl flex-shrink-0;
}

.folder-name {
    @apply flex-1 font-medium truncate;
}

.folder-count {
    @apply text-sm opacity-75 flex-shrink-0;
}

.loading, .empty-state {
    @apply text-center py-8;
}

/* Modal Styles */
.modal-overlay {
    @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4;
}

.modal-content {
    @apply bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full;
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

.form-label {
    @apply block text-sm font-medium text-gray-700 dark:text-gray-300;
}

.form-input {
    @apply w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600;
    @apply bg-white dark:bg-gray-700 text-gray-900 dark:text-white;
    @apply focus:ring-2 focus:ring-orange-500 focus:border-transparent;
}

.icon-grid {
    @apply grid grid-cols-8 gap-2;
}

.icon-option {
    @apply text-2xl p-2 rounded-lg border-2 border-transparent;
    @apply hover:bg-gray-100 dark:hover:bg-gray-700 transition-all;
}

.icon-option.selected {
    @apply border-orange-500 bg-orange-50 dark:bg-orange-900/20;
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
