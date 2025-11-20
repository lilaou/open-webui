# Custom Home 使用指南

## 概述

Custom Home 是一个独立的定制首页，提供了快速链接功能和自定义 Logo 显示，是 Open WebUI 的一个增强页面。

## 文件结构

```
open-webui2/
├── src/routes/custom-home/          # Custom Home 页面目录
│   ├── +page.svelte                  # 主页面组件
│   ├── components/                   # 子组件
│   │   ├── CustomChatWrapper.svelte # 聊天包装器（含跑马灯建议）
│   │   └── QuickLinks.svelte        # 快速链接组件
│   ├── rianlon-custom.css           # 自定义样式文件
│   ├── rianlon-links-config.ts      # 快速链接配置文件
│   └── README.md                     # 页面说明文档
└── claudedocs/                       # 相关文档目录
    ├── custom-home-implementation-summary.md
    ├── quick-links-specs.md
    └── ...
```

## 访问方式

启动应用后，访问：`http://localhost:5173/custom-home`

## 主要功能

### 1. 快速链接功能

**特性**：
- 系统预设 9 个快速链接（OA、合同助手、知识库等）
- 支持用户自定义添加链接
- 响应式网格布局，自动适应屏幕宽度
- 支持编辑、删除和拖拽排序

**配置文件**：`src/routes/custom-home/rianlon-links-config.ts`

**修改系统预设链接**：
```typescript
export const systemLinks: Link[] = [
	{ id: 'oa', title: 'OA', url: 'https://oa.lal.link/', icon: '🏢', isSystem: true },
	{ id: 'contract', title: '合同助手', url: '/DocSmart/', icon: '🌐', isSystem: true },
	// ... 添加或修改更多链接
];
```

### 2. 自定义 Logo

**Logo 样式**：使用 Rianlon SVG Logo，替代默认的 Open WebUI favicon

**样式文件**：`src/routes/custom-home/rianlon-custom.css`

**修改 Logo**：
在 `rianlon-custom.css` 中找到 `.with-custom-logo img[src*="favicon.png"]` 选择器，替换 `content: url(...)` 中的 SVG 数据。

### 3. 跑马灯建议功能

CustomChatWrapper 组件会自动将聊天建议以跑马灯形式垂直滚动显示。

## 智能显隐逻辑

**快速链接显示规则**：
- ✅ 在 `/custom-home` 首页显示
- ❌ 进入聊天后自动隐藏
- 逻辑：`showQuickLinks = pathname === '/custom-home' && !chatId`

**聊天区域高度自适应**：
- 显示快速链接时：聊天区域高度受限，为快速链接留出空间
- 隐藏快速链接时：聊天区域占满全屏

## 模态框支持

Custom Home 页面已集成以下模态框：
- **SettingsModal** - 设置界面
- **ChangelogModal** - 更新日志

这些模态框在 `+page.svelte` 中渲染，确保功能完整性。

## 样式定制

### 主要样式类

| 样式类 | 用途 | 文件位置 |
|--------|------|----------|
| `.quick-links-wrapper` | 快速链接容器 | rianlon-custom.css |
| `.with-custom-logo` | Logo 替换 | rianlon-custom.css |
| `.chat-wrapper` | 聊天区域 | +page.svelte |
| `.custom-home-container` | 页面容器 | +page.svelte |

### 修改快速链接样式

在 `rianlon-custom.css` 中找到 `.quick-links-wrapper` 相关样式进行修改。

## 升级兼容性

### 设计原则

1. **代码隔离**：所有自定义代码在 `custom-home` 目录下
2. **样式独立**：自定义样式在 `rianlon-custom.css` 中
3. **配置分离**：快速链接配置在独立的 `.ts` 文件中
4. **不修改核心**：尽量不修改 Open WebUI 的核心文件

### 升级流程

当 Open WebUI 升级时：

1. **备份 custom-home 目录**：
   ```bash
   cp -r src/routes/custom-home /backup/custom-home-$(date +%Y%m%d)
   ```

2. **升级 Open WebUI**：
   ```bash
   git pull origin main
   npm install
   ```

3. **恢复 custom-home**：
   ```bash
   cp -r /backup/custom-home-* src/routes/custom-home
   ```

4. **测试功能**：访问 `/custom-home` 验证所有功能正常

### 潜在冲突点

**需要检查的文件**：
- `tailwind.config.js` - 确保 z-index 扩展配置存在
- `src/lib/components/common/Modal.svelte` - 确保 z-index 使用内联样式

**如果这些文件被覆盖**，参考 `claudedocs/` 中的文档进行恢复。

## 常见问题

### Q1: 快速链接不显示？
**检查**：
1. 确认 URL 是 `/custom-home`（不是 `/custom-home/c/xxx`）
2. 确认没有活动的聊天会话（chatId 为空）
3. 检查浏览器控制台是否有错误

### Q2: Settings 模态框显示异常？
**检查**：
1. 确认 Modal.svelte 中 z-index 使用内联样式：`style="z-index: 9999;"`
2. 确认 tailwind.config.js 中有 z-index 扩展配置
3. 硬刷新页面清除缓存（Ctrl+Shift+R）

### Q3: Logo 没有替换？
**检查**：
1. 确认 `rianlon-custom.css` 被正确导入
2. 确认页面容器有 `with-custom-logo` class
3. 检查 SVG 数据是否正确编码

## 技术栈

- **框架**：SvelteKit
- **样式**：Tailwind CSS + 自定义 CSS
- **状态管理**：Svelte Stores
- **持久化**：LocalStorage (用户自定义链接)

## 参考文档

详细的技术文档请参考 `claudedocs/` 目录：
- `custom-home-implementation-summary.md` - 完整实现总结
- `quick-links-specs.md` - 快速链接功能规格
- `rianlon-customization-guide.md` - 升级维护指南

## 支持与反馈

如有问题或建议，请通过以下方式联系：
- 提交 Issue 到项目仓库
- 联系开发团队

---

**最后更新**：2025-01-20
**版本**：1.0.0
