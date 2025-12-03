<script lang="ts">
	import { onMount } from 'svelte';
	import {
		systemLinks,
		loadUserLinks,
		saveUserLinks as saveToStorage,
		type Link
	} from '../rianlon-links-config';

	// 接收布局模式 prop
	export let layoutMode: 'simple' | 'full' = 'simple';

	// 简洁模式下需要隐藏的链接 ID
	const HIDDEN_IN_SIMPLE_MODE = ['models', 'prompts', 'knowledge', 'tools'];

	let userLinks: Link[] = [];
	let allLinks: Link[] = [];
	let showAddDialog = false;
	let newLink = { title: '', url: '', icon: '🔗' };

	// 从localStorage加载用户自定义链接
	onMount(() => {
		userLinks = loadUserLinks();
		updateAllLinks();
	});

	function updateAllLinks() {
		allLinks = [...systemLinks, ...userLinks];
	}

	// 根据布局模式过滤链接
	$: visibleLinks =
		layoutMode === 'simple'
			? allLinks.filter((link) => !HIDDEN_IN_SIMPLE_MODE.includes(link.id))
			: allLinks;

	function saveUserLinks() {
		saveToStorage(userLinks);
		updateAllLinks();
	}

	function addLink() {
		if (!newLink.title || !newLink.url) return;

		const link: Link = {
			id: `user-${Date.now()}`,
			title: newLink.title,
			url: newLink.url,
			icon: newLink.icon || '🔗',
			isSystem: false
		};

		userLinks = [...userLinks, link];
		saveUserLinks();

		// 重置表单
		newLink = { title: '', url: '', icon: '🔗' };
		showAddDialog = false;
	}

	function deleteLink(id: string) {
		userLinks = userLinks.filter((l) => l.id !== id);
		saveUserLinks();
	}

	function openAddDialog() {
		showAddDialog = true;
	}

	function closeAddDialog() {
		showAddDialog = false;
		newLink = { title: '', url: '', icon: '🔗' };
	}
</script>

