# 自定义主页使用说明

## 📋 概述

这是一个参考browser-app设计风格的自定义主页，包含：
- ✅ 原始Chat聊天功能（完全保留）
- ✅ 快速链接区域（在对话框下方，Gemini风格）
- ✅ 系统预设链接 + 用户自定义链接
- ✅ 升级友好的架构设计

## 🎨 设计特点

### 视觉风格
- **参考项目**: browser-app (http://localhost:8088/)
- **设计灵感**: Gemini风格的胶囊式链接
- **颜色主题**: Material Design配色方案
- **布局**: 水平流式布局，自适应换行

### 快速链接特性
- **胶囊形状**: 32px高度，24px圆角
- **悬停效果**: 上浮2px，蓝色边框，微妙阴影
- **响应式**: 移动端自适应缩小
- **可编辑**: 用户可添加/删除自定义链接

## 🚀 启用/禁用

### 启用自定义主页
编辑 `.env` 文件：
```bash
VITE_CUSTOM_HOME_ENABLED=true
```

### 禁用自定义主页（恢复默认）
编辑 `.env` 文件：
```bash
VITE_CUSTOM_HOME_ENABLED=false
```

## 📦 文件结构

```
src/routes/custom-home/
├── +page.svelte              # 主页面文件
├── components/
│   └── QuickLinks.svelte     # 快速链接组件
└── README.md                 # 本文档
```

## 🔧 自定义配置

### 修改系统预设链接

编辑 `components/QuickLinks.svelte` 文件，找到 `systemLinks` 数组：

```typescript
const systemLinks: Link[] = [
	{ id: 'models', title: '模型管理', url: '/workspace/models', icon: '🤖', isSystem: true },
	{ id: 'prompts', title: '提示词库', url: '/workspace/prompts', icon: '📝', isSystem: true },
	{ id: 'knowledge', title: '知识库', url: '/workspace/knowledge', icon: '📚', isSystem: true },
	{ id: 'tools', title: '工具箱', url: '/workspace/tools', icon: '🔧', isSystem: true }
];
```

### 添加新的系统链接

```typescript
const systemLinks: Link[] = [
	// ... 现有链接
	{ id: 'new-link', title: '新功能', url: '/new-feature', icon: '🌟', isSystem: true }
];
```

### 用户自定义链接

用户可以在页面上直接点击 "+" 按钮添加自定义链接，数据保存在浏览器的 localStorage 中。

## 🔄 升级维护策略

### 版本升级时保护自定义代码

#### 方法1: 使用升级脚本（推荐）

创建 `scripts/upgrade-with-custom.sh`:
```bash
#!/bin/bash
# 自动备份和恢复自定义主页

BACKUP_DIR="/tmp/openwebui-custom-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# 1. 备份
cp -r src/routes/custom-home "$BACKUP_DIR/"
cp .env "$BACKUP_DIR/.env"
git diff src/routes/(app)/+page.svelte > "$BACKUP_DIR/page-svelte-changes.diff"

# 2. 升级
git pull origin main

# 3. 恢复
cp -r "$BACKUP_DIR/custom-home" src/routes/
cp "$BACKUP_DIR/.env" .env

# 4. 重新应用路由修改
# 手动检查 page-svelte-changes.diff 并重新应用

# 5. 重新构建
npm install
npm run build

echo "✅ 升级完成! 备份目录: $BACKUP_DIR"
```

#### 方法2: 手动备份升级

```bash
# 1. 备份自定义代码
cp -r src/routes/custom-home /tmp/custom-home-backup
cp .env .env.backup

# 2. 拉取最新代码
git pull origin main

# 3. 恢复自定义代码
cp -r /tmp/custom-home-backup src/routes/custom-home
cp .env.backup .env

# 4. 检查并重新应用 +page.svelte 的修改
git diff src/routes/(app)/+page.svelte

# 5. 重新构建
npm install
npm run build
```

### 升级时需要注意的文件

只有**一个文件**被修改了：
- ✅ `src/routes/(app)/+page.svelte` - 添加了重定向逻辑

其他所有自定义代码都在独立目录中：
- ✅ `src/routes/custom-home/` - 完全独立
- ✅ `.env` - 环境配置
- ✅ `backend/open_webui/static/custom/` - 静态资源（如需要）

## 🛡️ Git冲突处理

### 预防冲突

1. **保持+page.svelte修改最小化**
   - 只添加必要的重定向逻辑
   - 不修改其他功能

2. **使用Git分支**
   ```bash
   git checkout -b custom-homepage
   # 在此分支上进行自定义开发
   ```

3. **升级时合并**
   ```bash
   git checkout main
   git pull origin main
   git checkout custom-homepage
   git merge main
   # 解决冲突（通常只有+page.svelte）
   ```

### 解决冲突

如果升级时 `+page.svelte` 有冲突：

1. 查看冲突内容
```bash
git diff src/routes/(app)/+page.svelte
```

2. 保留自定义逻辑
   - 保留 `goto` 导入
   - 保留 `browser` 导入
   - 保留 `USE_CUSTOM_HOME` 常量
   - 保留重定向逻辑

3. 合并上游更新
   - 保留原项目的新增功能
   - 确保错误处理逻辑完整

## 📱 测试检查清单

升级后进行以下测试：

- [ ] 访问主页 `/` 能正确重定向到 `/custom-home`
- [ ] 快速链接区域正常显示
- [ ] 系统预设链接可点击跳转
- [ ] 可以添加新的自定义链接
- [ ] 可以删除自定义链接
- [ ] 原始Chat功能正常工作
- [ ] 移动端布局正常
- [ ] 禁用自定义主页后能恢复默认主页

## 🎯 常见问题

### Q: 如何临时禁用自定义主页？
A: 修改 `.env` 文件，设置 `VITE_CUSTOM_HOME_ENABLED=false`，然后重启开发服务器。

### Q: 自定义链接存储在哪里？
A: 存储在浏览器的 localStorage 中，键名为 `customQuickLinks`。

### Q: 如何清除所有自定义链接？
A: 打开浏览器控制台，执行：
```javascript
localStorage.removeItem('customQuickLinks');
location.reload();
```

### Q: 升级后自定义链接消失了？
A: localStorage 数据与浏览器绑定，不会因升级消失。如果需要迁移数据：
```javascript
// 导出
const links = localStorage.getItem('customQuickLinks');
console.log(links); // 复制保存

// 导入
localStorage.setItem('customQuickLinks', '粘贴的JSON数据');
```

### Q: 如何更改快速链接的样式？
A: 编辑 `components/QuickLinks.svelte` 的 `<style>` 部分，调整：
- `.link-card` - 链接卡片样式
- `.link-icon` - 图标大小
- `.link-title` - 文字样式
- 颜色、间距、圆角等

## 📚 扩展建议

### 添加更多功能

1. **数据统计面板**
   - 创建 `components/Dashboard.svelte`
   - 显示使用统计、热门模型等

2. **主题切换**
   - 支持明暗主题切换
   - 自定义颜色方案

3. **布局选项**
   - 侧边栏显示快速链接
   - 顶部导航栏样式

4. **服务端存储**
   - 将自定义链接保存到后端API
   - 支持多设备同步

## 🤝 贡献

如果您改进了自定义主页，欢迎分享您的想法！

---

**版本**: 1.0.0
**创建日期**: 2025-11-14
**参考设计**: browser-app (http://localhost:8088/)
