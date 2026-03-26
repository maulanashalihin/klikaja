<script>
    import { inertia, router } from "@inertiajs/svelte";
    import AppHeader from "../../Components/AppHeader.svelte";
    import FolderSidebar from "../../Components/FolderSidebar.svelte";
    import Icon from "../../Components/Icon.svelte";
    import { Toast } from "../../Components/helper.js";
    import axios from "axios";

    let { user, links, pagination, filters } = $props();

    let searchQuery = $state(filters.search || "");
    let statusFilter = $state(filters.status || "all");
    let selectedFolder = $state(null);
    let filteredLinks = $state(links);
    let showMobileFolders = $state(false);

    // Track which link's URL popover is open
    let openPopoverId = $state(null);

    function togglePopover(linkId) {
        openPopoverId = openPopoverId === linkId ? null : linkId;
    }

    // Close popover when clicking outside
    $effect(() => {
        function handleClickOutside(event) {
            if (openPopoverId && !event.target.closest(".url-popover")) {
                openPopoverId = null;
            }
        }

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    });

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(`https://klikaja.app/${text}`);
            Toast("Link copied successfully!", "success");
        } catch (error) {
            Toast("Failed to copy link", "error");
        }
    }

    function openLink(alias) {
        window.open(`/${alias}`, "_blank");
    }

    function handleSearch() {
        const params = new URLSearchParams();
        if (searchQuery) params.set("search", searchQuery);
        if (statusFilter !== "all") params.set("status", statusFilter);
        router.get(`/links?${params.toString()}`);
    }

    async function handleDelete(linkId) {
        if (confirm("Are you sure you want to delete this link?")) {
            try {
                await axios.delete(`/links/${linkId}`);
                Toast("Link deleted successfully!", "success");
                router.reload();
            } catch (error) {
                Toast("Failed to delete link", "error");
            }
        }
    }

    async function handleToggle(linkId) {
        try {
            const response = await axios.post(`/links/${linkId}/toggle`);
            Toast(response.data.message, "success");
            router.reload();
        } catch (error) {
            Toast("Failed to update link status", "error");
        }
    }

    function goToPage(page) {
        const params = new URLSearchParams();
        params.set("page", page);
        if (searchQuery) params.set("search", searchQuery);
        if (statusFilter !== "all") params.set("status", statusFilter);
        router.get(`/links?${params.toString()}`);
    }

    function handleFolderChange(folder) {
        selectedFolder = folder;
        if (folder === null) {
            filteredLinks = links;
        } else {
            filteredLinks = links.filter(
                (link) => link.folder_id === folder.id,
            );
        }
    }

    // Update filtered links when links prop changes
    $effect(() => {
        if (selectedFolder === null) {
            filteredLinks = links;
        } else {
            filteredLinks = links.filter(
                (link) => link.folder_id === selectedFolder.id,
            );
        }
    });
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <AppHeader {user} currentPage="links" />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Mobile Folder Toggle Button -->
        <button
            onclick={() => (showMobileFolders = true)}
            class="lg:hidden mb-4 flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
            <Icon name="folder" size={20} />
            <span class="font-medium">
                {selectedFolder ? selectedFolder.name : "All Links"}
            </span>
            <Icon name="chevron-down" size={16} class="ml-auto" />
        </button>

        <!-- Mobile Folder Drawer -->
        {#if showMobileFolders}
            <div
                class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                onclick={() => (showMobileFolders = false)}
            >
                <div
                    class="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-gray-50 dark:bg-gray-900 shadow-xl overflow-y-auto"
                    onclick={(e) => e.stopPropagation()}
                >
                    <div class="p-4">
                        <div class="flex items-center justify-between mb-4">
                            <h2
                                class="text-lg font-bold text-gray-900 dark:text-white"
                            >
                                Folders
                            </h2>
                            <button
                                onclick={() => (showMobileFolders = false)}
                                class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                aria-label="Close folders"
                            >
                                <Icon
                                    name="x"
                                    size={24}
                                    class="text-gray-600 dark:text-gray-400"
                                />
                            </button>
                        </div>
                        <FolderSidebar
                            bind:selectedFolder
                            onFolderChange={(folder) => {
                                handleFolderChange(folder);
                                showMobileFolders = false;
                            }}
                        />
                    </div>
                </div>
            </div>
        {/if}

        <div class="flex gap-6">
            <!-- Desktop Folder Sidebar -->
            <aside class="hidden lg:block w-64 flex-shrink-0">
                <FolderSidebar
                    bind:selectedFolder
                    onFolderChange={handleFolderChange}
                />
            </aside>

            <!-- Main Content -->
            <div class="flex-1 min-w-0">
                <!-- Header Section -->
                <div
                    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
                >
                    <div>
                        <h1
                            class="text-3xl font-bold text-gray-900 dark:text-white mb-2"
                        >
                            My Links
                        </h1>
                        <p class="text-gray-600 dark:text-gray-400">
                            Manage all your short links
                        </p>
                    </div>

                    <a
                        href="/links/create"
                        use:inertia
                        class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#ff5722] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
                    >
                        <Icon name="plus" size={20} />
                        Create New Link
                    </a>
                </div>

                <!-- Filters & Search -->
                <div
                    class="bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5 mb-6"
                >
                    <div class="flex flex-col sm:flex-row gap-4">
                        <!-- Search -->
                        <div class="flex-1">
                            <input
                                type="text"
                                bind:value={searchQuery}
                                onkeydown={(e) =>
                                    e.key === "Enter" && handleSearch()}
                                placeholder="Search alias, title, or description..."
                                class="w-full px-4 py-3 bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange-500/50 dark:focus:ring-brand-orange-400/50 focus:border-transparent transition-all"
                            />
                        </div>

                        <!-- Status Filter -->
                        <select
                            bind:value={statusFilter}
                            onchange={handleSearch}
                            class="px-4 py-3 bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange-500/50 dark:focus:ring-brand-orange-400/50 focus:border-transparent text-gray-900 dark:text-white transition-all"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <!-- Search Button -->
                        <button
                            onclick={handleSearch}
                            class="px-6 py-3 bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-semibold rounded-xl transition-all shadow-md shadow-brand-orange-500/20 active:scale-[0.98]"
                        >
                            Search
                        </button>
                    </div>

                    <!-- Stats Summary -->
                    <div
                        class="mt-4 pt-4 border-t border-gray-100 dark:border-white/5"
                    >
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            Showing <span
                                class="font-semibold text-gray-900 dark:text-white"
                                >{filteredLinks.length}</span
                            >
                            of
                            <span
                                class="font-semibold text-gray-900 dark:text-white"
                                >{pagination.total}</span
                            >
                            links
                            {#if selectedFolder}
                                <span class="text-brand-orange-600 dark:text-brand-orange-400"
                                    >in {selectedFolder.name}</span
                                >
                            {/if}
                        </p>
                    </div>
                </div>

                <!-- Links List -->
                {#if filteredLinks.length === 0}
                    <!-- Empty State -->
                    <div
                        class="bg-white dark:bg-[#111827] rounded-3xl p-12 shadow-sm border border-gray-100 dark:border-white/5 text-center"
                    >
                        <div class="w-20 h-20 bg-gradient-to-br from-brand-orange-100 to-brand-orange-50 dark:from-brand-orange-900/20 dark:to-brand-orange-800/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Icon
                                name="link"
                                size={40}
                                class="text-brand-orange-500"
                            />
                        </div>
                        <h3
                            class="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                        >
                            No links yet
                        </h3>
                        <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                            Create your first short link and start tracking clicks. It only takes a few seconds!
                        </p>
                        <a
                            href="/links/create"
                            use:inertia
                            class="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-semibold rounded-xl shadow-md shadow-brand-orange-500/20 transition-all active:scale-[0.98]"
                        >
                            <Icon name="plus" size={20} />
                            Create Your First Link
                        </a>
                    </div>
                {:else}
                    <!-- Links Grid -->
                    <div class="space-y-4">
                        {#each filteredLinks as link}
                            <div
                                class="group bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <div
                                    class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                                >
                                    <!-- Link Info -->
                                    <div class="flex-1 min-w-0">
                                        <!-- Title First -->
                                        {#if link.title}
                                            <h3
                                                class="text-xl font-bold text-gray-900 dark:text-white mb-2 truncate"
                                            >
                                                {link.title}
                                            </h3>
                                        {/if}

                                        <!-- Alias & Status -->
                                        <div
                                            class="flex items-center gap-3 mb-2 flex-wrap"
                                        >
                                            <a
                                                href="/{link.alias}"
                                                target="_blank"
                                                class="text-sm font-semibold text-brand-orange-600 dark:text-brand-orange-400 hover:text-brand-orange-700 dark:hover:text-brand-orange-300 hover:underline"
                                            >
                                                klikaja.app/{link.alias}
                                            </a>
                                            <span
                                                class="px-2.5 py-0.5 rounded-full text-xs font-semibold {link.is_active
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'}"
                                            >
                                                {link.is_active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </div>

                                        <!-- Destination -->
                                        <div class="relative">
                                            <p
                                                class="text-sm text-gray-500 dark:text-gray-400 inline-flex items-center gap-2 mb-3 truncate"
                                            >
                                                <Icon name="arrow-right" size={14} class="inline flex-shrink-0" />
                                                <span class="truncate">{link.urls[0]?.url || link.urls[0]}</span>
                                                {#if link.urls.length > 1}
                                                    <button
                                                        onclick={() =>
                                                            togglePopover(
                                                                link.id,
                                                            )}
                                                        class="url-popover flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold text-brand-orange-600 dark:text-brand-orange-400 bg-brand-orange-50 dark:bg-brand-orange-900/20 rounded-md hover:bg-brand-orange-100 dark:hover:bg-brand-orange-900/30 transition-colors"
                                                        title="View all URLs"
                                                    >
                                                        <Icon
                                                            name="files"
                                                            size={12}
                                                        />
                                                        +{link.urls.length - 1} more
                                                    </button>
                                                {/if}
                                            </p>

                                            <!-- Popover for Additional URLs -->
                                            {#if openPopoverId === link.id}
                                                <div
                                                    class="url-popover absolute z-50 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-scale-in"
                                                    style="left: 0; top: 100%;"
                                                >
                                                    <div
                                                        class="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between"
                                                    >
                                                        <span
                                                            class="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide"
                                                        >
                                                            All URLs ({link.urls
                                                                .length})
                                                        </span>
                                                        <button
                                                            onclick={() =>
                                                                (openPopoverId =
                                                                    null)}
                                                            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                                        >
                                                            <Icon
                                                                name="x"
                                                                size={14}
                                                            />
                                                        </button>
                                                    </div>
                                                    <div
                                                        class="max-h-64 overflow-y-auto"
                                                    >
                                                        {#each link.urls as urlItem, index}
                                                            <div
                                                                class="group px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700/50 last:border-0"
                                                            >
                                                                <div
                                                                    class="flex items-start justify-between gap-3"
                                                                >
                                                                    <div
                                                                        class="flex-1 min-w-0"
                                                                    >
                                                                        <div
                                                                            class="flex items-center gap-2 mb-1"
                                                                        >
                                                                            <span
                                                                                class="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded"
                                                                            >
                                                                                {index +
                                                                                    1}
                                                                            </span>
                                                                            {#if urlItem.weight}
                                                                                <span
                                                                                    class="inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-brand-cyan-700 dark:text-brand-cyan-400 bg-brand-cyan-50 dark:bg-brand-cyan-900/20 rounded"
                                                                                >
                                                                                    <Icon
                                                                                        name="activity"
                                                                                        size={10}
                                                                                        class="mr-0.5"
                                                                                    />
                                                                                    {urlItem.weight}x
                                                                                </span>
                                                                            {/if}
                                                                        </div>
                                                                        <p
                                                                            class="text-sm text-gray-700 dark:text-gray-300 break-all font-mono"
                                                                        >
                                                                            {urlItem.url ||
                                                                                urlItem}
                                                                        </p>
                                                                    </div>
                                                                    <button
                                                                        onclick={() => {
                                                                            navigator.clipboard.writeText(
                                                                                urlItem.url ||
                                                                                    urlItem,
                                                                            );
                                                                            Toast(
                                                                                "URL copied!",
                                                                                "success",
                                                                            );
                                                                        }}
                                                                        class="flex-shrink-0 p-1.5 text-gray-400 hover:text-[#FF6B35] dark:hover:text-[#FF6B35] opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        title="Copy URL"
                                                                    >
                                                                        <Icon
                                                                            name="copy"
                                                                            size={14}
                                                                        />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        {/each}
                                                    </div>
                                                </div>
                                            {/if}
                                        </div>

                                        <!-- Stats -->
                                        <div
                                            class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400"
                                        >
                                            <span
                                                class="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-full"
                                            >
                                                <Icon name="globe" size={14} />
                                                <span class="font-semibold">{link.click_count}</span> clicks
                                            </span>
                                            <span class="text-gray-300 dark:text-gray-600">•</span>
                                            <span class="flex items-center gap-1">
                                                <Icon name="calendar" size={14} />
                                                {formatDate(link.created_at)}
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Actions -->
                                    <div class="flex items-center gap-2 flex-shrink-0">
                                        <!-- Copy Button -->
                                        <button
                                            onclick={() =>
                                                copyToClipboard(link.alias)}
                                            class="btn-icon"
                                            title="Copy Link"
                                        >
                                            <Icon name="copy" size={20} />
                                        </button>

                                        <!-- Open Link Button -->
                                        <button
                                            onclick={() => openLink(link.alias)}
                                            class="btn-icon"
                                            title="Open Link"
                                        >
                                            <Icon
                                                name="external-link"
                                                size={20}
                                            />
                                        </button>

                                        <!-- Toggle Status -->
                                        <button
                                            onclick={() =>
                                                handleToggle(link.id)}
                                            class="btn-icon"
                                            title={link.is_active
                                                ? "Deactivate"
                                                : "Activate"}
                                        >
                                            <Icon name="refresh" size={20} />
                                        </button>

                                        <!-- Analytics Button -->
                                        <a
                                            href="/analytics/{link.alias}"
                                            use:inertia
                                            class="btn-icon"
                                            title="Analytics"
                                        >
                                            <Icon
                                                name="bar-chart-3"
                                                size={20}
                                            />
                                        </a>

                                        <!-- Edit Button -->
                                        <a
                                            href="/links/{link.id}/edit"
                                            use:inertia
                                            class="btn-icon"
                                            title="Edit"
                                        >
                                            <Icon name="edit" size={20} />
                                        </a>

                                        <!-- Delete Button -->
                                        <button
                                            onclick={() =>
                                                handleDelete(link.id)}
                                            class="btn-icon hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                                            title="Delete"
                                        >
                                            <Icon name="trash-2" size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>

                    <!-- Pagination -->
                    {#if pagination.totalPages > 1}
                        <div
                            class="mt-8 flex items-center justify-center gap-2"
                        >
                            <!-- Previous Button -->
                            <button
                                onclick={() => goToPage(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                class="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-1"
                            >
                                <Icon
                                    name="chevron-left"
                                    size={16}
                                />
                                Previous
                            </button>

                            <!-- Page Numbers -->
                            {#each Array.from( { length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                    const start = Math.max(1, pagination.page - 2);
                                    return start + i;
                                }, ).filter((p) => p <= pagination.totalPages) as page}
                                <button
                                    onclick={() => goToPage(page)}
                                    class="px-4 py-2 rounded-xl {page ===
                                    pagination.page
                                        ? 'bg-brand-orange-500 text-white'
                                        : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} transition-colors duration-200 font-medium"
                                >
                                    {page}
                                </button>
                            {/each}

                            <!-- Next Button -->
                            <button
                                onclick={() => goToPage(pagination.page + 1)}
                                disabled={pagination.page ===
                                    pagination.totalPages}
                                class="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-1"
                            >
                                Next
                                <Icon
                                    name="chevron-right"
                                    size={16}
                                />
                            </button>
                        </div>
                    {/if}
                {/if}
            </div>
            <!-- End Main Content -->
        </div>
        <!-- End Flex Container -->
    </main>
</div>

<style>
    .url-popover {
        animation: scale-in 0.15s ease-out;
    }

    @keyframes scale-in {
        from {
            opacity: 0;
            transform: scale(0.95) translateY(-4px);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }

    .btn-icon {
        @apply p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200;
    }
</style>