<div class="welcome-links-section">
	<div class="links-grid-inline">
		{#each visibleLinks as link, i (link.id)}
			<a href={link.url} class="link-card" style="--index: {i}">
				<div class="link-icon">
					{#if link.icon.startsWith('data:image/') || link.icon.startsWith('http')}
						<img src={link.icon} alt={link.title} style="width: 18px; height: 18px;" />
					{:else}
						{link.icon}
					{/if}
				</div>
				<div class="link-title">{link.title}</div>
				{#if !link.isSystem}
					<button
						class="delete-link-btn"
						on:click|preventDefault|stopPropagation={() => deleteLink(link.id)}
						aria-label="删除链接"
					>
						✕
					</button>
				{/if}
			</a>
		{/each}

		<button
			class="add-link-btn"
			on:click={openAddDialog}
			aria-label="添加新链接"
			style="--index: {allLinks.length}"
		>
			+
		</button>
	</div>
</div>

<!-- 添加链接对话框 -->
{#if showAddDialog}
	<div class="dialog-overlay" on:click={closeAddDialog}>
		<div class="dialog-content" on:click|stopPropagation>
			<h3 class="dialog-title">添加快速链接</h3>

			<div class="dialog-form">
				<div class="form-group">
					<label for="link-title">标题</label>
					<input
						id="link-title"
						type="text"
						bind:value={newLink.title}
						placeholder="例如：合同助手"
						maxlength="10"
					/>
				</div>

				<div class="form-group">
					<label for="link-url">链接地址</label>
					<input
						id="link-url"
						type="text"
						bind:value={newLink.url}
						placeholder="例如：/workspace/documents"
					/>
				</div>

				<div class="form-group">
					<label for="link-icon">图标（Emoji）</label>
					<input
						id="link-icon"
						type="text"
						bind:value={newLink.icon}
						placeholder="🔗"
						maxlength="2"
					/>
				</div>
			</div>

			<div class="dialog-actions">
				<button class="btn-cancel" on:click={closeAddDialog}>取消</button>
				<button class="btn-confirm" on:click={addLink}>添加</button>
			</div>
		</div>
	</div>
{/if}

<style>
	/* 完全参考browser-app的设计风格 */
	.welcome-links-section {
		width: 100%;
		max-width: 720px;
		margin: 0 auto;
		padding: 0;
	}

	.links-grid-inline {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 12px;
		width: 100%;
	}

	/* 链接卡片 - 参考 browser-app 的简洁风格 */
	.link-card {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 6px 16px;
		min-height: 24px;
		background: rgba(243, 244, 246, 0.6);
		border: 1px solid rgba(209, 213, 219, 0.3);
		border-radius: 18px;
		text-decoration: none;
		transition: all 0.2s ease;
		cursor: pointer;
		white-space: nowrap;
		font-size: 14px;
		color: #374151;
	}

	.link-card:hover {
		transform: translateY(-2px);
		background: rgba(255, 255, 255, 0.9);
		border-color: rgba(99, 102, 241, 0.4);
		box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1);
	}

	:global(.dark) .link-card {
		background: rgba(55, 65, 81, 0.4);
		border-color: rgba(75, 85, 99, 0.3);
		color: rgba(229, 231, 235, 0.9);
	}

	:global(.dark) .link-card:hover {
		background: rgba(75, 85, 99, 0.6);
		border-color: rgba(139, 92, 246, 0.4);
		box-shadow: 0 2px 8px rgba(139, 92, 246, 0.15);
	}

	.link-card:hover .delete-link-btn {
		opacity: 1;
		pointer-events: auto;
	}

	.link-icon {
		font-size: 18px;
		line-height: 1;
		flex-shrink: 0;
		transition: transform 0.2s ease;
	}

	.link-card:hover .link-icon {
		transform: scale(1.1);
	}

	.link-title {
		font-size: 14px;
		font-weight: 500;
		transition: color 0.2s ease;
	}

	/* 删除按钮 - 简化版 */
	.delete-link-btn {
		margin-left: 4px;
		padding: 2px 4px;
		background: transparent;
		border: none;
		color: rgba(107, 114, 128, 0.5);
		cursor: pointer;
		border-radius: 4px;
		transition: all 0.2s ease;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		opacity: 0;
		pointer-events: none;
	}

	.delete-link-btn:hover {
		background: rgba(239, 68, 68, 0.1);
		color: #EF4444;
	}

	:global(.dark) .delete-link-btn:hover {
		background: rgba(239, 68, 68, 0.2);
		color: #F87171;
	}

	/* 添加按钮 - 简化版 */
	.add-link-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 36px;
		min-height: 36px;
		padding: 6px;
		border-radius: 18px;
		background: rgba(243, 244, 246, 0.6);
		color: rgba(107, 114, 128, 0.8);
		border: 1px solid rgba(209, 213, 219, 0.3);
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 20px;
		font-weight: 300;
	}

	.add-link-btn:hover {
		background: rgba(255, 255, 255, 0.9);
		color: #6366F1;
		border-color: rgba(99, 102, 241, 0.4);
		transform: translateY(-2px) rotate(90deg);
		box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1);
	}

	:global(.dark) .add-link-btn {
		background: rgba(55, 65, 81, 0.4);
		border-color: rgba(75, 85, 99, 0.3);
		color: rgba(156, 163, 175, 0.8);
	}

	:global(.dark) .add-link-btn:hover {
		background: rgba(75, 85, 99, 0.6);
		border-color: rgba(139, 92, 246, 0.4);
		color: #A78BFA;
		box-shadow: 0 2px 8px rgba(139, 92, 246, 0.15);
	}

	/* 对话框样式 - 简化版 */
	.dialog-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 16px;
		backdrop-filter: blur(4px);
	}

	.dialog-content {
		background: white;
		border-radius: 16px;
		padding: 24px;
		width: 100%;
		max-width: 420px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
		border: 1px solid rgba(0, 0, 0, 0.05);
	}

	:global(.dark) .dialog-content {
		background: #1f2937;
		border-color: rgba(255, 255, 255, 0.05);
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
	}

	.dialog-title {
		font-size: 18px;
		font-weight: 600;
		margin: 0 0 20px 0;
		color: #111827;
	}

	:global(.dark) .dialog-title {
		color: #f9fafb;
	}

	.dialog-form {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.form-group label {
		font-size: 13px;
		font-weight: 500;
		color: #6b7280;
	}

	:global(.dark) .form-group label {
		color: #9ca3af;
	}

	.form-group input {
		height: 40px;
		padding: 0 12px;
		background: #f9fafb;
		border: 1px solid #d1d5db;
		border-radius: 8px;
		color: #111827;
		font-size: 14px;
		transition: all 0.2s ease;
	}

	:global(.dark) .form-group input {
		background: #374151;
		border-color: #4b5563;
		color: #f9fafb;
	}

	.form-group input:focus {
		outline: none;
		border-color: #6366f1;
		box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
	}

	:global(.dark) .form-group input:focus {
		border-color: #8b5cf6;
		box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
	}

	.dialog-actions {
		display: flex;
		gap: 10px;
		margin-top: 20px;
		justify-content: flex-end;
	}

	.btn-cancel,
	.btn-confirm {
		height: 38px;
		padding: 0 20px;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-cancel {
		background: #f3f4f6;
		border: 1px solid #d1d5db;
		color: #6b7280;
	}

	:global(.dark) .btn-cancel {
		background: #374151;
		border-color: #4b5563;
		color: #9ca3af;
	}

	.btn-cancel:hover {
		background: #e5e7eb;
		color: #374151;
	}

	:global(.dark) .btn-cancel:hover {
		background: #4b5563;
		color: #d1d5db;
	}

	.btn-confirm {
		background: #6366f1;
		border: none;
		color: white;
	}

	.btn-confirm:hover {
		background: #4f46e5;
	}

	:global(.dark) .btn-confirm {
		background: #8b5cf6;
	}

	:global(.dark) .btn-confirm:hover {
		background: #7c3aed;
	}

	/* 移动端响应式 */
	@media (max-width: 768px) {
		.link-card {
			font-size: 13px;
			padding: 4px 12px;
			min-height: 32px;
		}

		.link-icon {
			font-size: 16px;
		}

		.dialog-content {
			padding: 20px;
			max-width: 90%;
		}
	}
</style>
