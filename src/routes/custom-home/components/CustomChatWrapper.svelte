<script lang="ts">
	import Chat from '$lib/components/chat/Chat.svelte';
	import { Marquee } from '@selemondev/svelte-marquee';
	// 注意：不导入 svelte-marquee 的全局 CSS，避免与 Tailwind 类名冲突
	// import '@selemondev/svelte-marquee/dist/style.css';
	import { onMount, tick, afterUpdate } from 'svelte';

	// 接收布局模式 prop
	export let layoutMode: 'simple' | 'full' = 'simple';

	let suggestions: string[] = [];
	let marqueeComponent: any;
	let targetContainer: HTMLElement | null = null;
	let isMarqueeVisible: boolean = true; // 控制跑马灯显示/隐藏状态
	let marqueeWrapperElement: HTMLElement | null = null;

	// 响应式更新：简洁模式下强制隐藏跑马灯
	$: effectiveMarqueeVisible = layoutMode === 'full' && isMarqueeVisible;

	// 响应式更新：当 effectiveMarqueeVisible 改变时，更新 marquee wrapper 的显示状态
	$: if (marqueeWrapperElement && effectiveMarqueeVisible !== undefined) {
		marqueeWrapperElement.style.display = effectiveMarqueeVisible ? 'flex' : 'none';
		console.log('Marquee visibility changed:', effectiveMarqueeVisible, 'layoutMode:', layoutMode);
	}

	onMount(() => {
		// 延迟获取建议列表，确保 Chat 组件已渲染
		setTimeout(async () => {
			const suggestionsContainer = document.querySelector('.max-h-40.overflow-auto');
			if (suggestionsContainer) {
				const buttons = suggestionsContainer.querySelectorAll('button[role="listitem"]');
				suggestions = Array.from(buttons).map(btn => (btn as HTMLElement).textContent?.trim() || '');

				// 隐藏原始的建议按钮列表
				if (suggestions.length > 0) {
					(suggestionsContainer as HTMLElement).style.display = 'none';
				}
			}

			// 等待 Svelte 更新 DOM
			await tick();

			// 再延迟一下确保跑马灯元素已经渲染
			setTimeout(() => {
				// 找到 h-40 w-full 容器
				targetContainer = document.querySelector('.h-40.w-full') as HTMLElement;
				const marqueeWrapper = document.querySelector('.marquee-wrapper') as HTMLElement;

				console.log('Target container:', targetContainer);
				console.log('Marquee wrapper:', marqueeWrapper);
				console.log('Suggestions:', suggestions);

				// 如果找到容器且有建议，将跑马灯插入其中
				if (targetContainer && marqueeWrapper && suggestions.length > 0) {
					// 保存引用
					marqueeWrapperElement = marqueeWrapper;

					// 设置初始显示状态
					marqueeWrapper.style.display = isMarqueeVisible ? 'flex' : 'none';

					targetContainer.appendChild(marqueeWrapper);
					console.log('Marquee appended to container, initial visibility:', isMarqueeVisible);
				}
			}, 200);
		}, 500);
	});
</script>

