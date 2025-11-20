# Rianlon Open WebUI 自定义配置指南

本文档说明了如何在 Open WebUI 升级时保留和迁移 Rianlon 的自定义配置。

## 自定义文件结构

所有 Rianlon 的自定义配置都集中在以下文件中：

```
open-webui/src/routes/custom-home/
├── rianlon-custom.css          # 自定义样式文件
├── rianlon-links-config.ts     # 快速链接配置文件
└── components/
    └── QuickLinks.svelte       # 快速链接组件（已修改）
```

## 自定义内容说明

### 1. 样式自定义 (`rianlon-custom.css`)

这个文件包含所有自定义样式：

- **快速链接区域样式**
  - 布局：居中显示，最大宽度 720px
  - 动画：淡入动画效果
  - 响应式：移动端适配

- **Logo 替换**
  - 使用 Rianlon SVG logo
  - 布局调整：logo 在上，文字在下
  - 尺寸控制：最大宽度 160px，最小宽度 100px

### 2. 链接配置 (`rianlon-links-config.ts`)

这个文件包含系统预设链接的配置：

```typescript
// 系统链接列表
export const systemLinks: Link[] = [
  { id: 'oa', title: 'OA', url: 'https://oa.lal.link/', icon: '🏢' },
  { id: 'contract', title: '合同助手', url: '/DocSmart/', icon: '🌐' },
  // ... 更多链接
];

// 用户自定义链接管理函数
export function loadUserLinks(): Link[] { ... }
export function saveUserLinks(links: Link[]): void { ... }
```

**添加新的系统链接**：直接在 `systemLinks` 数组中添加即可。

### 3. 组件集成

在 `+page.svelte` 中的集成方式：

```typescript
// 导入自定义样式
import './rianlon-custom.css';
```

在 `QuickLinks.svelte` 中的集成方式：

```typescript
// 导入配置
import {
  systemLinks,
  loadUserLinks,
  saveUserLinks as saveToStorage,
  type Link
} from '../rianlon-links-config';
```

## Open WebUI 升级流程

### 步骤 1: 备份自定义文件

在升级前，备份以下文件：

```bash
# 进入 open-webui 目录
cd open-webui/src/routes/custom-home/

# 备份自定义文件
cp rianlon-custom.css ~/backup/
cp rianlon-links-config.ts ~/backup/
cp components/QuickLinks.svelte ~/backup/
cp +page.svelte ~/backup/
```

### 步骤 2: 升级 Open WebUI

```bash
# 更新 Open WebUI 代码
cd open-webui
git pull origin main

# 或者
git fetch upstream
git merge upstream/main
```

### 步骤 3: 恢复自定义文件

```bash
# 恢复自定义文件
cp ~/backup/rianlon-custom.css src/routes/custom-home/
cp ~/backup/rianlon-links-config.ts src/routes/custom-home/

# 检查 QuickLinks.svelte 和 +page.svelte 是否需要手动合并
diff ~/backup/QuickLinks.svelte src/routes/custom-home/components/QuickLinks.svelte
diff ~/backup/+page.svelte src/routes/custom-home/+page.svelte
```

### 步骤 4: 手动合并修改

如果 `QuickLinks.svelte` 或 `+page.svelte` 在新版本中有变化，需要手动合并：

#### 在 `+page.svelte` 中添加：

```typescript
// 在 import 区域添加
import './rianlon-custom.css';
```

#### 在 `QuickLinks.svelte` 中修改：

```typescript
// 1. 导入配置
import {
  systemLinks,
  loadUserLinks,
  saveUserLinks as saveToStorage,
  type Link
} from '../rianlon-links-config';

// 2. 删除组件内的 systemLinks 定义

// 3. 修改 onMount
onMount(() => {
  userLinks = loadUserLinks();
  updateAllLinks();
});

// 4. 修改 saveUserLinks 函数
function saveUserLinks() {
  saveToStorage(userLinks);
  updateAllLinks();
}
```

