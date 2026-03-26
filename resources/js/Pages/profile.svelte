<script>
  import axios from "axios";
  import AppHeader from "../Components/AppHeader.svelte";
  import Icon from "../Components/Icon.svelte";
  import { Toast } from "../Components/helper";
  export let user;

  let current_password;
  let new_password;
  let confirm_password;
  let isLoading = false;
  let avatarFile;
  let previewUrl = user.avatar || null;

  function handleAvatarChange(event) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      isLoading = true;
      axios
        .post("/assets/avatar", formData)
        .then((response) => {
          setTimeout(() => {
            isLoading = false;
            previewUrl = response.data + "?v=" + Date.now();
          }, 500);
          user.avatar = response.data + "?v=" + Date.now();
        })
        .catch((error) => {
          isLoading = false;
        });
    }
  }

  async function changeProfile() {
    isLoading = true;
    try {
      const response = await axios.post("/change-profile", user);
      Toast("Profile updated", "success");
    } catch (error) {
      if (error.response.data.code == "SQLITE_CONSTRAINT_UNIQUE") {
        Toast("Username or email already taken", "error");
      } else {
        Toast(error.response.data.code, "error");
      }
    }
    isLoading = false;
  }

  async function changePassword() {
    if (new_password != confirm_password) {
      Toast("Password not match", "error");
      return;
    }

    if (!current_password || !new_password || !confirm_password) {
      Toast("Please fill all fields", "error");
      return;
    }

    isLoading = true;
    try {
      const response = await axios.post("/auth/change-password", {
        current_password,
        new_password,
        confirm_password,
      });
      Toast(response.data.message);
      current_password = "";
      new_password = "";
      confirm_password = "";
    } catch (error) {
      Toast(error.response.data.message, "error");
    }
    isLoading = false;
  }
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <AppHeader {user} currentPage="profile" />

  <div class="max-w-4xl mx-auto p-4 pt-8">
    <div class="max-w-3xl mx-auto mb-8">
      <div class="bg-white dark:bg-[#111827] rounded-3xl shadow-sm overflow-hidden border border-gray-100 dark:border-white/5">
        <div class="p-6">
          <div class="flex items-center space-x-4">
            <div class="relative group">
              <div class="w-20 h-20 rounded-full bg-gradient-to-br from-brand-orange-500 to-brand-orange-400 overflow-hidden">
                {#if previewUrl}
                  <img src={previewUrl} alt="Profile" class="w-full h-full object-cover" />
                {:else}
                  <div class="w-full h-full flex items-center justify-center">
                    <span class="text-2xl font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                {/if}
              </div>
              <label class="absolute bottom-0 right-0 bg-brand-orange-500 hover:bg-brand-orange-600 text-white p-1.5 rounded-xl transition-colors">
                <Icon name="camera" size={16} />
                <input type="file" accept="image/*" onchange={handleAvatarChange} class="hidden" />
              </label>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
              <p class="text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-3xl mx-auto space-y-6">
      <!-- Personal Information -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl shadow-sm border border-gray-100 dark:border-white/5">
        <div class="p-6">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <div class="w-10 h-10 bg-gradient-to-br from-brand-orange-500 to-brand-orange-400 rounded-xl flex items-center justify-center">
              <Icon name="user" size={20} color="#ffffff" />
            </div>
            Personal Information
          </h2>
          <form onsubmit={changeProfile} class="space-y-6">
            <div class="grid grid-cols-1 gap-6">
              <div class="space-y-1">
                <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                  bind:value={user.name}
                  type="text"
                  id="name"
                  class="w-full px-4 py-3 rounded-xl bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-orange-500/50 focus:border-transparent dark:text-white transition duration-200 ease-in-out"
                  placeholder="Your full name"
                />
              </div>

              <div class="space-y-1">
                <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  bind:value={user.email}
                  type="email"
                  id="email"
                  class="w-full px-4 py-3 rounded-xl bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-orange-500/50 focus:border-transparent dark:text-white transition duration-200 ease-in-out"
                  placeholder="you@example.com"
                />
              </div>

              <div class="space-y-1">
                <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                <input
                  bind:value={user.phone}
                  type="text"
                  id="phone"
                  class="w-full px-4 py-3 rounded-xl bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-orange-500/50 focus:border-transparent dark:text-white transition duration-200 ease-in-out"
                  placeholder="Your phone number"
                />
              </div>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                class="inline-flex items-center px-4 py-2 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-medium shadow-md shadow-brand-orange-500/20 active:scale-[0.98] transition duration-200 ease-in-out dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {#if isLoading}
                  <Icon name="loader" size={16} class="animate-spin -ml-1 mr-2" />
                  Saving...
                {:else}
                  <Icon name="save" size={16} class="mr-2" />
                  Save Changes
                {/if}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Change Password -->
      <div class="bg-white dark:bg-[#111827] rounded-3xl shadow-sm border border-gray-100 dark:border-white/5">
        <div class="p-6">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <div class="w-10 h-10 bg-gradient-to-br from-brand-orange-500 to-brand-orange-400 rounded-xl flex items-center justify-center">
              <Icon name="lock" size={20} color="#ffffff" />
            </div>
            Change Password
          </h2>
          <form onsubmit={changePassword} class="space-y-6">
            <div class="grid grid-cols-1 gap-6">
              <div>
                <label for="current_password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                <input
                  bind:value={current_password}
                  type="password"
                  id="current_password"
                  class="w-full px-4 py-3 rounded-xl bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-orange-500/50 focus:border-transparent dark:text-white transition duration-200 ease-in-out"
                />
              </div>

              <div>
                <label for="new_password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                <input
                  bind:value={new_password}
                  type="password"
                  id="new_password"
                  class="w-full px-4 py-3 rounded-xl bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-orange-500/50 focus:border-transparent dark:text-white transition duration-200 ease-in-out"
                />
              </div>

              <div>
                <label for="confirm_password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
                <input
                  bind:value={confirm_password}
                  type="password"
                  id="confirm_password"
                  class="w-full px-4 py-3 rounded-xl bg-gray-50/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-brand-orange-500/50 focus:border-transparent dark:text-white transition duration-200 ease-in-out"
                />
              </div>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                class="inline-flex items-center px-4 py-2 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 text-white font-medium shadow-md shadow-brand-orange-500/20 active:scale-[0.98] transition duration-200 ease-in-out dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {#if isLoading}
                  <Icon name="loader" size={16} class="animate-spin -ml-1 mr-2" />
                  Updating...
                {:else}
                  <Icon name="lock" size={16} class="mr-2" />
                  Update Password
                {/if}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
