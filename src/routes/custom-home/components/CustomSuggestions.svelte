<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte';
	import Bolt from '$lib/components/icons/Bolt.svelte';
	import { settings, WEBUI_NAME } from '$lib/stores';
	import { WEBUI_VERSION } from '$lib/constants';

	const i18n = getContext('i18n');

	export let suggestionPrompts = [];
	export let onSelect = (e) => {};

	let currentIndex = 0;
	let intervalId: any;
	let isAnimating = false;

	$: sortedPrompts = [...(suggestionPrompts ?? [])].sort(() => Math.random() - 0.5);
	$: currentPrompt = sortedPrompts[currentIndex];

	onMount(() => {
		// 每5秒切换一次建议
		intervalId = setInterval(() => {
			if (sortedPrompts.length > 1) {
				isAnimating = true;
				setTimeout(() => {
					currentIndex = (currentIndex + 1) % sortedPrompts.length;
					isAnimating = false;
				}, 300); // 动画时长
			}
		}, 5000);
	});

	onDestroy(() => {
		if (intervalId) {
			clearInterval(intervalId);
		}
	});
</script>

<div class="mb-1 flex gap-1 text-xs font-medium items-center text-gray-600 dark:text-gray-400">
	{#if sortedPrompts.length > 0}
		<Bolt />
		{$i18n.t('Suggested')}
		{#if sortedPrompts.length > 1}
			<span class="text-gray-400 dark:text-gray-500">
				({currentIndex + 1}/{sortedPrompts.length})
			</span>
		{/if}
	{:else}
		<div
			class="flex w-full {$settings?.landingPageMode === 'chat'
				? ' -mt-1'
				: 'text-center items-center justify-center'}  self-start text-gray-600 dark:text-gray-400"
		>
			{$WEBUI_NAME} ‧ v{WEBUI_VERSION}
		</div>
	{/if}
</div>

<div class="h-auto w-full">
	{#if currentPrompt}
		<div class="suggestion-container">
			<button
				class="suggestion-item {isAnimating ? 'fade-out' : 'fade-in'}"
				on:click={() => onSelect({ type: 'prompt', data: currentPrompt.content })}
			>
				<div class="flex flex-col text-left w-full">
					{#if currentPrompt.title && currentPrompt.title[0] !== ''}
						<div
							class="font-medium dark:text-gray-300 dark:group-hover:text-gray-200 transition line-clamp-1"
						>
							{currentPrompt.title[0]}
						</div>
						<div class="text-xs text-gray-600 dark:text-gray-400 font-normal line-clamp-1">
							{currentPrompt.title[1]}
						</div>
					{:else}
						<div
							class="font-medium dark:text-gray-300 dark:group-hover:text-gray-200 transition line-clamp-1"
						>
							{currentPrompt.content}
						</div>
						<div class="text-xs text-gray-600 dark:text-gray-400 font-normal line-clamp-1">
							{$i18n.t('Prompt')}
						</div>
					{/if}
				</div>
			</button>
		</div>
	{/if}
</div>

<style>
	.suggestion-container {
		position: relative;
		min-height: 60px;
	}

	.suggestion-item {
		width: 100%;
		padding: 0.75rem;
		border-radius: 0.75rem;
		background: transparent;
		transition: all 0.3s ease;
		cursor: pointer;
		border: none;
		text-align: left;
	}

	.suggestion-item:hover {
		background: rgba(0, 0, 0, 0.05);
	}

	:global(.dark) .suggestion-item:hover {
		background: rgba(255, 255, 255, 0.05);
	}

	/* 淡入淡出动画 */
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes fadeOut {
		from {
			opacity: 1;
			transform: translateY(0);
		}
		to {
			opacity: 0;
			transform: translateY(-10px);
		}
	}

	.fade-in {
		animation: fadeIn 0.3s ease forwards;
	}

	.fade-out {
		animation: fadeOut 0.3s ease forwards;
	}
</style>
