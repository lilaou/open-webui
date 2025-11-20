<script lang="ts">
	import CustomChatPlaceholder from './CustomChatPlaceholder.svelte';

	// 导出Chat组件的所有props
	export let chatId = null;
	export let models = [];
	export let params = {};
</script>

<div class="custom-chat-wrapper">
	<CustomChatPlaceholder />
</div>
