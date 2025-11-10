# 🔄 KlikAja - Link Rotation Examples

> How to implement different rotation methods

---

## 📊 URLs Field Format

### Simple Format (Random/Sequential)
```json
[
  "https://example.com/page1",
  "https://example.com/page2",
  "https://example.com/page3"
]
```

### Weighted Format
```json
[
  {
    "url": "https://example.com/page1",
    "weight": 50
  },
  {
    "url": "https://example.com/page2",
    "weight": 30
  },
  {
    "url": "https://example.com/page3",
    "weight": 20
  }
]
```

**Note**: Total weight = 100 (percentage-based)

---

## 🎲 Rotation Methods

### 1. Random Rotation
**Use Case**: A/B testing, equal distribution

```typescript
// Example data
{
  "alias": "promo",
  "urls": [
    "https://shop.com/promo-a",
    "https://shop.com/promo-b",
    "https://shop.com/promo-c"
  ],
  "rotation_method": "random"
}

// Logic:
// Pick random URL from array
// Each URL has equal chance (33.33%)
```

**Implementation**:
```typescript
function getRandomUrl(urls: string[]): string {
  const randomIndex = Math.floor(Math.random() * urls.length);
  return urls[randomIndex];
}
```

---

### 2. Sequential Rotation
**Use Case**: Round-robin distribution, load balancing

```typescript
// Example data
{
  "alias": "download",
  "urls": [
    "https://cdn1.com/file.zip",
    "https://cdn2.com/file.zip",
    "https://cdn3.com/file.zip"
  ],
  "rotation_method": "sequential",
  "current_index": 0
}

// Logic:
// 1st click → cdn1 (index 0)
// 2nd click → cdn2 (index 1)
// 3rd click → cdn3 (index 2)
// 4th click → cdn1 (index 0) - loops back
```

**Implementation**:
```typescript
function getSequentialUrl(urls: string[], currentIndex: number): {
  url: string;
  nextIndex: number;
} {
  const url = urls[currentIndex];
  const nextIndex = (currentIndex + 1) % urls.length;
  
  return { url, nextIndex };
}

// Update current_index in database after each click
```

---

### 3. Weighted Rotation ⭐
**Use Case**: Prioritize certain URLs, gradual rollout

```typescript
// Example data
{
  "alias": "landing",
  "urls": [
    {
      "url": "https://site.com/landing-v1",
      "weight": 50
    },
    {
      "url": "https://site.com/landing-v2",
      "weight": 30
    },
    {
      "url": "https://site.com/landing-v3",
      "weight": 20
    }
  ],
  "rotation_method": "weighted"
}

// Logic:
// 50% of traffic → landing-v1
// 30% of traffic → landing-v2
// 20% of traffic → landing-v3
```

**Implementation**:
```typescript
interface WeightedUrl {
  url: string;
  weight: number;
}

function getWeightedUrl(urls: WeightedUrl[]): string {
  // Calculate total weight
  const totalWeight = urls.reduce((sum, item) => sum + item.weight, 0);
  
  // Generate random number between 0 and totalWeight
  let random = Math.random() * totalWeight;
  
  // Find which URL the random number falls into
  for (const item of urls) {
    random -= item.weight;
    if (random <= 0) {
      return item.url;
    }
  }
  
  // Fallback to first URL (shouldn't happen)
  return urls[0].url;
}
```

**Example Calculation**:
```
Total weight: 100
Random: 65

Check url1 (weight 50): 65 - 50 = 15 (still positive, continue)
Check url2 (weight 30): 15 - 30 = -15 (negative! return url2)
```

---

## 🎯 Use Case Examples

### Example 1: Product Launch (Gradual Rollout)
```json
{
  "alias": "new-product",
  "urls": [
    {
      "url": "https://shop.com/old-product",
      "weight": 80
    },
    {
      "url": "https://shop.com/new-product",
      "weight": 20
    }
  ],
  "rotation_method": "weighted"
}
```
**Strategy**: Start with 20% to new product, gradually increase

---

### Example 2: Geographic Load Balancing
```json
{
  "alias": "download",
  "urls": [
    "https://cdn-us.com/file.zip",
    "https://cdn-eu.com/file.zip",
    "https://cdn-asia.com/file.zip"
  ],
  "rotation_method": "sequential"
}
```
**Strategy**: Distribute load evenly across regions

---

### Example 3: A/B Testing Landing Pages
```json
{
  "alias": "signup",
  "urls": [
    {
      "url": "https://site.com/signup-variant-a",
      "weight": 50
    },
    {
      "url": "https://site.com/signup-variant-b",
      "weight": 50
    }
  ],
  "rotation_method": "weighted"
}
```
**Strategy**: Equal split for A/B test

---

### Example 4: Affiliate Links with Priority
```json
{
  "alias": "buy-now",
  "urls": [
    {
      "url": "https://affiliate1.com/product?ref=me",
      "weight": 60
    },
    {
      "url": "https://affiliate2.com/product?ref=me",
      "weight": 25
    },
    {
      "url": "https://affiliate3.com/product?ref=me",
      "weight": 15
    }
  ],
  "rotation_method": "weighted"
}
```
**Strategy**: Prioritize affiliate with best commission

