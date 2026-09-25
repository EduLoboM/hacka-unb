<script lang="ts">
	import { gameStore } from '$lib/stores/gameStore';
	import { Flame, Award } from 'lucide-svelte';

	interface Props {
		onOpenQuests: () => void;
		class?: string;
	}

	let { onOpenQuests, class: customClass = '' }: Props = $props();

	const user = gameStore.user;
</script>

<!-- Crachá Estudantil UnB Compacto Horizontal (Não aumenta a altura do header) -->
<button 
	type="button"
	onclick={onOpenQuests}
	class="relative group inline-flex items-center gap-2 h-9 px-2.5 rounded-md bg-stone-100/95 hover:bg-white text-stone-900 shadow-xs border border-stone-300/90 hover:border-emerald-600 transition-all select-none cursor-pointer active:scale-95 {customClass}"
	aria-label="Abrir Perfil e Missões do Aluno"
	title="Abrir Perfil e Conquistas • {$user.name} (Nv. {$user.level})"
>
	<!-- Presilha Metálica Compacta de Crachá -->
	<div class="hidden sm:flex flex-col items-center shrink-0 -ml-1">
		<div class="w-1.5 h-3 bg-gradient-to-b from-stone-400 via-stone-200 to-stone-400 rounded-xs border border-stone-400 shadow-inner"></div>
	</div>

	<!-- Foto do Aluno com Badge de Nível -->
	<div class="relative shrink-0">
		<div class="w-6.5 h-6.5 rounded-full overflow-hidden border border-emerald-700/70 shadow-xs">
			<img 
				src={$user.avatarUrl} 
				alt={$user.name} 
				class="w-full h-full object-cover" 
			/>
		</div>
		<span class="absolute -bottom-1 -right-1 bg-amber-500 text-stone-950 font-mono font-black text-[8px] px-1 rounded-full border border-white leading-none">
			{$user.level}
		</span>
	</div>

	<!-- Informações Compactas do Aluno -->
	<div class="hidden sm:flex flex-col items-start text-left leading-tight">
		<div class="flex items-center gap-1.5">
			<span class="font-extrabold text-xs text-stone-900 max-w-[110px] truncate">
				{$user.name.split(' ')[0]}
			</span>
			<span class="text-[8px] font-mono font-bold px-1 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
				FGA
			</span>
		</div>
		<div class="flex items-center gap-1 text-[10px] text-stone-600 font-mono">
			<span class="text-emerald-700 font-bold">{$user.xp} XP</span>
			<span class="text-stone-300">•</span>
			<span class="flex items-center text-amber-700 font-bold">
				<Flame class="w-2.5 h-2.5 inline mr-0.5" />{$user.karma}
			</span>
		</div>
	</div>

	<!-- Indicador de XP para telas mobile -->
	<span class="sm:hidden text-[10px] text-emerald-800 font-mono font-bold">
		+{$user.xp} XP
	</span>

	<!-- Ícone de Conquista / Abertura de gaveta -->
	<div class="hidden md:flex items-center pl-1 border-l border-stone-200 text-stone-400 group-hover:text-emerald-700">
		<Award class="w-3.5 h-3.5" />
	</div>
</button>
