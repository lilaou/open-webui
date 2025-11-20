<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { toast } from 'svelte-sonner';
	import CustomChatWrapper from './components/CustomChatWrapper.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import QuickLinks from './components/QuickLinks.svelte';
	import SettingsModal from '$lib/components/chat/SettingsModal.svelte';
	import ChangelogModal from '$lib/components/ChangelogModal.svelte';
	import { page } from '$app/stores';
	import { showSidebar, settings, models, config, chatId, showSettings, showChangelog } from '$lib/stores';
	import { getUserSettings } from '$lib/apis/users';
	import { getModels } from '$lib/apis';

	let settingsLoaded = false;

	// 响应式地检查当前是否应该显示快速链接
	// 方法1：检查路径是否精确匹配 /custom-home
	// 方法2：检查是否有活动的聊天 ID（chatId store）
	// 只有在 custom-home 首页且没有活动聊天时才显示快速链接
	$: showQuickLinks = $page.url.pathname === '/custom-home' && !$chatId;

	onMount(async () => {
		// 进入 custom-home 时设置 data-route 属性
		document.body.setAttribute('data-route', 'custom-home');
		console.log('Custom home mounted');

		// 加载用户设置和模型列表
		try {
			// 先加载用户设置
			const userSettings = await getUserSettings(localStorage.token);
			if (userSettings?.ui) {
				settings.set(userSettings.ui);
				console.log('Loaded user settings:', userSettings.ui);
				console.log('Default models:', userSettings.ui.models);
			}

			// 再加载模型列表
			const modelsList = await getModels(
				localStorage.token,
				$config?.features?.enable_direct_connections ? (userSettings?.ui?.directConnections ?? null) : null
			);
			models.set(modelsList);
			console.log('Loaded models:', modelsList.map(m => m.id));
		} catch (error) {
			console.error('Failed to load user settings or models:', error);
		}

		// 标记设置已加载，允许渲染 Chat 组件
		settingsLoaded = true;

		// 处理URL错误参数（与原主页保持一致）
		if ($page.url.searchParams.get('error')) {
			toast.error($page.url.searchParams.get('error') || 'An unknown error occurred.');
		}
	});

	onDestroy(() => {
		// 离开页面时移除路由标识
		// 注意：全局的 beforeNavigate 也会处理此逻辑，这里作为双重保险
		document.body.removeAttribute('data-route');
		console.log('Custom home unmounted');
	});
</script>

<!-- 全局模态框组件 -->
<SettingsModal bind:show={$showSettings} />
<ChangelogModal bind:show={$showChangelog} />

