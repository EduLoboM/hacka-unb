<script lang="ts">
	interface Props {
		color?: 'amber' | 'green' | 'blue' | 'red' | 'neutral';
		rotation?: 'left' | 'right' | 'none';
		text?: string;
		class?: string;
		children?: import('svelte').Snippet;
	}

	let {
		color = 'amber',
		rotation = 'none',
		text = '',
		class: customClass = '',
		children
	}: Props = $props();

	const colorClasses = {
		amber: 'bg-amber-200/80 text-amber-950 border-amber-400/30',
		green: 'bg-emerald-200/80 text-emerald-950 border-emerald-400/30',
		blue: 'bg-sky-200/80 text-sky-950 border-sky-400/30',
		red: 'bg-rose-200/85 text-rose-950 border-rose-400/30',
		neutral: 'bg-white/75 text-stone-900 border-stone-300/40'
	};

	const rotationClasses = {
		left: '-rotate-2 -translate-y-1',
		right: 'rotate-2 -translate-y-1',
		none: 'rotate-0'
	};
</script>

<div 
	class="inline-flex items-center justify-center px-3.5 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-[1px] shadow-sm select-none border-x-2 border-dashed {colorClasses[color]} {rotationClasses[rotation]} {customClass}"
	style="clip-path: polygon(0% 0%, 100% 0%, 97% 50%, 100% 100%, 0% 100%, 3% 50%);"
>
	{#if children}
		{@render children()}
	{:else}
		<span>{text}</span>
	{/if}
</div>
