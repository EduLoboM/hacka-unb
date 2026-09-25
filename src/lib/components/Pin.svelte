<script lang="ts">
	import { onMount } from 'svelte';
	import type { PinColor } from '$lib/types/gamification';
	import { lightStore } from '$lib/stores/lightStore';

	interface Props {
		color?: PinColor;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	let {
		color = 'red',
		size = 'md',
		class: customClass = ''
	}: Props = $props();

	onMount(() => {
		lightStore.initListener();
	});

	// Paleta de iluminação realista para esferas 3D brilhantes
	const palettes: Record<PinColor, { h: string; c: string; s: string; d: string }> = {
		red: { h: '#ffa8b8', c: '#e60026', s: '#850012', d: '#380006' },
		gold: { h: '#fffde6', c: '#f59e0b', s: '#b45309', d: '#5c2904' },
		blue: { h: '#c7e0ff', c: '#2563eb', s: '#1e3a8a', d: '#0c1322' },
		emerald: { h: '#bbf7d0', c: '#059669', s: '#064e3b', d: '#02241b' },
		silver: { h: '#ffffff', c: '#cbd5e1', s: '#64748b', d: '#1e293b' },
		purple: { h: '#f5d0fe', c: '#9333ea', s: '#581c87', d: '#2b074f' }
	};

	const sizeMap = {
		sm: {
			sphere: 'w-4 h-4',
			shadow: 'w-4.5 h-3',
			contact: 'w-2.5 h-1',
			dot: 'w-1 h-1'
		},
		md: {
			sphere: 'w-5.5 h-5.5',
			shadow: 'w-6 h-3.5',
			contact: 'w-3.5 h-1.5',
			dot: 'w-1.5 h-1.5'
		},
		lg: {
			sphere: 'w-7 h-7',
			shadow: 'w-7.5 h-4.5',
			contact: 'w-4.5 h-2',
			dot: 'w-2 h-2'
		}
	};

	let palette = $derived(palettes[color] ?? palettes.red);

	// Posição normalizada do ponto de luz no alfinete baseada no cursor
	let lightX = $derived(Math.round(30 + $lightStore.nx * 16)); // 14% a 46%
	let lightY = $derived(Math.round(28 + $lightStore.ny * 14)); // 14% a 42%

	// Sombra projetada na direção oposta ao ponto de luz do cursor
	let shadowX = $derived((-$lightStore.nx * 5.5 + 2).toFixed(1));
	let shadowY = $derived((-$lightStore.ny * 4.5 + 2.5).toFixed(1));

	// Posição do ponto de luz especular dentro da esfera
	let dotLeft = $derived(Math.max(12, Math.min(60, lightX - 8)));
	let dotTop = $derived(Math.max(12, Math.min(58, lightY - 8)));
</script>

<div class="relative inline-flex items-center justify-center select-none {customClass}" aria-hidden="true">
	
	<!-- 1. Sombra de Contato Imediata (Occlusion Shadow na base da esfera) -->
	<div 
		class="absolute bottom-0 left-1/2 -translate-x-1/2 {sizeMap[size].contact} rounded-full bg-black/45 blur-[0.8px] pointer-events-none z-1"
	></div>

	<!-- 2. Sombra Elíptica Projetada com Parallax Interativo em Tempo Real -->
	<div 
		class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 {sizeMap[size].shadow} rounded-[50%] bg-black/45 blur-[2.5px] pointer-events-none z-1 transition-transform duration-75 ease-out"
		style="transform: translate({shadowX}px, {shadowY}px);"
	></div>

	<!-- 3. Cabeça Esférica 3D do Alfinete de Bola (Ball Pin) Limpa e Brilhante -->
	<div 
		class="relative z-2 {sizeMap[size].sphere} rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.45)] flex items-center justify-center transition-all duration-75 ease-out"
		style="background: radial-gradient(circle at {lightX}% {lightY}%, {palette.h} 0%, {palette.c} 42%, {palette.s} 78%, {palette.d} 100%);"
	>
		<!-- Brilho Difuso Secundário da Esfera -->
		<div 
			class="absolute rounded-full bg-white/35 blur-[0.8px] pointer-events-none transition-all duration-75 ease-out"
			style="width: 45%; height: 30%; left: {dotLeft - 2}%; top: {dotTop - 2}%; transform: rotate(-25deg);"
		></div>

		<!-- Ponto de Luz Especular Esmaltado (Glint que acompanha a luz do mouse) -->
		<div 
			class="absolute rounded-full bg-white blur-[0.2px] shadow-[0_0_2px_#ffffff] pointer-events-none transition-all duration-75 ease-out {sizeMap[size].dot}"
			style="left: {dotLeft}%; top: {dotTop}%;"
		></div>

		<!-- Luz Rebatida de Fundo (Ambient Rim Light no lado oposto) -->
		<div 
			class="absolute bottom-0.5 right-0.75 w-2 h-1 rounded-full bg-white/20 blur-[0.6px] rotate-[30deg] pointer-events-none"
		></div>
	</div>
</div>
