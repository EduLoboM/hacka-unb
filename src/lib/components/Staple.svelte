<script lang="ts">
	interface Props {
		position?: 'dual' | 'top-center' | 'top-left' | 'top-right';
		class?: string;
	}

	let {
		position = 'dual',
		class: customClass = ''
	}: Props = $props();

	// ID único para gradientes SVG
	const stapleId = `staple-${Math.random().toString(36).slice(2, 7)}`;
</script>

{#snippet stapleSvg(rotationClass: string)}
	<div 
		class="pointer-events-none select-none {rotationClass}"
		aria-hidden="true"
	>
		<svg 
			viewBox="0 0 38 10" 
			class="w-9 h-2.5 overflow-visible"
			style="filter: drop-shadow(0 1.5px 2px rgba(10, 5, 2, 0.65));"
			fill="none" 
			xmlns="http://www.w3.org/2000/svg"
		>
			<defs>
				<!-- Gradiente de Aço Galvanizado Realista -->
				<linearGradient id="{stapleId}-grad" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" stop-color="#f8fafc" />
					<stop offset="25%" stop-color="#e2e8f0" />
					<stop offset="55%" stop-color="#94a3b8" />
					<stop offset="85%" stop-color="#64748b" />
					<stop offset="100%" stop-color="#334155" />
				</linearGradient>
			</defs>

			<!-- Furos de Penetração no Papel (Onde as pontas do grampo perfuram a folha) -->
			<rect x="1.5" y="1.5" width="2" height="6.5" rx="0.5" fill="#09090b" opacity="0.9" />
			<rect x="34.5" y="1.5" width="2" height="6.5" rx="0.5" fill="#09090b" opacity="0.9" />

			<!-- Barra Metálica do Grampo (Arame de Aço Galvanizado) -->
			<rect 
				x="2.5" 
				y="2.5" 
				width="33" 
				height="4.5" 
				rx="1" 
				fill="url(#{stapleId}-grad)" 
				stroke="#475569" 
				stroke-width="0.5" 
			/>

			<!-- Linha de Brilho Especular Superior do Metal -->
			<line x1="3.5" y1="3.5" x2="34.5" y2="3.5" stroke="#ffffff" stroke-width="0.8" opacity="0.95" />

			<!-- Linha de Chanfro / Sombra Inferior do Fio -->
			<line x1="3.5" y1="6.3" x2="34.5" y2="6.3" stroke="#1e293b" stroke-width="0.6" opacity="0.75" />
		</svg>
	</div>
{/snippet}

{#if position === 'dual'}
	<!-- Dois Grampos: Um no Canto Superior Esquerdo e Outro no Direito (Firmemente Grampeados Sobre o Papel) -->
	<div class="absolute top-2 left-4 z-20 {customClass}">
		{@render stapleSvg('-rotate-12')}
	</div>
	<div class="absolute top-2 right-4 z-20 {customClass}">
		{@render stapleSvg('rotate-12')}
	</div>
{:else if position === 'top-center'}
	<!-- Grampo Único no Topo Central (Sobre a Faixa de Cabeçalho) -->
	<div class="absolute top-2 left-1/2 -translate-x-1/2 z-20 {customClass}">
		{@render stapleSvg('-rotate-1')}
	</div>
{:else if position === 'top-left'}
	<div class="absolute top-2 left-4 z-20 {customClass}">
		{@render stapleSvg('-rotate-12')}
	</div>
{:else if position === 'top-right'}
	<div class="absolute top-2 right-4 z-20 {customClass}">
		{@render stapleSvg('rotate-12')}
	</div>
{/if}
