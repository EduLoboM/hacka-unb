<script lang="ts">
	interface Props {
		corner?: 'top-left' | 'top-right' | 'horizontal';
		class?: string;
	}

	let {
		corner = 'top-left',
		class: customClass = ''
	}: Props = $props();

	const cornerPositions = {
		'top-left': '-top-2 -left-3 -rotate-35',
		'top-right': '-top-2 -right-3 rotate-35',
		'horizontal': '-top-2.5 left-1/2 -translate-x-1/2 rotate-0'
	};
</script>

<div 
	class="absolute z-15 pointer-events-none select-none {cornerPositions[corner]} {customClass}"
	aria-hidden="true"
>
	<!-- Fita Durex / Adesiva Transparente com Brilho Celofane e Relevo -->
	<div 
		class="relative w-14 h-5.5 bg-white/45 backdrop-blur-[1px] border-t border-b border-white/70 shadow-[0_1px_3px_rgba(0,0,0,0.2)] overflow-hidden"
		style="clip-path: polygon(0% 0%, 100% 0%, 97% 50%, 100% 100%, 0% 100%, 3% 50%);"
	>
		<!-- Brilho Especular Diagonal do Celofane Plástico -->
		<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent transform -skew-x-25 translate-x-1"></div>

		<!-- Linha de Vinco / Ar sob a Fita Transparente -->
		<div class="absolute top-1/2 left-2 right-2 h-px bg-white/50 blur-[0.3px]"></div>
		
		<!-- Sombra sutil das bordas coladas no papel e cortiça -->
		<div class="absolute inset-0 border-x border-black/10"></div>
	</div>
</div>
