# 📁 Folders & Tags - Usage Guide

## 🎯 Overview

Fase 2 menambahkan fitur **Folders & Tags** untuk mengorganisir links. Berikut adalah cara menggunakan komponen-komponen yang sudah dibuat.

---

## 📦 Components yang Tersedia

### 1. **FolderSidebar.svelte**
Sidebar untuk menampilkan dan mengelola folders.

**Props:**
- `selectedFolder` (bindable) - Folder yang sedang dipilih
- `onFolderChange` (function) - Callback ketika folder berubah

**Features:**
- ✅ List semua folders user
- ✅ Create folder baru dengan modal
- ✅ Pilih icon & color untuk folder
- ✅ Show link count per folder
- ✅ Filter "All Links"

### 2. **TagSelector.svelte**
Component untuk memilih dan mengelola tags pada link.

**Props:**
- `selectedTags` (bindable) - Array of selected tags
- `linkId` (optional) - ID link untuk fetch existing tags

**Features:**
- ✅ Multi-select tags dengan dropdown
- ✅ Create tag baru dengan modal
- ✅ Pilih color untuk tag
- ✅ Visual tag badges
- ✅ Remove tags

---

## 🔧 Cara Pakai di Pages

### 1️⃣ **Links/Index.svelte** - List Links dengan Folder Sidebar

```svelte
<script>
  import FolderSidebar from '../../Components/FolderSidebar.svelte';
  
  let { user, links } = $props();
  
  let selectedFolder = $state(null);
  let filteredLinks = $state(links);
  
  function handleFolderChange(folder) {
    if (folder === null) {
      // Show all links
      filteredLinks = links;
    } else {
      // Filter by folder
      filteredLinks = links.filter(link => link.folder_id === folder.id);
    }
  }
</script>

<div class="flex gap-6">
  <!-- Sidebar -->
  <aside class="w-64 flex-shrink-0">
    <FolderSidebar 
      bind:selectedFolder={selectedFolder}
      onFolderChange={handleFolderChange}
    />
  </aside>
  
  <!-- Main Content -->
  <main class="flex-1">
    <h1>Links {selectedFolder ? `in ${selectedFolder.name}` : ''}</h1>
    
    {#each filteredLinks as link}
      <!-- Link card -->
    {/each}
  </main>
</div>
```

---

### 2️⃣ **Links/Create.svelte** - Create Link dengan Folder & Tags

```svelte
<script>
  import TagSelector from '../../Components/TagSelector.svelte';
  import axios from 'axios';
  
  let { user } = $props();
  
  // Form state
  let urls = $state([{ url: '', weight: 100 }]);
  let alias = $state('');
  let folderId = $state(null);
  let selectedTags = $state([]);
  
  // Fetch folders for dropdown
  let folders = $state([]);
  
  onMount(async () => {
    const response = await axios.get('/api/folders');
    folders = response.data.data || [];
  });
  
  async function handleSubmit() {
    // 1. Create link
    const linkResponse = await axios.post('/links', {
      urls: urls.map(u => u.url),
      alias,
      folder_id: folderId || null
    });
    
    const linkId = linkResponse.data.data.id;
    
    // 2. Attach tags if any
    if (selectedTags.length > 0) {
      await axios.post(`/api/links/${linkId}/tags`, {
        tag_ids: selectedTags.map(t => t.id)
      });
    }
    
    // Redirect to links page
    router.visit('/links');
  }
</script>

<form onsubmit={handleSubmit}>
  <!-- URLs -->
  <div class="form-group">
    <label>Destination URLs</label>
    {#each urls as url, i}
      <input type="url" bind:value={url.url} />
    {/each}
  </div>
  
  <!-- Alias -->
  <div class="form-group">
    <label>Custom Alias</label>
    <input type="text" bind:value={alias} />
  </div>
  
  <!-- Folder Selector -->
  <div class="form-group">
    <label>Folder (Optional)</label>
    <select bind:value={folderId}>
      <option value={null}>No Folder</option>
      {#each folders as folder}
        <option value={folder.id}>{folder.icon} {folder.name}</option>
      {/each}
    </select>
  </div>
  
  <!-- Tags Selector -->
  <TagSelector bind:selectedTags={selectedTags} />
  
  <button type="submit">Create Link</button>
</form>
```

---

### 3️⃣ **Links/Edit.svelte** - Edit Link dengan Folder & Tags

