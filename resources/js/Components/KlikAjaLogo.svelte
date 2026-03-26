<script>
    export let size = "default"; // 'small', 'default', 'large'
    export let showText = true;

    const sizes = {
        small: "text-xl",
        default: "text-2xl",
        large: "text-3xl",
    };
</script>

<div class="flex items-center gap-2 {sizes[size]}">
    <!-- Logo Icon -->
    <div class="relative w-8 h-8 flex items-center justify-center">
        <div
            class="absolute inset-0 bg-gradient-to-br from-brand-orange-400 to-brand-orange-600 rounded-lg blur opacity-30 animate-pulse-slow"
        ></div>
        <img
            src="/public/favicon-96x96.png"
            alt="KlikAja Logo"
            class="relative w-7 h-7 object-contain"
        />
    </div>

    <!-- Brand name -->
    {#if showText}
        <span class="font-bold tracking-tight">
            <span
                class="bg-gradient-to-r from-brand-orange-500 to-brand-orange-400 bg-clip-text text-transparent"
                >Klik</span
            ><span
                class="bg-gradient-to-r from-brand-blue-700 to-brand-blue-900 dark:from-brand-blue-400 dark:to-white bg-clip-text text-transparent"
                >Aja</span
            >
        </span>
    {/if}
</div>
