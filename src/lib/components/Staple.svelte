<script lang="ts">
	interface Props {
		orientation?: 'horizontal' | 'diagonal-left' | 'dual';
		class?: string;
	}

	let {
		orientation = 'horizontal',
		class: customClass = ''
	}: Props = $props();

	const orientationMap = {
		'horizontal': '-top-1.5 left-1/2 -translate-x-1/2 rotate-0',
		'diagonal-left': '-top-1 left-3 -rotate-45',
		'dual': ''
	};
</script>

<div 
	class="absolute z-15 pointer-events-none select-none flex items-center justify-center {orientationMap[orientation]} {customClass}"
	aria-hidden="true"
>
	<!-- Grampo Metálico Galvanizado de Grampeador de Mural -->
	<div class="relative flex items-center justify-between w-6 h-2">
		<!-- Furo de Perfuração Esquerdo no Papel -->
		<div class="w-1 h-1.5 rounded-full bg-stone-900/80 blur-[0.3px] -mr-0.5 z-1"></div>

		<!-- Haste Metálica do Grampo com Relevo e Chanfro -->
		<div 
			class="flex-1 h-1 bg-gradient-to-b from-stone-100 via-stone-300 to-stone-600 rounded-xs shadow-[0_1px_2px_rgba(0,0,0,0.6)] border-t border-white/90 border-b border-stone-800/80 relative z-2"
		>
			<!-- Linha de Brilho Metálico Especular -->
			<div class="absolute inset-x-0 top-0 h-0.5 bg-white/70"></div>
		</div>

		<!-- Furo de Perfuração Direito no Papel -->
		<div class="w-1 h-1.5 rounded-full bg-stone-900/80 blur-[0.3px] -ml-0.5 z-1"></div>
	</div>
</div>