---

## 🔧 LinkRotator Service Implementation

```typescript
// app/services/LinkRotator.ts

interface SimpleUrl {
  url: string;
}

interface WeightedUrl {
  url: string;
  weight: number;
}

type UrlData = string[] | WeightedUrl[];

export class LinkRotator {
  /**
   * Get next URL based on rotation method
   */
  static getNextUrl(
    urls: UrlData,
    method: 'random' | 'sequential' | 'weighted',
    currentIndex: number = 0
  ): { url: string; nextIndex?: number } {
    
    // Parse URLs if stored as JSON string
    const parsedUrls = typeof urls === 'string' ? JSON.parse(urls) : urls;
    
    switch (method) {
      case 'random':
        return { url: this.getRandomUrl(parsedUrls as string[]) };
      
      case 'sequential':
        return this.getSequentialUrl(parsedUrls as string[], currentIndex);
      
      case 'weighted':
        return { url: this.getWeightedUrl(parsedUrls as WeightedUrl[]) };
      
      default:
        return { url: parsedUrls[0] };
    }
  }
  
  /**
   * Random rotation
   */
  private static getRandomUrl(urls: string[]): string {
    const randomIndex = Math.floor(Math.random() * urls.length);
    return urls[randomIndex];
  }
  
  /**
   * Sequential rotation
   */
  private static getSequentialUrl(
    urls: string[],
    currentIndex: number
  ): { url: string; nextIndex: number } {
    const url = urls[currentIndex];
    const nextIndex = (currentIndex + 1) % urls.length;
    
    return { url, nextIndex };
  }
  
  /**
   * Weighted rotation
   */
  private static getWeightedUrl(urls: WeightedUrl[]): string {
    const totalWeight = urls.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const item of urls) {
      random -= item.weight;
      if (random <= 0) {
        return item.url;
      }
    }
    
    return urls[0].url;
  }
  
  /**
   * Validate URLs format
   */
  static validateUrls(urls: UrlData, method: string): boolean {
    if (!Array.isArray(urls) || urls.length === 0) {
      return false;
    }
    
    if (method === 'weighted') {
      // Check if weighted format
      return urls.every(item => 
        typeof item === 'object' && 
        'url' in item && 
        'weight' in item &&
        typeof item.weight === 'number'
      );
    } else {
      // Check if simple format
      return urls.every(item => typeof item === 'string');
    }
  }
}
```

---

## 📊 Database Examples

### Create Link with Random Rotation
```sql
INSERT INTO links (id, alias, urls, rotation_method, created_at, updated_at)
VALUES (
  'uuid-here',
  'promo',
  '["https://shop.com/a", "https://shop.com/b"]',
  'random',
  1699600000000,
  1699600000000
);
```

### Create Link with Weighted Rotation
```sql
INSERT INTO links (id, alias, urls, rotation_method, created_at, updated_at)
VALUES (
  'uuid-here',
  'landing',
  '[{"url":"https://site.com/v1","weight":70},{"url":"https://site.com/v2","weight":30}]',
  'weighted',
  1699600000000,
  1699600000000
);
```

### Create Link with Sequential Rotation
```sql
INSERT INTO links (id, alias, urls, rotation_method, current_index, created_at, updated_at)
VALUES (
  'uuid-here',
  'download',
  '["https://cdn1.com/file", "https://cdn2.com/file"]',
  'sequential',
  0,
  1699600000000,
  1699600000000
);
```

---

## ✅ Best Practices

### 1. Weight Validation
- Total weight should equal 100 (percentage)
- Each weight should be > 0
- Validate on create/update

### 2. URL Validation
- Validate URL format (https://)
- Check URL is reachable (optional)
- Sanitize input

### 3. Performance
- Cache parsed JSON in memory
- Update current_index in batch (sequential)
- Index on rotation_method for queries

### 4. Analytics
- Track which URL was served
- Store in analytics table for reporting
- Calculate conversion per URL variant

---

## 🎯 Frontend UI Examples

### Create Link Form - Rotation Method Selector

```svelte
<select bind:value={rotationMethod}>
  <option value="random">Random (A/B Testing)</option>
  <option value="sequential">Sequential (Round Robin)</option>
  <option value="weighted">Weighted (Priority)</option>
</select>

{#if rotationMethod === 'weighted'}
  <!-- Show weight inputs -->
  {#each urls as url, i}
    <input type="url" bind:value={url.url} />
    <input type="number" bind:value={url.weight} min="1" max="100" />
    <span>{url.weight}%</span>
  {/each}
  
  <div>Total: {totalWeight}%</div>
{:else}
  <!-- Show simple URL inputs -->
  {#each urls as url, i}
    <input type="url" bind:value={urls[i]} />
  {/each}
{/if}
```

---

## 🚀 Next Steps

1. ✅ Database schema supports all rotation methods
2. ⏳ Implement LinkRotator service
3. ⏳ Add rotation logic to LinkController.redirect()
4. ⏳ Build UI for rotation method selection
5. ⏳ Add analytics tracking per URL variant

---

**Ready to implement!** 🎉
