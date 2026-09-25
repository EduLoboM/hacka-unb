<script lang="ts">
	import { gameStore, LEVEL_DATA, getLevelInfo } from '$lib/stores/gameStore';
	import { Flame, Sparkles, Award, ChevronRight, GraduationCap } from 'lucide-svelte';

	interface Props {
		onOpenQuests: () => void;
		class?: string;
	}

	let { onOpenQuests, class: customClass = '' }: Props = $props();

	const user = gameStore.user;

	let currentLevelInfo = $derived(getLevelInfo($user.xp));
	let nextLevelInfo = $derived(
		LEVEL_DATA.find((l) => l.level === currentLevelInfo.level + 1) ?? LEVEL_DATA[LEVEL_DATA.length - 1]
	);

	let xpInCurrentLevel = $derived($user.xp - currentLevelInfo.minXp);
	let xpRequiredForNext = $derived(
		nextLevelInfo.level === currentLevelInfo.level 
			? 1 
			: nextLevelInfo.minXp - currentLevelInfo.minXp
	);
	let progressPercent = $derived(
		nextLevelInfo.level === currentLevelInfo.level 
			? 100 
			: Math.min(100, Math.round((xpInCurrentLevel / xpRequiredForNext) * 100))
	);
</script>

<!-- Carteirinha Estudantil Autêntica da UnB FGA (Crachá Compacto com Clipe) -->
<div 
	class="relative inline-block select-none group cursor-pointer {customClass}"
	onclick={onOpenQuests}
	role="button"
	tabindex="0"
	onkeydown={(e) => e.key === 'Enter' && onOpenQuests()}
	aria-label="Abrir Mural de Conquistas e Missões do Aluno"
>
	<!-- Clipe Metálico de Crachá Preso no Topo -->
	<div class="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
		<!-- Argola / Presilha metálica prateada -->
		<div class="w-6 h-3 rounded-t-full border-2 border-stone-400 bg-stone-300 shadow-xs"></div>
		<!-- Bloco do clipe com parafuso -->
		<div class="w-8 h-2.5 bg-gradient-to-r from-stone-400 via-stone-200 to-stone-500 rounded-xs shadow-md border border-stone-500/60"></div>
	</div>

	<!-- Cartão Plástico de Identificação Estudantil da UnB -->
	<div 
		class="relative z-10 w-72 sm:w-80 bg-gradient-to-b from-[#ffffff] via-[#f8fafc] to-[#f1f5f9] rounded-lg shadow-[0_8px_20px_rgba(40,15,5,0.3)] border-2 border-stone-300/80 p-3 pt-4 text-stone-900 transition-all duration-200 group-hover:shadow-[0_12px_28px_rgba(40,15,5,0.4)] group-hover:-translate-y-0.5"
	>
		<!-- Tarja Institucional Superior UnB Verde/Azul -->
		<div class="flex items-center justify-between border-b-2 border-emerald-700/60 pb-1.5 mb-2.5">
			<div class="flex items-center gap-1.5">
				<!-- Emblema UnB Estilizado -->
				<div class="w-5 h-5 rounded bg-emerald-800 text-white font-black text-[9px] flex items-center justify-center font-mono tracking-tighter shadow-xs">
					UnB
				</div>
				<div>
					<span class="text-[10px] font-black tracking-wider text-emerald-950 uppercase block leading-none">
						Universidade de Brasília
					</span>
					<span class="text-[8px] font-bold tracking-widest text-stone-500 uppercase block">
						Faculdade Gama • FGA
					</span>
				</div>
			</div>

			<span class="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
				Estudante
			</span>
		</div>

		<!-- Miolo: Foto 3x4 e Dados do Aluno -->
		<div class="flex items-center gap-3">
			<!-- Foto 3x4 do Aluno com Moldura de Documento -->
			<div class="relative shrink-0">
				<div class="w-13 h-16 rounded bg-stone-200 p-0.5 border border-stone-300 shadow-inner overflow-hidden">
					<img 
						src={$user.avatarUrl} 
						alt={$user.name} 
						class="w-full h-full object-cover" 
					/>
				</div>
				<!-- Badge de Nível no Canto da Foto -->
				<div class="absolute -bottom-1 -right-1 bg-amber-500 text-stone-950 font-mono font-black text-[10px] px-1.5 py-0.2 rounded shadow-xs border border-white">
					Nv. {$user.level}
				</div>
			</div>

			<!-- Informações do Estudante -->
			<div class="flex-1 min-w-0">
				<h3 class="font-extrabold text-sm text-stone-950 leading-tight truncate">
					{$user.name}
				</h3>
				
				<span class="text-[11px] font-bold text-amber-900 block truncate">
					{currentLevelInfo.badgeIcon} {$user.title}
				</span>

				<div class="text-[10px] text-stone-600 font-mono mt-0.5 flex items-center gap-1 truncate">
					<GraduationCap class="w-3 h-3 text-stone-500 shrink-0" />
					<span>{$user.course.replace('Engenharia de ', '').replace('Engenharia ', '')} • {$user.semester}º sem</span>
				</div>

				<!-- XP & Karma Pills Compactos -->
				<div class="flex items-center gap-1.5 mt-1.5">
					<span class="inline-flex items-center gap-0.5 text-[9px] font-mono font-bold bg-amber-100 text-amber-950 px-1.5 py-0.2 rounded border border-amber-300">
						<Flame class="w-2.5 h-2.5 text-amber-600" />
						{$user.karma}
					</span>
					<span class="inline-flex items-center gap-0.5 text-[9px] font-mono font-bold bg-emerald-100 text-emerald-950 px-1.5 py-0.2 rounded border border-emerald-300">
						<Sparkles class="w-2.5 h-2.5 text-emerald-600" />
						{$user.xp} XP
					</span>
				</div>
			</div>
		</div>

		<!-- Mini Barra de XP e Botão de Expansão -->
		<div class="mt-2.5 pt-2 border-t border-stone-200">
			<div class="flex items-center justify-between text-[9px] font-bold text-stone-600 mb-1">
				<span>Progresso p/ Nv. {nextLevelInfo.level}</span>
				<span class="font-mono text-stone-800">{progressPercent}%</span>
			</div>

			<div class="w-full h-1.5 rounded-full bg-stone-200 overflow-hidden">
				<div 
					class="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-300"
					style="width: {progressPercent}%;"
				></div>
			</div>

			<div class="mt-2 flex items-center justify-between text-[10px] font-bold text-emerald-900 group-hover:text-emerald-950">
				<span class="flex items-center gap-1">
					<Award class="w-3 h-3 text-amber-700" />
					Missões & Medalhas ({$user.badges.length}/8)
				</span>
				<span class="flex items-center gap-0.5 text-[10px] font-semibold text-stone-500 group-hover:text-stone-800">
					Abrir <ChevronRight class="w-3 h-3" />
				</span>
			</div>
		</div>
	</div>
</div>
