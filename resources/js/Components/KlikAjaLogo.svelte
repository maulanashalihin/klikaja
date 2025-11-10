<script>
  export let size = 'default'; // 'small', 'default', 'large'
  
  const sizes = {
    small: 'text-xl',
    default: 'text-2xl',
    large: 'text-3xl'
  };
</script>

<div class="flex items-center gap-2 {sizes[size]}">
  <!-- Icon: Link symbol with gradient -->
  <div class="relative">
     <img src="/public/favicon-32x32.png" alt="Logo" class="w-8 h-8">
  </div>
  
  <!-- Brand name -->
  <span class="font-bold">
    <span class="text-[#FF6B35]">Klik</span><span class="text-[#004E89] dark:text-white">Aja</span>
  </span>
</div>
