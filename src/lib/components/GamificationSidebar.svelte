<script lang="ts">
	import { gameStore, LEVEL_DATA, getLevelInfo } from '$lib/stores/gameStore';
	import Pin from '$lib/components/Pin.svelte';
	import WashiTape from '$lib/components/WashiTape.svelte';
	import { 
		Flame, 
		Award, 
		CheckCircle2, 
		Volume2, 
		VolumeX, 
		RotateCcw, 
		GraduationCap, 
		ChevronRight, 
		Sparkles,
		Shield
	} from 'lucide-svelte';

	interface Props {
		isMobileDrawer?: boolean;
		onCloseDrawer?: () => void;
	}

	let { isMobileDrawer = false, onCloseDrawer }: Props = $props();

	const user = gameStore.user;
	const quests = gameStore.quests;

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

<aside 
	class="relative bg-[#f5ede0] border-3 border-[#c4a480] shadow-[0_10px_30px_rgba(50,25,10,0.35)] rounded-xl p-5 flex flex-col gap-5 text-stone-900 overflow-hidden {isMobileDrawer ? 'w-full max-h-[85vh] overflow-y-auto' : 'w-80 shrink-0'}"
>
	<!-- Pins decorativos nos cantos superiores para fixar o painel na cortiça -->
	<div class="absolute top-2 left-2.5 z-10 pointer-events-none">
		<Pin color="gold" size="sm" />
	</div>
	<div class="absolute top-2 right-2.5 z-10 pointer-events-none">
		<Pin color="gold" size="sm" />
	</div>

	<!-- Cabeçalho do Perfil do Aluno -->
	<div class="pt-2 flex flex-col items-center text-center border-b border-stone-300 pb-4">
		<div class="relative mb-2.5">
			<!-- Moldura do Avatar com relevo -->
			<div class="w-20 h-20 rounded-full p-1 bg-gradient-to-br from-amber-400 via-stone-300 to-amber-700 shadow-md">
				<img 
					src={$user.avatarUrl} 
					alt={$user.name} 
					class="w-full h-full rounded-full object-cover border-2 border-white shadow-inner" 
				/>
			</div>
			<!-- Badge de Nível flutuante sobre o avatar -->
			<div 
				class="absolute -bottom-1 -right-1 bg-gradient-to-br from-amber-500 to-amber-800 text-amber-100 font-mono font-black text-xs px-2 py-0.5 rounded-full border-2 border-white shadow-sm flex items-center gap-0.5"
				title="Nível {$user.level}"
			>
				<span>Nv.</span>
				<span>{$user.level}</span>
			</div>
		</div>

		<h2 class="text-lg font-black text-stone-950 font-sans tracking-tight">
			{$user.name}
		</h2>

		<div class="text-xs font-semibold {currentLevelInfo.titleColor} flex items-center gap-1 mt-0.5">
			<span>{currentLevelInfo.badgeIcon}</span>
			<span>{$user.title}</span>
		</div>

		<div class="text-[11px] text-stone-600 mt-1 flex items-center gap-1.5 font-medium">
			<GraduationCap class="w-3.5 h-3.5 text-stone-500" />
			<span>{$user.course.replace('Engenharia de ', '').replace('Engenharia ', '')} • {$user.semester}º sem</span>
		</div>

		<!-- Karma e XP Pills -->
		<div class="flex items-center gap-2 mt-3 w-full justify-center">
			<div 
				class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 shadow-xs text-amber-950 font-mono text-xs font-bold"
				title="Karma acumulado por ajuda comunitária"
			>
				<Flame class="w-3.5 h-3.5 text-amber-600" />
				<span>{$user.karma} Karma</span>
			</div>

			<div 
				class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 shadow-xs text-emerald-950 font-mono text-xs font-bold"
				title="Total de pontos de experiência adquiridos"
			>
				<Sparkles class="w-3.5 h-3.5 text-emerald-600" />
				<span>{$user.xp} XP</span>
			</div>
		</div>
	</div>

	<!-- Barra de Progresso de XP e Nível -->
	<div class="bg-white/80 rounded-lg p-3.5 border border-stone-300 shadow-inner">
		<div class="flex items-center justify-between text-xs font-bold text-stone-800 mb-1.5">
			<span class="flex items-center gap-1">
				<span>Progresso p/ Nv. {nextLevelInfo.level}</span>
			</span>
			<span class="font-mono text-[11px] text-stone-600">
				{progressPercent}%
			</span>
		</div>

		<!-- Trilho da barra -->
		<div class="w-full h-3 rounded-full bg-stone-200 overflow-hidden p-0.5 border border-stone-300">
			<!-- Preenchimento animado -->
			<div 
				class="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 transition-all duration-500 ease-out shadow-xs"
				style="width: {progressPercent}%;"
			></div>
		</div>

		<div class="flex items-center justify-between text-[10px] text-stone-500 font-mono mt-1.5">
			<span>{$user.xp} XP atual</span>
			<span>{nextLevelInfo.minXp} XP próximo</span>
		</div>

		<div class="mt-2 pt-2 border-t border-stone-200 text-[11px] text-stone-600 italic">
			<strong>Perk atual:</strong> {currentLevelInfo.perk}
		</div>
	</div>

	<!-- Missões Diárias (Quests) -->
	<div>
		<div class="flex items-center justify-between mb-2">
			<h3 class="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
				<span>Missões Diárias</span>
			</h3>
			<span class="text-[10px] font-mono text-stone-500 bg-black/5 px-1.5 py-0.5 rounded">
				Reseta às 00:00
			</span>
		</div>

		<div class="space-y-2">
			{#each $quests as quest (quest.id)}
				<div class="p-2.5 rounded-lg border transition-all text-xs {quest.isCompleted ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' : 'bg-white/70 border-stone-200 text-stone-800'}">
					<div class="flex items-start justify-between gap-1.5 mb-1">
						<div class="flex items-center gap-1.5 font-bold">
							<span>{quest.icon}</span>
							<span class="leading-tight">{quest.title}</span>
						</div>
						{#if quest.isCompleted}
							<CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
						{:else}
							<span class="text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-1 py-0.2 rounded border border-amber-200 shrink-0">
								+{quest.xpReward} XP
							</span>
						{/if}
					</div>

					<p class="text-[11px] text-stone-600 leading-tight mb-2 font-sans">
						{quest.description}
					</p>

					<!-- Barra de progresso da Quest -->
					<div class="w-full h-1.5 rounded-full bg-stone-200 overflow-hidden">
						<div 
							class="h-full {quest.isCompleted ? 'bg-emerald-600' : 'bg-amber-600'} transition-all duration-300"
							style="width: {(quest.progress / quest.maxProgress) * 100}%;"
						></div>
					</div>

					<div class="flex items-center justify-between text-[10px] font-mono text-stone-500 mt-1">
						<span>Progresso:</span>
						<span>{quest.progress}/{quest.maxProgress}</span>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Medalhas Desbloqueadas (Badges) -->
	<div>
		<h3 class="text-xs font-black text-stone-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
			<Award class="w-3.5 h-3.5 text-amber-700" />
			<span>Conquistas ({$user.badges.length}/8)</span>
		</h3>

		<div class="grid grid-cols-4 gap-2">
			{#each $user.badges as badge}
				<div 
					class="flex flex-col items-center justify-center p-2 rounded bg-white/80 border border-stone-300 shadow-xs hover:border-amber-400 cursor-help transition-all"
					title="{badge.name}: {badge.description}"
				>
					<span class="text-xl mb-0.5">{badge.icon}</span>
					<span class="text-[9px] font-bold text-stone-800 text-center leading-tight truncate w-full">
						{badge.name}
					</span>
				</div>
			{/each}
			<!-- Badges Bloqueadas -->
			{#each Array(5 - $user.badges.length) as _, idx}
				<div 
					class="flex flex-col items-center justify-center p-2 rounded bg-black/5 border border-dashed border-stone-300 opacity-60"
					title="Conquista Secreta - Continue explorando a FGA para desbloquear"
				>
					<span class="text-sm text-stone-400">🔒</span>
					<span class="text-[8px] text-stone-400 text-center">Bloqueada</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- Controles Rápidos: Áudio e Reset -->
	<div class="pt-3 border-t border-stone-300 flex items-center justify-between mt-auto text-xs text-stone-600">
		<button 
			type="button" 
			onclick={() => gameStore.toggleSound()}
			class="flex items-center gap-1.5 p-1.5 rounded hover:bg-stone-200 transition-colors font-medium"
			title={$user.soundEnabled ? 'Silenciar efeitos sonoros' : 'Ativar efeitos sonoros táteis'}
		>
			{#if $user.soundEnabled}
				<Volume2 class="w-4 h-4 text-emerald-700" />
				<span>Sons Ativos</span>
			{:else}
				<VolumeX class="w-4 h-4 text-stone-500" />
				<span>Silencioso</span>
			{/if}
		</button>

		<button 
			type="button" 
			onclick={() => gameStore.resetToDefaults()}
			class="flex items-center gap-1 p-1.5 rounded hover:bg-stone-200 transition-colors text-stone-500 hover:text-stone-800 text-[11px]"
			title="Resetar dados do mural para os valores iniciais de demonstração"
		>
			<RotateCcw class="w-3.5 h-3.5" />
			<span>Reset</span>
		</button>
	</div>
</aside>
