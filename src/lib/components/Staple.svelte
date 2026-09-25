<script lang="ts">
	interface Props {
		position?: 'top-center' | 'top-left' | 'top-right' | 'dual';
		rotation?: string;
		class?: string;
	}

	let {
		position = 'dual',
		rotation,
		class: customClass = ''
	}: Props = $props();
</script>

{#if position === 'dual'}
	<!-- Dois Grampos: Um no Canto Esquerdo e Outro no Direito (Estilo Grampeador de Mural) -->
	<div 
		class="absolute -top-2 left-6 -rotate-12 z-20 pointer-events-none select-none {customClass}"
		aria-hidden="true"
	>
		<div class="relative flex items-center justify-between w-9 h-2.5">
			<!-- Furo de Perfuração Esquerdo no Papel / Cortiça -->
			<div class="w-1.5 h-2 bg-stone-950/80 rounded-[1px] -mr-1 z-1 shadow-inner"></div>

			<!-- Barra Metálica do Grampo Galvanizado -->
			<div 
				class="flex-1 h-1.5 bg-gradient-to-b from-white via-zinc-300 to-zinc-600 rounded-[1px] shadow-[0_2px_4px_rgba(20,10,5,0.5)] border-t border-white border-b border-zinc-800/90 relative z-2"
			>
				<!-- Brilho Especular Superior do Arame de Aço -->
				<div class="absolute inset-x-0 top-0 h-0.5 bg-white/90"></div>
			</div>

			<!-- Furo de Perfuração Direito no Papel / Cortiça -->
			<div class="w-1.5 h-2 bg-stone-950/80 rounded-[1px] -ml-1 z-1 shadow-inner"></div>
		</div>
	</div>

	<div 
		class="absolute -top-2 right-6 rotate-8 z-20 pointer-events-none select-none {customClass}"
		aria-hidden="true"
	>
		<div class="relative flex items-center justify-between w-9 h-2.5">
			<!-- Furo de Perfuração Esquerdo -->
			<div class="w-1.5 h-2 bg-stone-950/80 rounded-[1px] -mr-1 z-1 shadow-inner"></div>

			<!-- Barra Metálica do Grampo Galvanizado -->
			<div 
				class="flex-1 h-1.5 bg-gradient-to-b from-white via-zinc-300 to-zinc-600 rounded-[1px] shadow-[0_2px_4px_rgba(20,10,5,0.5)] border-t border-white border-b border-zinc-800/90 relative z-2"
			>
				<!-- Brilho Especular Superior -->
				<div class="absolute inset-x-0 top-0 h-0.5 bg-white/90"></div>
			</div>

			<!-- Furo de Perfuração Direito -->
			<div class="w-1.5 h-2 bg-stone-950/80 rounded-[1px] -ml-1 z-1 shadow-inner"></div>
		</div>
	</div>

{:else if position === 'top-left'}
	<div 
		class="absolute -top-2 left-6 {rotation ?? '-rotate-12'} z-20 pointer-events-none select-none {customClass}"
		aria-hidden="true"
	>
		<div class="relative flex items-center justify-between w-9 h-2.5">
			<div class="w-1.5 h-2 bg-stone-950/80 rounded-[1px] -mr-1 z-1 shadow-inner"></div>
			<div class="flex-1 h-1.5 bg-gradient-to-b from-white via-zinc-300 to-zinc-600 rounded-[1px] shadow-[0_2px_4px_rgba(20,10,5,0.5)] border-t border-white border-b border-zinc-800/90 relative z-2">
				<div class="absolute inset-x-0 top-0 h-0.5 bg-white/90"></div>
			</div>
			<div class="w-1.5 h-2 bg-stone-950/80 rounded-[1px] -ml-1 z-1 shadow-inner"></div>
		</div>
	</div>

{:else if position === 'top-right'}
	<div 
		class="absolute -top-2 right-6 {rotation ?? 'rotate-8'} z-20 pointer-events-none select-none {customClass}"
		aria-hidden="true"
	>
		<div class="relative flex items-center justify-between w-9 h-2.5">
			<div class="w-1.5 h-2 bg-stone-950/80 rounded-[1px] -mr-1 z-1 shadow-inner"></div>
			<div class="flex-1 h-1.5 bg-gradient-to-b from-white via-zinc-300 to-zinc-600 rounded-[1px] shadow-[0_2px_4px_rgba(20,10,5,0.5)] border-t border-white border-b border-zinc-800/90 relative z-2">
				<div class="absolute inset-x-0 top-0 h-0.5 bg-white/90"></div>
			</div>
			<div class="w-1.5 h-2 bg-stone-950/80 rounded-[1px] -ml-1 z-1 shadow-inner"></div>
		</div>
	</div>

{:else}
	<!-- Grampo Único Centralizado no Topo -->
	<div 
		class="absolute -top-2 left-1/2 -translate-x-1/2 {rotation ?? '-rotate-1'} z-20 pointer-events-none select-none {customClass}"
		aria-hidden="true"
	>
		<div class="relative flex items-center justify-between w-10 h-2.5">
			<div class="w-1.5 h-2 bg-stone-950/80 rounded-[1px] -mr-1 z-1 shadow-inner"></div>
			<div class="flex-1 h-1.5 bg-gradient-to-b from-white via-zinc-300 to-zinc-600 rounded-[1px] shadow-[0_2px_4px_rgba(20,10,5,0.5)] border-t border-white border-b border-zinc-800/90 relative z-2">
				<div class="absolute inset-x-0 top-0 h-0.5 bg-white/90"></div>
			</div>
			<div class="w-1.5 h-2 bg-stone-950/80 rounded-[1px] -ml-1 z-1 shadow-inner"></div>
		</div>
	</div>
{/if}