<div class="custom-home-container with-custom-logo">
	<!-- 左侧边栏 -->
	<Sidebar />

	<!-- 主内容区域 -->
	<div class="main-content {$showSidebar ? 'md:max-w-[calc(100%-260px)]' : ''}">
		{#if settingsLoaded}
			<!-- 聊天界面 -->
			<div class="chat-wrapper" class:with-quick-links={showQuickLinks}>
				<CustomChatWrapper />
			</div>

			<!-- 快速链接区域（在对话框下方） - 仅在 custom-home 首页且未进入聊天时显示 -->
			{#if showQuickLinks}
				<div class="quick-links-wrapper">
					<QuickLinks />
				</div>
			{/if}
		{:else}
			<!-- 加载中提示 -->
			<div class="flex items-center justify-center h-full">
				<div class="text-gray-500 dark:text-gray-400">Loading...</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.custom-home-container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		position: relative;
	}

	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		position: relative;
		min-width: 0;
		transition: max-width 0.2s ease;
		overflow-y: auto; /* 允许垂直滚动 */
	}

	.chat-wrapper {
		flex: 1 1 auto; /* 允许增长和收缩 */
		display: flex;
		flex-direction: column;
		overflow: hidden; /* 防止内容溢出 */
	}

	/* 当显示快速链接时，限制聊天区域高度为快速链接留出空间 */
	.chat-wrapper.with-quick-links {
		min-height: 400px;
		max-height: calc(100vh - 250px);
	}

	/* ===== 快速链接区域样式 ===== */
	/* 使用 :global() 但限定在 custom-home-container 内 */
	.custom-home-container :global(.quick-links-wrapper) {
		width: 100%;
		max-width: 720px;
		margin: 0 auto;
		padding: 24px 16px;
		animation: fadeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
		flex-shrink: 0;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* ===== Logo 替换样式 ===== */
	/* 限定在 custom-home-container 内，不会影响其他页面或模态框 */
	.custom-home-container.with-custom-logo :global(img[src*="favicon.png"]) {
		content: url("data:image/svg+xml,%3Csvg width='208' height='54' viewBox='0 0 208 54' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_1098_21161)'%3E%3Cpath d='M170.837 52.5881C190.18 48.4953 203.466 39.7703 207.36 31.0611C208.001 29.5858 208.049 27.8249 208.017 26.302C207.969 23.97 206.815 21.7174 204.86 19.4965C202.296 16.4824 198.241 13.4841 192.872 10.9459C176.077 3.28379 147.631 -0.713862 116.173 0.111049C79.2649 1.76087 56.4761 11.3425 45.5625 20.1786C53.9601 15.4036 64.6814 11.6281 78.7361 8.64571C89.9222 6.31375 103.272 4.96534 119.073 4.52116C137.599 4.02938 157.535 6.86898 172.68 11.2474C187.087 15.4354 195.356 22.3678 196.639 27.3966C199.363 38.0253 186.767 47.6863 170.821 52.5881H170.837Z' fill='%23007DB7'/%3E%3Cpath d='M161.077 28.6974C159.65 28.6974 158.384 29.0781 157.279 29.8237C156.093 30.5535 155.243 31.4736 154.682 32.6633L154.025 32.5206L153.961 29.3478H146.766C146.83 30.379 146.894 31.4101 146.958 32.1716C147.038 33.0123 147.038 33.7579 147.038 34.3608V53.4606H154.105V39.4371C154.105 37.8032 154.474 36.3596 155.147 35.376C155.82 34.3766 156.75 33.8848 157.984 33.8848C159.346 33.8848 160.275 34.4242 160.772 35.4871C161.253 36.4389 161.477 38.2791 161.477 41.1345V53.4448H168.609V37.708C168.609 34.7256 167.968 32.5047 166.654 30.9342C165.34 29.4113 163.513 28.6815 161.061 28.6815L161.077 28.6974Z' fill='%23006941'/%3E%3Cpath d='M28.1415 39.1516C27.6286 36.9783 26.8273 35.4078 25.7696 34.5035C24.6959 33.5834 23.1093 33.0917 21.1702 33.0917H20.8337V32.235L21.1221 32.1874C23.8145 31.7591 25.8337 30.6962 27.3081 28.9512C28.7504 27.2221 29.4716 24.906 29.4716 22.0188C29.4716 18.4177 28.3818 15.8002 26.1382 14.0235C24.0549 12.3261 20.8337 11.4219 16.5708 11.3425H0V53.4765H9.31104V36.9465H13.5739C14.8881 36.9465 15.9297 37.1845 16.7471 37.6604C16.9394 37.7556 17.0996 37.9142 17.2759 38.0887C18.1093 38.8502 18.6541 40.0558 18.8945 41.7056L18.9266 41.9277C19.0227 42.6733 19.215 44.228 19.4234 46.6392C19.7118 49.1774 20.0003 51.4777 20.2888 53.4606H30.4652C29.8883 50.8907 29.3915 48.0035 29.0549 45.0687C28.6543 42.0546 28.3177 39.8813 28.1575 39.1357L28.1415 39.1516ZM18.7022 28.4595C18.1894 28.9512 17.5323 29.2685 16.6669 29.4271C15.8817 29.6334 14.9522 29.7286 13.6541 29.7286H9.32707V18.7033H13.8784C15.0804 18.7033 15.9458 18.7985 16.6669 19.0047C17.5323 19.1792 18.2214 19.5123 18.7022 19.9724C19.6638 20.7656 20.1606 22.1933 20.1606 24.0969C20.1606 26.1592 19.6638 27.6345 18.7022 28.4436V28.4595Z' fill='%23006941'/%3E%3Cpath d='M42.5651 29.3637H35.5137V53.4765H42.5651V29.3637Z' fill='%23006941'/%3E%3Cpath d='M90.8983 28.6974C89.488 28.6974 88.2059 29.0781 87.1001 29.8237C85.9302 30.5376 85.0809 31.4736 84.4238 32.6792L83.8148 33.8373L83.7187 29.3637H76.5391C76.6192 30.0776 76.6673 30.728 76.7314 31.3308C76.7634 31.6481 76.7795 31.9336 76.8115 32.1874V32.2192C76.8115 32.6475 76.8275 33.0599 76.8436 33.4407C76.8596 33.7738 76.8756 34.0911 76.8756 34.3608V53.4606H83.927V39.4371C83.927 37.708 84.2635 36.312 84.8886 35.376C85.5296 34.4083 86.5392 33.8848 87.7251 33.8848C89.0713 33.8848 90.0168 34.4242 90.5136 35.4712C91.0585 36.4072 91.2989 38.2156 91.2989 41.1504V53.4606H98.3503V37.7239C98.3503 34.6939 97.7413 32.473 96.4753 30.9501C95.1772 29.4589 93.2861 28.6974 90.8662 28.6974H90.8983Z' fill='%23006941'/%3E%3Cpath d='M112.374 18.9412H105.307V53.8572H112.374V18.9412Z' fill='%23006941'/%3E%3Cpath d='M129.937 28.6181C126.139 28.6181 123.19 29.7127 121.155 31.8701C119.168 34.1228 118.158 37.3114 118.158 41.309C118.158 45.3067 119.168 48.5112 121.171 50.7638C123.19 52.9054 126.139 54 129.937 54C133.735 54 136.572 52.9371 138.639 50.7479C140.675 48.5905 141.7 45.4177 141.7 41.309C141.7 37.2004 140.691 34.1228 138.639 31.8701C136.588 29.6968 133.735 28.6181 129.937 28.6181ZM133.815 46.8772C133.014 48.067 131.748 48.6539 129.937 48.6539C128.126 48.6539 126.844 48.067 126.043 46.8613C125.226 45.6557 124.857 43.8948 124.857 41.309C124.857 38.7233 125.242 36.9465 126.043 35.7568C126.844 34.567 128.158 33.98 129.937 33.98C131.716 33.98 132.982 34.5987 133.815 35.7568C134.585 36.8989 134.937 38.6598 134.937 41.309C134.937 43.9583 134.585 45.8143 133.815 46.8772Z' fill='%23007DB7'/%3E%3Cpath d='M39.0077 25.1915C40.9308 25.1915 42.5013 23.6369 42.5013 21.7333C42.5013 19.8296 40.8987 18.3543 39.0077 18.3543C37.1166 18.3543 35.5781 19.9089 35.5781 21.7333C35.5781 23.5576 37.1487 25.1915 39.0077 25.1915Z' fill='%23007DB7'/%3E%3Cpath d='M69.9533 48.4953V37.5018C69.9533 36.3754 69.761 35.1698 69.3764 33.9166C69.0078 32.6792 68.495 31.7274 67.8539 31.0611C66.9404 30.0934 65.7866 29.4589 64.4084 29.1575C62.9981 28.8402 61.091 28.6815 58.7192 28.6815C57.2608 28.6815 55.8826 28.8085 54.6486 29.0781C53.4146 29.332 52.453 29.6968 51.7479 30.1569C50.7703 30.8073 50.0171 31.5687 49.5203 32.4412C49.0395 33.2503 48.6549 34.3608 48.3825 35.7568L55.3698 36.6451C55.6903 35.6298 56.1069 34.9477 56.6358 34.5511C57.3409 33.9959 58.3986 33.7262 59.7769 33.7262C60.8827 33.7262 61.7 34.0117 62.1647 34.5511C62.6295 35.0746 62.8538 35.963 62.8538 37.2321V37.4383L62.6615 37.5335C61.6679 38.0094 60.6904 38.3901 59.7929 38.6757C58.8955 38.9612 56.9403 39.4847 53.9595 40.1986C51.5556 40.7697 49.9049 41.6422 49.0235 42.7844C48.1421 43.9266 47.6934 45.4177 47.6934 47.2262C47.6934 49.1457 48.3184 50.7638 49.5363 52.0646C50.7543 53.3654 52.5652 54.0159 54.921 54.0159C56.732 54.0159 58.3185 53.6827 59.6807 53.0164C60.6583 52.5247 61.6679 51.6839 62.6776 50.5258L63.1744 49.9548L63.2705 50.7162C63.3506 51.4301 63.4468 51.9377 63.543 52.255C63.6231 52.5247 63.7834 52.9371 64.0237 53.4765H70.7867C70.4501 52.6199 70.2418 51.906 70.1456 51.3349C70.0174 50.6528 69.9533 49.7327 69.9533 48.527V48.4953ZM62.8378 43.5458C62.8378 44.7673 62.6615 45.7667 62.325 46.5441C61.9884 47.3372 61.3955 48.0194 60.5782 48.5588C59.7769 49.114 58.8794 49.3837 57.9179 49.3837C56.9563 49.3837 56.2352 49.114 55.7384 48.5746C55.2415 48.0511 55.0012 47.3531 55.0012 46.5282C55.0012 45.7985 55.2576 45.1322 55.7544 44.5611C56.2352 44.0059 57.2929 43.4824 58.9916 42.943C60.1294 42.6099 61.2673 42.1974 62.3891 41.7374L62.8699 41.547V43.5617L62.8378 43.5458Z' fill='%23006941'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_1098_21161'%3E%3Crect width='208' height='54' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E") !important;
		width: auto !important;
		height: auto !important;
		max-width: 160px !important;
		min-width: 100px !important;
		border-radius: 0 !important;
		border: none !important;
	}

	/* 改变布局：logo在上，文字在下 - 只在custom-home-container内生效 */
	.custom-home-container .main-content .chat-wrapper :global(.flex.flex-row.justify-center) {
		flex-direction: column !important;
		align-items: center !important;
		gap: 0.5rem !important;
	}

	.custom-home-container .main-content .chat-wrapper :global(.flex.shrink-0.justify-center) {
		margin-bottom: 0.5rem !important;
		width: 100% !important;
	}

	.custom-home-container .main-content .chat-wrapper :global(.flex.-space-x-4) {
		justify-content: center !important;
		margin-left: 0 !important;
		margin-right: 0 !important;
	}

	/* 响应式设计 */
	@media (max-width: 768px) {
		.custom-home-container :global(.quick-links-wrapper) {
			padding: 20px 12px;
		}
	}
</style>
