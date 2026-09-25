<script lang="ts">
	interface Props {
		class?: string;
		size?: number;
		color?: string;
	}

	let { class: className = 'w-5 h-5', size = 20, color = 'currentColor' }: Props = $props();
</script>

<!-- Ícone Material de Barata (Cockroach / Pest Control) -->
<svg 
	xmlns="http://www.w3.org/2000/svg" 
	viewBox="0 0 24 24" 
	width={size} 
	height={size}
	fill={color}
	class={className}
	aria-label="Ícone de Barata"
>
	<!-- Antenas longas e curvas da barata -->
	<path d="M10.8 4.2C9.5 2.8 7.2 1.5 4 1.2c-.3 0-.5.2-.5.5 0 .3.2.5.5.5 3 .3 5.1 1.5 6.3 2.7l.5-.7zm2.4 0l.5.7c1.2-1.2 3.3-2.4 6.3-2.7.3 0 .5-.2.5-.5 0-.3-.2-.5-.5-.5-3.2.3-5.5 1.6-6.8 3z" />
	<!-- Cabeça e Pronoto (carapaça frontal) -->
	<ellipse cx="12" cy="6.4" rx="2.4" ry="1.7" />
	<!-- Corpo oval segmentado e élitros (asas duras) com fenda central -->
	<path d="M12 8.4c-2.3 0-3.9 2.2-3.9 5.3 0 3.7 2.1 6.9 3.9 8.1 1.8-1.2 3.9-4.4 3.9-8.1 0-3.1-1.6-5.3-3.9-5.3zm-.6 12.1c-1.4-1.1-2.7-3.8-2.7-6.5 0-2.2.9-3.7 2.7-4.1v10.6zm1.2 0V9.9c1.8.4 2.7 1.9 2.7 4.1 0 2.7-1.3 5.4-2.7 6.5z" />
	<!-- Patas dianteiras articuladas -->
	<path d="M9.8 7.5L6.5 5.8 4.8 7.2c-.2.2-.2.5 0 .7.2.2.5.2.7 0l1.3-1.1 2.7 1.4.3-.7zm4.4 0l.3.7 2.7-1.4 1.3 1.1c.2.2.5.2.7 0 .2-.2.2-.5 0-.7L17.5 5.8l-3.3 1.7z" />
	<!-- Patas medianas articuladas -->
	<path d="M8.2 11.5L4.5 11 2.8 13.2c-.2.2-.1.5.1.7.2.2.5.1.7-.1l1.3-1.7 3.2.4.1-.7zm7.6 0l.1.7 3.2-.4 1.3 1.7c.2.2.5.3.7.1.2-.2.3-.5.1-.7L19.5 11l-3.7.5z" />
	<!-- Patas traseiras longas e espinhosas -->
	<path d="M8.5 15.2l-4 1.8-2 3.5c-.1.3 0 .6.2.7.3.1.6 0 .7-.2l1.8-3.1 3.5-1.6-.2-.7zm7 0l-.2.7 3.5 1.6 1.8 3.1c.1.2.4.3.7.2.2-.1.3-.4.2-.7l-2-3.5-4-1.8z" />
</svg>
