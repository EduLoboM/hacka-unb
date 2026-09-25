<script lang="ts">
	interface Props {
		corner?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'horizontal';
		class?: string;
	}

	let {
		corner = 'top-left',
		class: customClass = ''
	}: Props = $props();

	const cornerPositions = {
		'top-left': '-top-4.5 -left-5 -rotate-35',
		'top-right': '-top-4.5 -right-5 rotate-35',
		'bottom-left': '-bottom-3.5 -left-5 rotate-35',
		'bottom-right': '-bottom-3.5 -right-5 -rotate-35',
		'horizontal': '-top-3.5 left-1/2 -translate-x-1/2 rotate-0'
	};
</script>

<!-- Fita Durex / Scotch Tape Translúcida com Dentes Serrados de Dispenser e Brilho Celofane -->
<div 
	class="absolute z-20 pointer-events-none select-none {cornerPositions[corner]} {customClass}"
	aria-hidden="true"
>
	<div 
		class="relative w-20 h-7 bg-[#fffef2]/60 backdrop-blur-[1.5px] border-t border-b border-white/80 shadow-[0_2px_6px_rgba(25,12,4,0.32)] overflow-hidden"
		style="clip-path: polygon(0% 0%, 100% 0%, 97% 20%, 100% 40%, 97% 60%, 100% 80%, 97% 100%, 0% 100%, 3% 80%, 0% 60%, 3% 40%, 0% 20%);"
	>
		<!-- Brilho Especular Diagonal do Celofane Plástico Refletindo Luz Ambiente -->
		<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent transform -skew-x-30 translate-x-2"></div>

		<!-- Linha de Vinco / Bolha de Ar Típica de Fita Colada Manualmente -->
		<div class="absolute top-1/2 left-3 right-3 h-[1px] bg-white/70 shadow-[0_0.5px_1px_rgba(0,0,0,0.15)]"></div>
		
		<!-- Sombra Suave nas Extremidades Cortadas -->
		<div class="absolute inset-y-0 left-0 w-1 bg-black/10"></div>
		<div class="absolute inset-y-0 right-0 w-1 bg-black/10"></div>
	</div>
</div>
