<script lang="ts">
	import { gameStore } from '$lib/stores/gameStore';
	import { Flame, Sparkles, Award, IdCard, ChevronDown } from 'lucide-svelte';

	interface Props {
		onOpenQuests: () => void;
		class?: string;
		isMobileCompact?: boolean;
	}

	let { onOpenQuests, class: customClass = '', isMobileCompact = false }: Props = $props();

	const user = gameStore.user;
</script>

<!-- Botão Mini-Crachá Estudantil UnB no Header -->
<button 
	type="button"
	onclick={onOpenQuests}
	class="relative group inline-flex items-center gap-2 h-10 px-2.5 sm:px-3 rounded-lg bg-stone-100/95 hover:bg-white text-stone-900 shadow-sm hover:shadow-md border border-stone-300 hover:border-emerald-600 transition-all select-none cursor-pointer active:scale-95 {customClass}"
	aria-label="Abrir Crachá e Carteirinha Estudantil da UnB"
	title="Clique para abrir Carteirinha Estudantil • {$user.name} (Nv. {$user.level})"
>
	<!-- Presilha Metálica Cromada com Mini-fita UnB -->
	<div class="hidden md:flex flex-col items-center shrink-0 -ml-1 pr-0.5">
		<!-- Mini-fita azul e verde UnB -->
		<div class="w-2.5 h-1.5 bg-gradient-to-r from-[#003366] via-emerald-600 to-[#003366] rounded-t-xs -mb-0.5"></div>
		<!-- Presilha de aço -->
		<div class="w-1.5 h-3.5 bg-gradient-to-b from-stone-400 via-stone-200 to-stone-400 rounded-xs border border-stone-400 shadow-inner"></div>
	</div>

	<!-- Foto do Aluno com Pílula de Nível e Ponto de Status Ativo -->
	<div class="relative shrink-0">
		<div class="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full overflow-hidden border-2 border-emerald-600/80 shadow-xs group-hover:border-emerald-500 transition-colors">
			<img 
				src={$user.avatarUrl} 
				alt={$user.name} 
				class="w-full h-full object-cover" 
			/>
		</div>
		<!-- Ponto verde ativo -->
		<span class="absolute top-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white ring-1 ring-white/50 animate-pulse"></span>
		<!-- Badge Nível -->
		<span class="absolute -bottom-1 -right-1 bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 font-mono font-black text-[8px] px-1 rounded-full border border-white leading-none shadow-2xs">
			{$user.level}
		</span>
	</div>

	{#if !isMobileCompact}
		<!-- Informações do Aluno no Desktop / Tablet -->
		<div class="flex flex-col items-start text-left leading-tight">
			<div class="flex items-center gap-1.5">
				<span class="font-black text-xs text-stone-950 max-w-[100px] sm:max-w-[130px] truncate tracking-tight">
					{$user.name.split(' ')[0]}
				</span>
				<span class="text-[8px] font-mono font-bold px-1 py-0.2 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
					{$user.course.includes('Software') ? 'FGA • SW' : 'FGA'}
				</span>
			</div>
			
			<div class="flex items-center gap-1.5 text-[10px] text-stone-600 font-mono mt-0.5">
				<span class="text-emerald-700 font-bold flex items-center">
					<Sparkles class="w-2.5 h-2.5 mr-0.5 inline text-emerald-600" />{$user.xp} XP
				</span>
				<span class="text-stone-300">•</span>
				<span class="flex items-center text-amber-700 font-bold">
					<Flame class="w-2.5 h-2.5 mr-0.5 inline text-amber-600" />{$user.karma}
				</span>
			</div>
		</div>

		<!-- Ícone de Crachá / Carteirinha indicando abertura -->
		<div class="hidden sm:flex items-center pl-1.5 ml-0.5 border-l border-stone-200 text-stone-400 group-hover:text-emerald-700 transition-colors">
			<IdCard class="w-4 h-4" />
			<ChevronDown class="w-3 h-3 -ml-0.5 opacity-60 group-hover:opacity-100 transition-opacity" />
		</div>
	{:else}
		<!-- Versão Super Compacta Mobile -->
		<div class="flex flex-col items-start text-left leading-none">
			<span class="font-extrabold text-[11px] text-stone-950 truncate max-w-[70px]">
				{$user.name.split(' ')[0]}
			</span>
			<span class="text-[9px] text-emerald-700 font-mono font-bold">
				+{$user.xp} XP
			</span>
		</div>
		<IdCard class="w-3.5 h-3.5 text-emerald-700 shrink-0" />
	{/if}
</button>
