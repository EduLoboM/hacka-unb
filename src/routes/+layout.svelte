<script lang="ts">
	import 'virtual:uno.css';
	import '@unocss/reset/tailwind.css';
	import WaxToast from '$lib/components/WaxToast.svelte';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<svelte:head>
	<title>Hub FGA - Mural Universitário & Mobilidade</title>
</svelte:head>

<div class="min-h-screen flex flex-col font-sans selection:bg-amber-300 selection:text-stone-900 bg-[#3a1d0b]">
	<!-- Toasts Globais de Carimbo de Cera (XP & Feedback) -->
	<WaxToast />

	<!-- Conteúdo Principal -->
	<main class="flex-1 flex flex-col">
		{#if children}
			{@render children()}
		{/if}
	</main>
</div>
