<script>
  import { inertia, router } from '@inertiajs/svelte'
  import KlikAjaLogo from '../../Components/KlikAjaLogo.svelte'; 
    import { password_generator } from '../../Components/helper';

  export let id;
  export let error;

  let form = {
    password: '',
    password_confirmation: '',
    id
  }
 
  function generatePassword()
  { 
    const retVal = password_generator(10); 
    form.password = retVal
    form.password_confirmation = retVal
  }

  function submitForm() {
    if(form.password != form.password_confirmation) {
      alert("Password dan konfirmasi password harus sama")
      return false;
    }

    router.post(`/reset-password`, form)
  }
</script>

<section class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0">
    <div class="mb-6">
      <KlikAjaLogo size="large" />
    </div>
    <div class="w-full bg-white rounded-2xl shadow-xl dark:bg-gray-800 md:mt-0 sm:max-w-md xl:p-0 border border-gray-200 dark:border-gray-700">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 class="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Buat Password Baru
        </h1>
        <p class="text-sm text-center text-gray-600 dark:text-gray-400">
          Masukkan password baru untuk akun Anda
        </p>
        
        {#if error}
        <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-900 dark:text-red-400" role="alert">
           {error}
        </div>
        {/if}

        <form class="space-y-4 md:space-y-6" on:submit|preventDefault={submitForm}>
          <div>
            <label for="password" class="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Password Baru</label>
            <input 
              bind:value={form.password}
              type="password" 
              name="password" 
              id="password" 
              placeholder="••••••••" 
              class="bg-white border-2 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-[#FF6B35] focus:ring-0 focus:outline-none block w-full py-3 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-colors duration-150"
              required
            >
            <button type="button" on:click={generatePassword} class="text-xs text-[#FF6B35] hover:text-[#004E89] font-medium transition-colors duration-200 mt-1">Generate Password</button>
          </div>
          <div>
            <label for="confirm-password" class="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Konfirmasi Password</label>
            <input 
              bind:value={form.password_confirmation}
              type="password" 
              name="confirm-password" 
              id="confirm-password" 
              placeholder="••••••••" 
              class="bg-white border-2 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-[#FF6B35] focus:ring-0 focus:outline-none block w-full py-3 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-colors duration-150"
              required
            >
          </div>

          <button 
            type="submit" 
            class="w-full text-white bg-[#FF6B35] hover:bg-[#004E89] focus:ring-4 focus:outline-none focus:ring-[#FF6B35]/50 font-semibold rounded-lg text-sm px-5 py-3 text-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Reset Password
          </button>

          <p class="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
            Ingat password Anda? <a href="/login" use:inertia class="font-semibold text-[#FF6B35] hover:text-[#004E89] dark:text-[#00D9FF] dark:hover:text-[#FF6B35] transition-colors duration-200">Masuk di sini</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</section>