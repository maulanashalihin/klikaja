<script>
    import { inertia, router } from "@inertiajs/svelte";
    import AppHeader from "../../Components/AppHeader.svelte";
    import Icon from "../../Components/Icon.svelte";
    import { Toast } from "../../Components/helper.js";
    import axios from "axios";

    let { stats, recentLinks, user } = $props();

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

    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + "M";
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + "K";
        }
        return num.toString();
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        if (days < 7) return `${days} days ago`;

        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    function openLink(alias) {
        window.open(`/${alias}`, "_blank");
    }

    async function copyToClipboard(alias) {
        try {
            await navigator.clipboard.writeText(`https://klikaja.app/${alias}`);
            Toast("Link copied successfully!", "success");
        } catch (error) {
            Toast("Failed to copy link", "error");
        }
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
            await axios.post(`/links/${linkId}/toggle`);
            Toast("Link status updated!", "success");
            router.reload();
        } catch (error) {
            Toast("Failed to update status", "error");
        }
    }
</script>

<div
    class="min-h-screen bg-gray-50/50 dark:bg-[#0B1120] text-gray-900 dark:text-gray-100 font-sans selection:bg-brand-orange-500/30"
>
    <!-- Subtle UI Pattern Background -->
    <div class="fixed inset-0 pointer-events-none z-0 mix-blend-multiply dark:mix-blend-overlay opacity-40 dark:opacity-20 translate-z-0">
        <div class="absolute inset-0 bg-grid"></div>
    </div>

    <!-- Soft Glow Orbs -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div class="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-brand-orange-500/10 blur-[120px]"></div>
        <div class="absolute top-[20%] -left-[10%] w-[400px] h-[400px] rounded-full bg-brand-cyan-500/10 blur-[120px]"></div>
    </div>

    <!-- Header -->
    <AppHeader {user} currentPage="dashboard" />

    <!-- Main Content -->
    <main class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Welcome Section -->
        <div class="mb-8 animate-slide-up">
            <div
                class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
                <div>
                    <h1
                        class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2"
                    >
                        Welcome back, {user.name.split(" ")[0]}!
                    </h1>
                    <p class="text-gray-600 dark:text-gray-400 text-lg">
                        Here's what's happening with your links today
                    </p>
                </div>
                <a
                    href="/links/create"
                    use:inertia
                    class="btn-primary inline-flex items-center justify-center gap-2"
                >
                    <Icon name="plus" size={20} />
                    Create New Link
                </a>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Total Links -->
            <div class="stat-card-hover group relative overflow-hidden bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <div class="relative">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
                            <Icon name="link" size={28} color="#ffffff" />
                        </div>
                    </div>
                    <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {formatNumber(stats.totalLinks)}
                    </p>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Total Links
                    </p>
                    <div class="mt-3 flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                        <Icon name="trending-up" size={14} />
                        <span>+{stats.newLinksThisMonth} this month</span>
                    </div>
                </div>
            </div>

            <!-- Total Clicks -->
            <div class="stat-card-hover group relative overflow-hidden bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <div class="relative">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-14 h-14 bg-gradient-to-br from-blue-700 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Icon name="globe" size={28} color="#ffffff" />
                        </div>
                    </div>
                    <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {formatNumber(stats.totalClicks)}
                    </p>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Total Clicks
                    </p>
                    <div class="mt-3 flex items-center gap-1.5 text-xs font-medium text-brand-orange-600 dark:text-brand-orange-400">
                        <Icon name="trending-up" size={14} />
                        <span>+{formatNumber(stats.clicksToday)} today</span>
                    </div>
                </div>
            </div>

            <!-- Active Links -->
            <div class="stat-card-hover group relative overflow-hidden bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <div class="relative">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-green-400 rounded-2xl flex items-center justify-center shadow-lg">
                            <Icon name="check-circle" size={28} color="#ffffff" />
                        </div>
                    </div>
                    <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {stats.activeLinks}
                    </p>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Active Links
                    </p>
                    <div class="mt-3 flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">
                        <span class="font-semibold">{Math.round((stats.activeLinks / stats.totalLinks) * 100)}%</span>
                        <span>of total</span>
                    </div>
                </div>
            </div>

            <!-- Avg Click Rate -->
            <div class="stat-card-hover group relative overflow-hidden bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <div class="relative">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg">
                            <Icon name="bar-chart-3" size={28} color="#ffffff" />
                        </div>
                    </div>
                    <p class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {stats.avgClicksPerLink}
                    </p>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Avg Clicks/Link
                    </p>
                    <div class="mt-3 flex items-center gap-1.5 text-xs font-medium text-cyan-600 dark:text-cyan-400">
                        <Icon name="activity" size={14} />
                        <span>per link</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Links Section -->
        <div class="card-hover overflow-hidden mb-8">
            <div class="px-6 py-5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                <div>
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                        Recent Links
                    </h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        Your latest shortened links
                    </p>
                </div>
                <a
                    href="/links"
                    use:inertia
                    class="text-sm font-semibold text-brand-orange-600 dark:text-brand-orange-400 hover:text-brand-orange-700 dark:hover:text-brand-orange-300 transition-colors flex items-center gap-1"
                >
                    View All
                    <Icon name="arrow-right" size={16} />
                </a>
            </div>

            {#if recentLinks.length === 0}
                <div class="px-6 py-16 text-center">
                    <div class="w-20 h-20 bg-gradient-to-br from-brand-orange-100 to-brand-orange-50 dark:from-brand-orange-900/20 dark:to-brand-orange-800/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon name="link" size={40} class="text-brand-orange-500" />
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        No Links Yet
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        Create your first short link and start tracking clicks. It only takes a few seconds!
                    </p>
                    <a href="/links/create" use:inertia class="btn-primary inline-flex items-center gap-2">
                        <Icon name="plus" size={20} />
                        Create Your First Link
                    </a>
                </div>
            {:else}
                <div class="divide-y divide-gray-100 dark:divide-white/5">
                    {#each recentLinks as link}
                        <div class="group p-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200">
                            <div
                                class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                            >
                                <!-- Link Info -->
                                <div class="flex-1 min-w-0">
                                    <!-- Title First -->
                                    {#if link.title}
                                        <h3
                                            class="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate"
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
                                            <span class="truncate"
                                                >{link.urls[0]?.url ||
                                                    link.urls[0]}</span
                                            >
                                            {#if link.urls.length > 1}
                                                <button
                                                    onclick={() =>
                                                        togglePopover(link.id)}
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
                                                                    class="flex-shrink-0 p-1.5 text-gray-400 hover:text-brand-orange-600 dark:hover:text-brand-orange-400 opacity-0 group-hover:opacity-100 transition-opacity"
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
                                            <span class="font-semibold"
                                                >{formatNumber(
                                                    link.click_count,
                                                )}</span
                                            > clicks
                                        </span>
                                        <span
                                            class="text-gray-300 dark:text-gray-600"
                                            >•</span
                                        >
                                        <span class="flex items-center gap-1">
                                            <Icon name="calendar" size={14} />
                                            {formatDate(link.created_at)}
                                        </span>
                                    </div>
                                </div>

                                <!-- Actions -->
                                <div
                                    class="flex items-center gap-2 flex-shrink-0"
                                >
                                    <!-- Copy Button -->
                                    <button
                                        onclick={() =>
                                            copyToClipboard(link.alias)}
                                        class="btn-icon"
                                        title="Copy Link"
                                    >
                                        <Icon name="copy" size={20} />
                                    </button>

                                    <!-- Analytics Button -->
                                    <a
                                        href="/analytics/{link.alias}"
                                        use:inertia
                                        class="btn-icon"
                                        title="View Analytics"
                                    >
                                        <Icon name="bar-chart-3" size={20} />
                                    </a>

                                    <!-- Edit Button -->
                                    <a
                                        href="/links/{link.id}/edit"
                                        use:inertia
                                        class="btn-icon"
                                        title="Edit Link"
                                    >
                                        <Icon name="edit" size={20} />
                                    </a>

                                    <!-- Toggle Status -->
                                    <button
                                        onclick={() => handleToggle(link.id)}
                                        class="btn-icon"
                                        title={link.is_active
                                            ? "Deactivate"
                                            : "Activate"}
                                    >
                                        <Icon name="refresh" size={20} />
                                    </button>

                                    <!-- Delete Button -->
                                    <button
                                        onclick={() => handleDelete(link.id)}
                                        class="btn-icon hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                                        title="Delete Link"
                                    >
                                        <Icon name="trash-2" size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
                href="/links/create"
                use:inertia
                class="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-orange-500 via-brand-orange-400 to-brand-orange-600 p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
                <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div class="relative flex items-center gap-4">
                    <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon name="plus" size={28} />
                    </div>
                    <div>
                        <h3 class="font-bold text-lg">Create New Link</h3>
                        <p class="text-sm text-white/90">Shorten URLs with advanced features</p>
                    </div>
                </div>
            </a>

            <a
                href="/links"
                use:inertia
                class="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-blue-700 via-brand-blue-600 to-brand-blue-800 p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
                <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div class="relative flex items-center gap-4">
                    <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon name="files" size={28} />
                    </div>
                    <div>
                        <h3 class="font-bold text-lg">Manage Links</h3>
                        <p class="text-sm text-white/90">Edit, delete, and organize all links</p>
                    </div>
                </div>
            </a>

            <a
                href="/analytics"
                use:inertia
                class="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-cyan-500 via-brand-cyan-400 to-brand-cyan-600 p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
                <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div class="relative flex items-center gap-4">
                    <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon name="bar-chart-3" size={28} />
                    </div>
                    <div>
                        <h3 class="font-bold text-lg">View Analytics</h3>
                        <p class="text-sm text-white/90">Track performance and insights</p>
                    </div>
                </div>
            </a>
        </div>
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
</style>
