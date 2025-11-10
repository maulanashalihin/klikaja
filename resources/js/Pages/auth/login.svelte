<script>
    import { inertia,router } from '@inertiajs/svelte' 
    import KlikAjaLogo from '../../Components/KlikAjaLogo.svelte'; 
  
    let form = {
      email: '',
      password: '',
      password_confirmation: '',
      terms: false,
    }
    export let error;
    function submitForm()
    {
      
      router.post("/login", {email:form.email,password:form.password})
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
                    Masuk ke Akun Anda
                </h1>
              
                {#if error}
                <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50  dark:text-red-400 dark:bg-red-900" role="alert">
                   {error}
                </div>
                {/if}
             

            <!-- Google Login Button -->
<div class="flex flex-col space-y-4">
    <a href="/google/redirect" 
       class="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B35] transition-all duration-200">
        <svg class="h-5 w-5 mr-2" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
    </a>
    <div class="relative">
        <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400">Or continue with</span>
        </div>
    </div>
</div>

               
                <form class="space-y-4 md:space-y-6" on:submit|preventDefault={submitForm}>
                    <div>
                        <label for="email" class="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Email</label>
                        <input bind:value={form.email} required type="email" name="email" id="email" class="bg-white border-2 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-[#FF6B35] focus:ring-0 focus:outline-none block w-full py-3 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-colors duration-150" placeholder="nama@email.com" >
                     
                    </div>
                    <div>
                        <label for="password" class="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">Password</label>
                        <input bind:value={form.password} required type="password" name="password" id="password" placeholder="••••••••" class="bg-white border-2 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:border-[#FF6B35] focus:ring-0 focus:outline-none block w-full py-3 px-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-colors duration-150" >
                    </div>  
                    <div class="flex items-center justify-end">
                        <a href="/forgot-password" use:inertia class="text-sm font-medium text-[#FF6B35] hover:text-[#004E89] dark:text-[#00D9FF] dark:hover:text-[#FF6B35] transition-colors duration-200">Lupa Password?</a>
                    </div>
                    <button type="submit" class="w-full text-white bg-[#FF6B35] hover:bg-[#004E89] focus:ring-4 focus:outline-none focus:ring-[#FF6B35]/50 font-semibold rounded-lg text-sm px-5 py-3 text-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">Masuk</button>
                    <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                        Belum punya akun? <a href="/register" use:inertia class="font-semibold text-[#FF6B35] hover:text-[#004E89] dark:text-[#00D9FF] dark:hover:text-[#FF6B35] transition-colors duration-200">Daftar sekarang</a>
                    </p>
                    
                </form>
            </div>
        </div>
    </div>
  </section>