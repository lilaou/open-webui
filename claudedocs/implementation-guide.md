# Quick Links Implementation Guide

## CSS Code

Add to your theme CSS:

```css
.workspace-quick-links {
  width: 100%;
  max-width: 720px;
  margin: 24px auto 0;
}

.quick-links-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.quick-link-card {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  min-height: 24px;
  background: #F8F9FA;
  border: 1px solid #E8EAED;
  border-radius: 24px;
  color: #1F1F1F;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s;
}

.quick-link-card:hover {
  background: rgba(0, 0, 0, 0.04);
  border-color: #4285F4;
  transform: translateY(-2px);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
```

## Svelte Component

Create QuickLinks.svelte:

```svelte
<script>
  let links = [
    { id: '1', title: 'Models', url: '/admin/settings/models', icon: 'robot' },
    { id: '2', title: 'Documents', url: '/documents', icon: 'book' }
  ];
</script>

<div class="workspace-quick-links">
  <div class="quick-links-grid">
    {#each links as link}
      <a class="quick-link-card" href={link.url}>
        <div class="quick-link-icon">{link.icon}</div>
        <div class="quick-link-title">{link.title}</div>
      </a>
    {/each}
  </div>
</div>
```

## Integration

1. Create component file
2. Add CSS to theme
3. Import in workspace page
4. Configure links in localStorage or config

## Storage Options

### LocalStorage
```javascript
localStorage.setItem('quick-links', JSON.stringify(links));
```

### API Integration
```javascript
await fetch('/api/v1/user/settings', {
  method: 'POST',
  body: JSON.stringify({ quickLinks: links })
});
```

Ready to implement in Open WebUI!
