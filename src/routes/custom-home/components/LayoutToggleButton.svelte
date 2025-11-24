<script lang="ts">
	export let layoutMode: 'simple' | 'full' = 'simple';
	export let onToggle: () => void;
</script>

<button
	class="layout-toggle-btn"
	on:click={onToggle}
	title={layoutMode === 'simple' ? '切换到完整模式' : '切换到简洁模式'}
	aria-label={layoutMode === 'simple' ? '切换到完整模式' : '切换到简洁模式'}
>
	{#if layoutMode === 'simple'}
		<!-- 网格图标 (完整模式) - Material Icons: apps -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<rect x="3" y="3" width="7" height="7" />
			<rect x="14" y="3" width="7" height="7" />
			<rect x="14" y="14" width="7" height="7" />
			<rect x="3" y="14" width="7" height="7" />
		</svg>
	{:else}
		<!-- 列表图标 (简洁模式) - Material Icons: view_agenda -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<rect x="3" y="4" width="18" height="7" rx="1" />
			<rect x="3" y="13" width="18" height="7" rx="1" />
		</svg>
	{/if}
</button>

<style>
	.layout-toggle-btn {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: none;
		background: rgba(255, 255, 255, 0.9);
		color: rgba(55, 65, 81, 0.8);
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.layout-toggle-btn:hover {
		background: rgba(255, 255, 255, 1);
		color: rgba(99, 102, 241, 1);
		transform: scale(1.05);
		box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
	}

	.layout-toggle-btn:active {
		transform: scale(0.95);
	}

	/* 深色模式适配 */
	:global(.dark) .layout-toggle-btn {
		background: rgba(55, 65, 81, 0.9);
		color: rgba(229, 231, 235, 0.8);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	:global(.dark) .layout-toggle-btn:hover {
		background: rgba(75, 85, 99, 1);
		color: rgba(139, 92, 246, 1);
		box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
	}
</style>
