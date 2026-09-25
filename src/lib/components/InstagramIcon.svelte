<script lang="ts">
	interface Props {
		class?: string;
		size?: number;
		gradient?: boolean;
	}

	let { class: className = 'w-4 h-4', size = 16, gradient = false }: Props = $props();
</script>

<svg 
	xmlns="http://www.w3.org/2000/svg" 
	viewBox="0 0 24 24" 
	width={size} 
	height={size}
	fill="none" 
	stroke="currentColor" 
	stroke-width="2" 
	stroke-linecap="round" 
	stroke-linejoin="round" 
	class={className}
>
	{#if gradient}
		<defs>
			<radialGradient id="ig-grad" cx="0.2" cy="1" r="1">
				<stop offset="0%" stop-color="#ffd600" />
				<stop offset="25%" stop-color="#ff0100" />
				<stop offset="50%" stop-color="#d800b9" />
				<stop offset="100%" stop-color="#405de6" />
			</radialGradient>
		</defs>
	{/if}
	<rect width="20" height="20" x="2" y="2" rx="5" ry="5" stroke={gradient ? 'url(#ig-grad)' : 'currentColor'} />
	<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke={gradient ? 'url(#ig-grad)' : 'currentColor'} />
	<line x1="17.5" x2="17.51" y1="6.5" y2="6.5" stroke={gradient ? 'url(#ig-grad)' : 'currentColor'} />
</svg>