```svelte
<script>
  import TagSelector from '../../Components/TagSelector.svelte';
  import axios from 'axios';
  
  let { user, link } = $props();
  
  let folderId = $state(link.folder_id);
  let selectedTags = $state([]); // Will be loaded by TagSelector
  let folders = $state([]);
  
  onMount(async () => {
    const response = await axios.get('/api/folders');
    folders = response.data.data || [];
  });
  
  async function handleSubmit() {
    // 1. Update link
    await axios.put(`/links/${link.id}`, {
      folder_id: folderId || null,
      // ... other fields
    });
    
    // 2. Get current tags
    const currentTagsResponse = await axios.get(`/api/links/${link.id}/tags`);
    const currentTags = currentTagsResponse.data.data || [];
    
    // 3. Find tags to attach and detach
    const currentTagIds = currentTags.map(t => t.id);
    const selectedTagIds = selectedTags.map(t => t.id);
    
    const toAttach = selectedTagIds.filter(id => !currentTagIds.includes(id));
    const toDetach = currentTagIds.filter(id => !selectedTagIds.includes(id));
    
    // 4. Attach new tags
    if (toAttach.length > 0) {
      await axios.post(`/api/links/${link.id}/tags`, {
        tag_ids: toAttach
      });
    }
    
    // 5. Detach removed tags
    if (toDetach.length > 0) {
      await axios.delete(`/api/links/${link.id}/tags`, {
        data: { tag_ids: toDetach }
      });
    }
    
    router.visit('/links');
  }
</script>

<form onsubmit={handleSubmit}>
  <!-- Folder Selector -->
  <div class="form-group">
    <label>Folder</label>
    <select bind:value={folderId}>
      <option value={null}>No Folder</option>
      {#each folders as folder}
        <option value={folder.id}>{folder.icon} {folder.name}</option>
      {/each}
    </select>
  </div>
  
  <!-- Tags Selector (will auto-load existing tags) -->
  <TagSelector 
    bind:selectedTags={selectedTags}
    linkId={link.id}
  />
  
  <button type="submit">Update Link</button>
</form>
```

---

## 🔌 API Endpoints yang Tersedia

### **Folders API**

```javascript
// Get all folders
GET /api/folders
Response: { success: true, data: [...folders] }

// Create folder
POST /api/folders
Body: { name, color, icon, description }
Response: { success: true, data: folder }

// Update folder
PUT /api/folders/:id
Body: { name, color, icon, description, position }
Response: { success: true, data: folder }

// Delete folder
DELETE /api/folders/:id
Response: { success: true, links_moved: count }

// Move links to folder
POST /api/folders/:id/move-links
Body: { link_ids: [id1, id2, ...] }
Response: { success: true, moved_count: count }

// Reorder folders
POST /api/folders/reorder
Body: { folder_ids: [id1, id2, ...] }
Response: { success: true }
```

### **Tags API**

```javascript
// Get all tags
GET /api/tags
Response: { success: true, data: [...tags] }

// Create tag
POST /api/tags
Body: { name, color, description }
Response: { success: true, data: tag }

// Update tag
PUT /api/tags/:id
Body: { name, color, description }
Response: { success: true, data: tag }

// Delete tag
DELETE /api/tags/:id
Response: { success: true }

// Get tags for a link
GET /api/links/:linkId/tags
Response: { success: true, data: [...tags] }

// Attach tags to link
POST /api/links/:linkId/tags
Body: { tag_ids: [id1, id2, ...] }
Response: { success: true, attached_count: count }

// Detach tags from link
DELETE /api/links/:linkId/tags
Body: { tag_ids: [id1, id2, ...] }
Response: { success: true, detached_count: count }
```

---

## 🎨 Styling

Kedua komponen sudah menggunakan **TailwindCSS** dan **KlikAja branding colors**:
- Orange (#FF6B35) - Primary actions
- Blue (#004E89) - Headers
- Cyan (#00D9FF) - Accents
- Dark mode support ✅

---

## 📝 Next Steps

1. **Update LinkController** - Tambahkan support untuk `folder_id` di `store()` dan `update()`
2. **Update Links/Index.svelte** - Integrate FolderSidebar
3. **Update Links/Create.svelte** - Add folder dropdown + TagSelector
4. **Update Links/Edit.svelte** - Add folder dropdown + TagSelector
5. **Update Dashboard** - Show folder stats

---

## 🚀 Testing

```bash
# Test folder creation
curl -X POST http://localhost:3000/api/folders \
  -H "Content-Type: application/json" \
  -d '{"name":"Work Links","color":"#FF6B35","icon":"briefcase"}'

# Test tag creation
curl -X POST http://localhost:3000/api/tags \
  -H "Content-Type: application/json" \
  -d '{"name":"Marketing","color":"#00D9FF"}'

# Test attach tags to link
curl -X POST http://localhost:3000/api/links/{linkId}/tags \
  -H "Content-Type: application/json" \
  -d '{"tag_ids":["tag-id-1","tag-id-2"]}'
```

---

## ✅ Summary

**Komponen yang sudah dibuat:**
- ✅ FolderSidebar.svelte - Sidebar untuk folders
- ✅ TagSelector.svelte - Multi-select tags
- ✅ FolderController.ts - Backend CRUD folders
- ✅ TagController.ts - Backend CRUD tags
- ✅ Migrations (4 tables) - Database schema
- ✅ Routes - API endpoints

**Yang perlu diupdate:**
- 🔄 Links/Index.svelte - Add FolderSidebar
- 🔄 Links/Create.svelte - Add folder + tags
- 🔄 Links/Edit.svelte - Add folder + tags
- 🔄 LinkController - Support folder_id in store/update

Mau lanjut update pages yang mana dulu? 🚀