### 步骤 5: 测试功能

```bash
# 启动开发服务器
npm run dev

# 访问测试
# http://localhost:5173/custom-home
```

验证以下功能：
- ✅ 快速链接显示正常
- ✅ Logo 显示正确
- ✅ 样式符合预期
- ✅ 添加/删除自定义链接功能正常
- ✅ 移动端响应式正常

## 配置修改指南

### 添加新的系统链接

编辑 `rianlon-links-config.ts`：

```typescript
export const systemLinks: Link[] = [
  // ... 现有链接
  {
    id: 'new-link',           // 唯一ID
    title: '新链接',           // 显示标题
    url: 'https://example.com/', // 链接地址
    icon: '🔗',               // Emoji 图标
    isSystem: true            // 系统链接标记
  }
];
```

### 修改快速链接样式

编辑 `rianlon-custom.css`：

```css
/* 例如：修改快速链接区域的最大宽度 */
.quick-links-wrapper {
  max-width: 900px;  /* 原来是 720px */
}

/* 例如：修改 Logo 的最大宽度 */
.with-custom-logo :global(img[src*="favicon.png"]) {
  max-width: 200px !important;  /* 原来是 160px */
}
```

### 更换 Logo

编辑 `rianlon-custom.css`，在 `content: url()` 中替换 SVG 数据：

```css
.with-custom-logo :global(img[src*="favicon.png"]) {
  content: url("data:image/svg+xml,...新的SVG数据...") !important;
}
```

或者使用外部图片：

```css
.with-custom-logo :global(img[src*="favicon.png"]) {
  content: url("/path/to/your/logo.svg") !important;
}
```

## 故障排查

### 问题 1: 快速链接不显示

**原因**：可能是 CSS 文件未正确导入

**解决**：
```typescript
// 检查 +page.svelte 是否有这行
import './rianlon-custom.css';
```

### 问题 2: 链接配置不生效

**原因**：QuickLinks 组件未正确导入配置文件

**解决**：
```typescript
// 检查 QuickLinks.svelte 是否有这些导入
import {
  systemLinks,
  loadUserLinks,
  saveUserLinks as saveToStorage,
  type Link
} from '../rianlon-links-config';
```

### 问题 3: Logo 显示异常

**原因**：CSS 选择器可能与新版本冲突

**解决**：
1. 检查 `rianlon-custom.css` 中的选择器是否还有效
2. 使用浏览器开发者工具检查 DOM 结构变化
3. 根据新的 DOM 结构调整 CSS 选择器

### 问题 4: 样式冲突

**原因**：新版本可能引入了新的样式规则

**解决**：
1. 使用 `!important` 提高自定义样式的优先级
2. 检查是否有新的全局样式覆盖了自定义样式
3. 调整 CSS 选择器的特异性（specificity）

## 版本兼容性

本自定义配置测试兼容的 Open WebUI 版本：

- ✅ 当前版本（创建时）
- ⚠️ 未来版本需要测试

建议在每次升级后：
1. 测试所有自定义功能
2. 检查浏览器控制台是否有错误
3. 验证移动端和桌面端的显示效果

## 自定义文件清单

在版本控制中，应该跟踪这些自定义文件：

```
✅ rianlon-custom.css          - 必须备份
✅ rianlon-links-config.ts     - 必须备份
⚠️ +page.svelte                - 需要手动合并
⚠️ components/QuickLinks.svelte - 需要手动合并
```

## 联系和支持

如有问题，请联系 Rianlon 技术团队或查看相关文档：

- 项目仓库：`D:\MyProjects\taskpane`
- 相关文档：
  - `claudedocs/quick-links-style-update.md`
  - `claudedocs/tailwind-css-migration-final.md`
  - `claudedocs/cors-fix-guide.md`

---

**最后更新**: 2025-01-19
**维护者**: Rianlon Team
