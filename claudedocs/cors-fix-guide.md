# CORS 错误修复指南

## 问题描述

错误信息：
```
Access to fetch at 'http://localhost:8080/api/config' from origin 'http://localhost:5173'
has been blocked by CORS policy: The value of the 'Access-Control-Allow-Origin' header
in the response must not be the wildcard '*' when the request's credentials mode is 'include'.
```

## 问题原因

1. **前端**（http://localhost:5173）向**后端**（http://localhost:8080）发送带凭证的跨域请求
2. 使用了 `credentials: 'include'` 来发送 cookies/session
3. 后端 CORS 配置使用了通配符 `Access-Control-Allow-Origin: *`
4. **浏览器安全策略**：当请求包含凭证时，不允许使用通配符 `*`

## 解决方案：使用 Vite 代理

通过 Vite 开发服务器的代理功能，将前端请求转发到后端，避免跨域问题。

### 修改的文件

#### 1. `vite.config.ts` - 添加代理配置

```typescript
export default defineConfig({
	// ... 其他配置
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
				changeOrigin: true,
				secure: false,
				ws: true  // 支持 WebSocket
			}
		}
	}
});
```

**代理配置说明：**
- `target: 'http://localhost:8080'` - 后端服务器地址
- `changeOrigin: true` - 修改请求头的 origin 为目标 URL
- `secure: false` - 允许代理到 http（非 https）
- `ws: true` - 支持 WebSocket 连接（用于 Socket.io）

#### 2. `src/lib/constants.ts` - 修改 API 基础 URL

```typescript
// 之前：在开发模式下使用绝对 URL
export const WEBUI_BASE_URL = browser ? (dev ? `http://${WEBUI_HOSTNAME}` : ``) : ``;

// 之后：在开发模式下使用相对路径，让代理处理
export const WEBUI_BASE_URL = browser ? (dev ? `` : ``) : ``;
```

**工作原理：**
- 开发模式：`WEBUI_BASE_URL = ''`，请求 `/api/config`
- Vite 代理：拦截 `/api/*` 请求，转发到 `http://localhost:8080/api/*`
- 浏览器：认为是同源请求（都是 localhost:5173），无 CORS 问题

## 请求流程对比

### 修复前（有 CORS 问题）

```
浏览器 (localhost:5173)
    ↓ fetch('http://localhost:8080/api/config', {credentials: 'include'})
    ↓ [跨域请求]
后端 (localhost:8080)
    ↓ 返回 Access-Control-Allow-Origin: *
    ↓ [浏览器拒绝：不能用 * 配合 credentials]
    ✗ CORS 错误
```

### 修复后（无 CORS 问题）

```
浏览器 (localhost:5173)
    ↓ fetch('/api/config', {credentials: 'include'})
    ↓ [同源请求]
Vite 代理 (localhost:5173)
    ↓ 转发到 http://localhost:8080/api/config
    ↓ [服务器端请求，无 CORS 限制]
后端 (localhost:8080)
    ↓ 返回数据
Vite 代理
    ↓ 转发响应
浏览器
    ✓ 成功接收数据
```

## 代理的其他好处

1. **简化配置**：不需要修改后端 CORS 设置
2. **开发体验**：前后端可以在不同端口运行
3. **WebSocket 支持**：自动处理 Socket.io 连接
4. **路径重写**：可以重写请求路径（如果需要）
5. **环境隔离**：生产环境使用真实 URL，开发环境使用代理

## 生产环境部署

在生产环境中，`WEBUI_BASE_URL` 会是空字符串（`''`），前后端通常部署在同一域名下：

```
生产部署示例：
- 前端：https://example.com/
- 后端 API：https://example.com/api/
- 无需代理，无 CORS 问题
```

## 其他可能的解决方案（不推荐）

### 方案 2：修改后端 CORS 配置

如果控制后端代码，可以修改 CORS 设置：

```python
# Python/Flask 示例
from flask_cors import CORS

app = Flask(__name__)
CORS(app,
     origins=['http://localhost:5173'],  # ❌ 不使用 '*'
     supports_credentials=True)
```

**缺点：**
- 需要修改后端代码
- 需要为每个环境配置不同的 origins
- 如果后端是第三方服务，无法修改

### 方案 3：移除 credentials（不推荐）

```typescript
// 移除 credentials: 'include'
const res = await fetch(`${WEBUI_BASE_URL}/api/config`, {
	method: 'GET',
	// credentials: 'include',  // ❌ 移除
	headers: {
		'Content-Type': 'application/json'
	}
});
```

**缺点：**
- 无法发送 cookies/session
- 会破坏身份验证功能

## 测试验证

### 1. 启动后端服务器
```bash
# 确保后端运行在 http://localhost:8080
python backend/start.py  # 或其他启动命令
```

### 2. 启动前端开发服务器
```bash
npm run dev
```

### 3. 验证请求
打开浏览器开发者工具 → Network 标签页：
- 请求 URL 应该是：`http://localhost:5173/api/config`
- 不应该看到 CORS 错误
- 响应应该正常返回

### 4. 检查代理日志
Vite 会在控制台显示代理请求：
```
http://localhost:5173/api/config -> http://localhost:8080/api/config
```

## 故障排查

### 问题：代理不工作

1. **检查 Vite 配置语法**
   ```bash
   # 检查 vite.config.ts 是否有语法错误
   npx tsc vite.config.ts --noEmit
   ```

2. **重启开发服务器**
   ```bash
   # 停止服务器（Ctrl+C）
   # 清除缓存
   Remove-Item -Recurse -Force node_modules\.vite
   # 重启
   npm run dev
   ```

3. **检查后端是否运行**
   ```bash
   # 测试后端是否可访问
   curl http://localhost:8080/api/config
   ```

### 问题：WebSocket 连接失败

如果 Socket.io 连接失败，检查代理配置是否包含 `ws: true`：

```typescript
server: {
	proxy: {
		'/api': {
			target: 'http://localhost:8080',
			changeOrigin: true,
			ws: true  // ✅ 必须启用 WebSocket 支持
		}
	}
}
```

### 问题：请求超时

增加代理超时时间：

```typescript
server: {
	proxy: {
		'/api': {
			target: 'http://localhost:8080',
			changeOrigin: true,
			timeout: 30000  // 30 秒超时
		}
	}
}
```

## 总结

✅ **已完成修复**
- 在 `vite.config.ts` 中添加了 `/api` 代理配置
- 修改 `src/lib/constants.ts` 使用相对路径
- 开发模式下所有 API 请求通过 Vite 代理转发
- 避免了 CORS 跨域问题

**下一步：**
重启开发服务器，验证 API 请求正常工作。

```bash
npm run dev
```
