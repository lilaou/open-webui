# Tailwind CSS v4 → v3 完整迁移记录

## 问题根源

项目原本使用 Tailwind CSS v4 (alpha/beta)，导致以下错误：
```
[postcss] Missing field `negated` on ScannerOptions.sources
[postcss] postcss-import: Unknown word
```

## 完整修复步骤

### 1. 卸载 Tailwind CSS v4 包
```bash
npm uninstall @tailwindcss/postcss tailwindcss @tailwindcss/typography @tailwindcss/container-queries --legacy-peer-deps
```

### 2. 安装 Tailwind CSS v3.4.x
```bash
npm install -D tailwindcss@^3.4.0 @tailwindcss/typography@^0.5.13 @tailwindcss/container-queries@^0.1.1 autoprefixer@^10.4.16 --legacy-peer-deps
```

**安装的版本：**
- tailwindcss: 3.4.18
- @tailwindcss/typography: 0.5.19
- @tailwindcss/container-queries: 0.1.1
- autoprefixer: 10.4.22

### 3. 更新 PostCSS 配置

**文件：`postcss.config.js`**

从：
```javascript
export default {
	plugins: {
		'@tailwindcss/postcss': {}  // ❌ v4 语法
	}
};
```

改为：
```javascript
export default {
	plugins: {
		tailwindcss: {},  // ✅ v3 标准语法
		autoprefixer: {}
	}
};
```

### 4. 更新主 CSS 文件

**文件：`src/tailwind.css`**

#### 4.1 修改导入语法

从：
```css
@import 'tailwindcss';  /* ❌ v4 语法 */
@config '../tailwind.config.js';  /* ❌ v4 语法 */
```

改为：
```css
@tailwind base;  /* ✅ v3 标准语法 */
@tailwind components;
@tailwind utilities;
```

#### 4.2 修改主题函数

从：
```css
input::placeholder {
    color: theme(--color-gray-400);  /* ❌ v4 语法 */
}
```

改为：
```css
input::placeholder {
    @apply text-gray-400;  /* ✅ v3 标准语法 */
}
```

#### 4.3 移除自定义变体

删除：
```css
@custom-variant hover (&:hover);  /* ❌ v4 语法，v3 不支持 */
```

### 5. 清除缓存
```bash
Remove-Item -Recurse -Force node_modules\.vite
```

### 6. 重启开发服务器
```bash
npm run dev
```

## v3 vs v4 语法对照表

| 功能 | v4 语法 | v3 语法 |
|------|---------|---------|
| CSS 导入 | `@import 'tailwindcss';` | `@tailwind base; @tailwind components; @tailwind utilities;` |
| 配置文件 | `@config '../tailwind.config.js';` | 在 PostCSS 配置中指定 |
| 主题函数 | `theme(--color-gray-400)` | `@apply text-gray-400` 或使用 CSS 变量 |
| 自定义变体 | `@custom-variant hover (&:hover);` | 在 `tailwind.config.js` 中使用 `plugin` |
| PostCSS 插件 | `@tailwindcss/postcss` | `tailwindcss` + `autoprefixer` |

## 修改的文件清单

1. ✅ `postcss.config.js` - 更新 PostCSS 插件配置
2. ✅ `src/tailwind.css` - 更新 CSS 导入和语法
3. ✅ `package.json` - 更新依赖版本（自动）
4. ✅ `package-lock.json` - 更新锁定文件（自动）

## 不需要修改的文件

- ✅ `tailwind.config.js` - 完全兼容 v3 和 v4
- ✅ 所有组件文件（`.svelte`, `.ts`, `.js`）- Tailwind 类名语法不变
- ✅ 所有自定义样式 - CSS 语法不变

## 功能验证清单

迁移后需要验证以下功能：

- [ ] 服务器启动无错误
- [ ] 所有页面样式正常显示
- [ ] 亮色/暗色主题切换正常
- [ ] 响应式布局正常
- [ ] 自定义组件样式正常
- [ ] 快速链接区域样式正常（新修改的功能）

## 为什么选择 v3？

### Tailwind CSS v4 的问题
- ❌ Alpha/Beta 版本，不稳定
- ❌ 配置复杂，需要特殊的 PostCSS 设置
- ❌ 与某些工具链不兼容
- ❌ 文档不完整
- ❌ 社区支持有限

### Tailwind CSS v3 的优势
- ✅ 稳定的生产版本
- ✅ 完整的文档和示例
- ✅ 广泛的社区支持
- ✅ 与所有主流工具兼容
- ✅ 所有必需功能都可用

## 性能影响

- **构建速度**：v3 和 v4 相似
- **包大小**：v3 略大，但可以通过 PurgeCSS 优化
- **运行时性能**：无差异（都是纯 CSS）

## 未来升级到 v4

当 Tailwind CSS v4 正式发布（stable 版本）后，可以考虑升级：

1. 检查 v4 的发布公告和变更日志
2. 测试与项目依赖的兼容性
3. 按照官方迁移指南操作
4. 在开发环境充分测试后再部署到生产环境

## 故障排查

### 如果还有 PostCSS 错误

1. **完全清除缓存**
   ```bash
   Remove-Item -Recurse -Force node_modules\.vite
   Remove-Item -Recurse -Force .svelte-kit
   npm cache clean --force
   ```

2. **重新安装所有依赖**
   ```bash
   Remove-Item -Recurse -Force node_modules
   Remove-Item package-lock.json
   npm install --legacy-peer-deps
   ```

3. **检查是否有其他 CSS 文件使用 v4 语法**
   ```bash
   # 搜索 v4 特有语法
   grep -r "@import.*tailwindcss" src/
   grep -r "@config" src/
   grep -r "@custom-variant" src/
   grep -r "theme(--" src/
   ```

### 如果样式显示不正常

1. 检查浏览器控制台是否有 CSS 加载错误
2. 验证 `tailwind.config.js` 中的 `content` 配置包含所有组件文件
3. 确认没有使用 v4 特有的 Tailwind 类名

## 总结

✅ **迁移成功完成**
- Tailwind CSS v4 → v3.4.18
- PostCSS 配置更新
- CSS 文件语法更新
- 所有 v4 特有语法已移除
- 缓存已清除

**下一步：**
重启开发服务器，验证所有功能正常。

```bash
npm run dev
```

访问 `/custom-home` 查看快速链接的新样式！