<div class="custom-chat-container">
	<Chat
		showMarqueeToggle={layoutMode === 'full' && suggestions.length > 0}
		isMarqueeVisible={effectiveMarqueeVisible}
		toggleMarquee={() => isMarqueeVisible = !isMarqueeVisible}
	/>

	{#if suggestions.length > 0}
		<div class="marquee-wrapper">
			<Marquee
				bind:this={marqueeComponent}
				direction="up"
				pauseOnHover={true}
				innerClassName="marquee-inner"
				duration={30}
				reverse={false}
			>
				{#each suggestions as suggestion}
					<button
						class="suggestion-card"
						on:click={() => {
							// 触发原始建议按钮的点击事件
							const container = document.querySelector('.max-h-40.overflow-auto');
							const buttons = container?.querySelectorAll('button[role="listitem"]');
							const index = suggestions.indexOf(suggestion);
							if (buttons && buttons[index]) {
								(buttons[index] as HTMLElement).click();
							}
						}}
					>
						{suggestion}
					</button>
				{/each}
			</Marquee>
		</div>
	{/if}
</div>

<style>
	/* ===== Marquee 动画样式 (从 svelte-marquee 复制) ===== */
	/* 只在这个组件内定义，避免全局污染 */
	@keyframes marquee-up {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(calc(-100% - var(--gap, 1rem)));
		}
	}

	:global(.animate-marquee-up) {
		animation: marquee-up var(--duration, 40s) linear infinite;
	}

	/* Marquee 组件需要的基础样式 - 限定在 custom-chat-container 内 */
	.custom-chat-container :global(.flex) {
		display: flex;
	}

	.custom-chat-container :global(.flex-col) {
		flex-direction: column;
	}

	.custom-chat-container :global(.shrink-0) {
		flex-shrink: 0;
	}

	.custom-chat-container :global(.overflow-hidden) {
		overflow: hidden;
	}

	.custom-chat-container :global(.gap-\[1rem\]) {
		gap: 1rem;
	}

	.custom-chat-container :global(.\[--gap\:1rem\]) {
		--gap: 1rem;
	}

	@media (hover: hover) {
		.custom-chat-container :global(.group-hover\:\[animation-play-state\:paused\]:is(:where(.group):hover *)) {
			animation-play-state: paused;
		}
	}

	/* ===== 组件样式 ===== */
	.custom-chat-container {
		width: 100%;
		height: 100%;
		position: relative;
	}

	/* 隐藏原有的建议列表容器 */
	.custom-chat-container :global(.max-h-40.overflow-auto) {
		display: none !important;
	}

	/* 修改 h-40 容器样式 */
	.custom-chat-container :global(.h-40.w-full) {
		display: flex !important;
		align-items: center !important;
		justify-content: center !important;
		overflow: visible !important; /* 改为 visible 以便看到内容 */
	}

	/* Marquee 包装器 */
	.marquee-wrapper {
		width: 100%;
		max-width: 600px;
		height: 160px; /* 固定高度，h-40 = 10rem = 160px */
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		animation: slideDown 0.3s ease-out;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Marquee 内部容器 */
	:global(.marquee-inner) {
		gap: 12px !important;
		align-items: center !important;
		flex-direction: column !important;
	}

	/* 建议卡片样式 */
	.suggestion-card {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		white-space: nowrap;
		padding: 10px 24px;
		border-radius: 16px;
		background: linear-gradient(135deg, rgba(250, 251, 252, 0.95), rgba(248, 249, 250, 0.98));
		border: 1px solid rgba(0, 0, 0, 0.06);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
		transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		font-size: 14px;
		color: #333;
		font-weight: 500;
		margin-bottom: 12px;
		width: auto;
		min-width: 200px;
		max-width: 100%;
		height: 44px;
		flex-shrink: 0;
	}

	.suggestion-card:hover {
		background: linear-gradient(135deg, rgba(66, 133, 244, 0.12), rgba(139, 92, 246, 0.1));
		border-color: rgba(66, 133, 244, 0.25);
		box-shadow: 0 4px 12px rgba(66, 133, 244, 0.2);
		transform: translateY(-2px);
	}

	/* 暗色模式下的建议卡片 */
	:global(.dark) .suggestion-card {
		background: linear-gradient(135deg, rgba(47, 47, 47, 0.9), rgba(60, 60, 60, 0.85));
		border-color: rgba(255, 255, 255, 0.08);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
		color: #e0e0e0;
	}

	:global(.dark) .suggestion-card:hover {
		background: linear-gradient(135deg, rgba(138, 180, 248, 0.15), rgba(167, 139, 250, 0.12));
		border-color: rgba(138, 180, 248, 0.25);
		box-shadow: 0 4px 12px rgba(138, 180, 248, 0.2);
	}
</style>
