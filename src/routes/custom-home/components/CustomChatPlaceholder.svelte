<script lang="ts">
	import { WEBUI_BASE_URL } from '$lib/constants';
	import { marked } from 'marked';

	import { config, user, models as _models, temporaryChatEnabled } from '$lib/stores';
	import { onMount, getContext } from 'svelte';

	import { blur, fade } from 'svelte/transition';

	import Suggestions from '$lib/components/chat/Suggestions.svelte';
	import { sanitizeResponseContent } from '$lib/utils';
	import Tooltip from '$lib/components/common/Tooltip.svelte';
	import EyeSlash from '$lib/components/icons/EyeSlash.svelte';

	const i18n = getContext('i18n');

	export let modelIds = [];
	export let models = [];
	export let atSelectedModel;

	export let onSelect = (e) => {};

	let mounted = false;
	let selectedModelIdx = 0;

	$: if (modelIds.length > 0) {
		selectedModelIdx = models.length - 1;
	}

	$: models = modelIds.map((id) => $_models.find((m) => m.id === id));

	onMount(() => {
		mounted = true;
	});
</script>

{#key mounted}
	<div class="m-auto w-full max-w-6xl px-8 lg:px-20">
		<div class="flex justify-start">
			<div class="flex -space-x-4 mb-0.5" in:fade={{ duration: 200 }}>
				{#each models as model, modelIdx}
					<button
						on:click={() => {
							selectedModelIdx = modelIdx;
						}}
					>
						<Tooltip
							content={marked.parse(
								sanitizeResponseContent(
									models[selectedModelIdx]?.info?.meta?.description ?? ''
								).replaceAll('\n', '<br>')
							)}
							placement="right"
						>
							<!-- 自定义Logo SVG -->
							<div class="size-[2.7rem] rounded-full border-[1px] border-gray-100 dark:border-none bg-white dark:bg-gray-800 flex items-center justify-center">
								<svg width="65%" height="65%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
									<path d="M69.9533 48.4953V37.5018C69.9533 36.3754 69.761 35.1698 69.3764 33.9166C69.0078 32.6792 68.495 31.7274 67.8539 31.0611C66.9404 30.0934 65.7866 29.4589 64.4084 29.1575C62.9981 28.8402 61.091 28.6815 58.7192 28.6815C57.2608 28.6815 55.8826 28.8085 54.6486 29.0781C53.4146 29.332 52.453 29.6968 51.7479 30.1569C50.7703 30.8073 50.0171 31.5687 49.5203 32.4412C49.0395 33.2503 48.6549 34.3608 48.3825 35.7568L55.3698 36.6451C55.6903 35.6298 56.1069 34.9477 56.6358 34.5511C57.3409 33.9959 58.3986 33.7262 59.7769 33.7262C60.8827 33.7262 61.7 34.0117 62.1647 34.5511C62.6295 35.0746 62.8538 35.963 62.8538 37.2321V37.4383L62.6615 37.5335C61.6679 38.0094 60.6904 38.3901 59.7929 38.6757C58.8955 38.9612 56.9403 39.4847 53.9595 40.1986C51.5556 40.7697 49.9049 41.6422 49.0235 42.7844C48.1421 43.9266 47.6934 45.4177 47.6934 47.2262C47.6934 49.1457 48.3184 50.7638 49.5363 52.0646C50.7543 53.3654 52.5652 54.0159 54.921 54.0159C56.732 54.0159 58.3185 53.6827 59.6807 53.0164C60.6583 52.5247 61.6679 51.6839 62.6776 50.5258L63.1744 49.9548L63.2705 50.7162C63.3506 51.4301 63.4468 51.9377 63.543 52.255C63.6231 52.5247 63.7834 52.9371 64.0237 53.4765H70.7867C70.4501 52.6199 70.2418 51.906 70.1456 51.3349C70.0174 50.6528 69.9533 49.7327 69.9533 48.527V48.4953ZM62.8378 43.5458C62.8378 44.7673 62.6615 45.7667 62.325 46.5441C61.9884 47.3372 61.3955 48.0194 60.5782 48.5588C59.7769 49.114 58.8794 49.3837 57.9179 49.3837C56.9563 49.3837 56.2352 49.114 55.7384 48.5746C55.2415 48.0511 55.0012 47.3531 55.0012 46.5282C55.0012 45.7985 55.2576 45.1322 55.7544 44.5611C56.2352 44.0059 57.2929 43.4824 58.9916 42.943C60.1294 42.6099 61.2673 42.1974 62.3891 41.7374L62.8699 41.547V43.5617L62.8378 43.5458Z" fill="#006941"/>
								</svg>
							</div>
						</Tooltip>
					</button>
				{/each}
			</div>
		</div>

		{#if $temporaryChatEnabled}
			<Tooltip
				content={$i18n.t("This chat won't appear in history and your messages will not be saved.")}
				className="w-full flex justify-start mb-0.5"
				placement="top"
			>
				<div class="flex items-center gap-2 text-gray-500 text-lg mt-2 w-fit">
					<EyeSlash strokeWidth="2.5" className="size-5" />{$i18n.t('Temporary Chat')}
				</div>
			</Tooltip>
		{/if}

		<div
			class=" mt-2 mb-4 text-3xl text-gray-800 dark:text-gray-100 text-left flex items-center gap-4 font-primary"
		>
			<div>
				<div class=" capitalize line-clamp-1" in:fade={{ duration: 200 }}>
					{#if models[selectedModelIdx]?.name}
						{models[selectedModelIdx]?.name}
					{:else}
						{$i18n.t('Hello, {{name}}', { name: $user?.name })}
					{/if}
				</div>

				<div in:fade={{ duration: 200, delay: 200 }}>
					{#if models[selectedModelIdx]?.info?.meta?.description ?? null}
						<div
							class="mt-0.5 text-base font-normal text-gray-500 dark:text-gray-400 line-clamp-3 markdown"
						>
							{@html marked.parse(
								sanitizeResponseContent(
									models[selectedModelIdx]?.info?.meta?.description ?? ''
								).replaceAll('\n', '<br>')
							)}
						</div>
					{:else}
						<div class="mt-0.5 text-base font-normal text-gray-500 dark:text-gray-400">
							{$i18n.t('How can I help you today?')}
						</div>
					{/if}
				</div>
			</div>
		</div>

		<Suggestions
			{models}
			modelId={models[selectedModelIdx]?.id}
			promptSuggestions={models[selectedModelIdx]?.info?.meta?.suggestion_prompts}
			{onSelect}
		/>
	</div>
{/key}
