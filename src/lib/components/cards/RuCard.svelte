<script lang="ts">
	import { onMount } from 'svelte';
	import { gameStore, WEEKLY_RU_MENU, isHypedMeal } from '$lib/stores/gameStore';
	import type { RuQueueStatus } from '$lib/types/gamification';
	import Staple from '$lib/components/Staple.svelte';
	import { 
		UtensilsCrossed, 
		Clock, 
		Users, 
		Check, 
		AlertCircle, 
		ExternalLink, 
		MessageSquare, 
		Send, 
		ThumbsUp, 
		Sparkles,
		Flame,
		Timer,
		Calendar,
		FlameKindling
	} from 'lucide-svelte';

	const ru = gameStore.ru;

	// Determinar o dia da semana atual automaticamente (1 = Seg ... 5 = Sex)
	// Se for fim de semana (0 ou 6), mapeia para Sexta ou Segunda
	function getTodayDayOfWeek(): number {
		const day = new Date().getDay();
		if (day === 0 || day === 6) return 5; // Padrão Sexta-feira para visualização no fds
		return day;
	}

	function getInitialMealTurn(): 'lunch' | 'dinner' {
		const now = new Date();
		const totalMinutes = now.getHours() * 60 + now.getMinutes();
		// Após as 14h30, foca no jantar
		if (totalMinutes >= 14 * 60 + 30) return 'dinner';
		return 'lunch';
	}

	let selectedDayOfWeek = $state<number>(getTodayDayOfWeek());
	let selectedTurn = $state<'lunch' | 'dinner'>(getInitialMealTurn());
	let todayDayNumber = $derived(getTodayDayOfWeek());

	// Cardápio do dia selecionado
	let currentDayMenu = $derived(
		WEEKLY_RU_MENU.find((m) => m.dayOfWeek === selectedDayOfWeek) ?? WEEKLY_RU_MENU[4]
	);

	let currentMeal = $derived(
		selectedTurn === 'lunch' ? currentDayMenu.lunch : currentDayMenu.dinner
	);

	// Análise de Comida Concorrida / Hype (Lasanha, Strogonoff, Feijoada, etc.)
	let hypeAnalysis = $derived(isHypedMeal(currentMeal.mainDish));

	// Estado do horário e turno em tempo real
	let currentTimeStr = $state('');
	let mealStatusText = $state('');
	let isServiceOpen = $state(false);

	// Estado para observação / comentário
	let showObservationBox = $state(false);
	let customComment = $state('');
	let selectedStatusForComment = $state<RuQueueStatus>('grande');

	const quickTags = [
		'⚡ Andando super rápido',
		'☀️ Fila debaixo de sol',
		'🍛 Cardápio tá caprichado',
		'💳 Catracas voando',
		'🍽️ Pouca fila na rampa'
	];

	function updateMealStatus() {
		const now = new Date();
		const hours = now.getHours();
		const minutes = now.getMinutes();
		const totalMinutes = hours * 60 + minutes;

		currentTimeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

		const lunchStart = 11 * 60 + 15; // 11:15
		const lunchEnd = 14 * 60;        // 14:00
		const dinnerStart = 17 * 60 + 30; // 17:30
		const dinnerEnd = 20 * 60;       // 20:00

		if (totalMinutes >= lunchStart && totalMinutes < lunchEnd) {
			isServiceOpen = true;
			mealStatusText = 'ALMOÇO ABERTO (encerra às 14h00)';
		} else if (totalMinutes >= dinnerStart && totalMinutes < dinnerEnd) {
			isServiceOpen = true;
			mealStatusText = 'JANTAR ABERTO (encerra às 20h00)';
		} else if (totalMinutes < lunchStart) {
			isServiceOpen = false;
			mealStatusText = 'PREPARANDO ALMOÇO (abre às 11h15)';
		} else if (totalMinutes >= lunchEnd && totalMinutes < dinnerStart) {
			isServiceOpen = false;
			mealStatusText = 'INTERVALO ENTRE TURNOS (jantar às 17h30)';
		} else {
			isServiceOpen = false;
			mealStatusText = 'REFEITÓRIO FECHADO NO MOMENTO';
		}
	}

	onMount(() => {
		updateMealStatus();
		const timer = setInterval(updateMealStatus, 15000);
		return () => clearInterval(timer);
	});

	function handleVote(status: RuQueueStatus) {
		selectedStatusForComment = status;
		gameStore.reportRuQueue(status);
	}

	function handleSubmitDetailedReport(e: SubmitEvent) {
		e.preventDefault();
		if (!customComment.trim()) return;
		gameStore.reportRuQueue(selectedStatusForComment, customComment.trim());
		customComment = '';
		showObservationBox = false;
	}

	function handleLikeReport(reportId: string) {
		gameStore.likeRuReport(reportId);
	}

	function selectQuickTag(tag: string) {
		if (customComment) {
			customComment = `${customComment} • ${tag}`;
		} else {
			customComment = tag;
		}
	}

	// Data formatada para o cabeçalho oficial
	const formattedTodayDate = new Intl.DateTimeFormat('pt-BR', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	}).format(new Date());
</script>

<!-- ============================================================ -->
<!-- FOLHA OFICIAL A4 DE COMUNICADO: CARDÁPIO & FILÔMETRO DO RU   -->
<!-- ============================================================ -->
<div class="relative w-full max-w-4xl mx-auto my-4">
	<!-- Grampos Metálicos Duplos no Topo da Folha A4 Fixando na Cortiça -->
	<Staple position="dual" class="z-20 -top-2.5" />

	<!-- Folha de Papel A4 Impressa com Bordas Físicas e Sombra Suave -->
	<article 
		class="relative bg-[#fefcf8] border border-[#d6cbbe] rounded-xs shadow-[0_12px_32px_rgba(35,16,5,0.28),inset_0_0_80px_rgba(235,224,208,0.3)] p-5 sm:p-8 md:p-10 text-stone-900 font-sans overflow-hidden transition-all duration-150"
	>
		<!-- ==================================================== -->
		<!-- CABEÇALHO OFICIAL INSTITUCIONAL DA UNIVERSIDADE      -->
		<!-- ==================================================== -->
		<header class="border-b-2 border-stone-800 pb-3.5 mb-5 select-none">
			<div class="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
				<!-- Brasão & Títulos Oficiais -->
				<div class="flex items-center gap-3">
					<!-- Selo Institucional Minimalista UnB -->
					<div class="w-12 h-12 rounded-sm border-2 border-stone-800 flex flex-col items-center justify-center p-0.5 bg-stone-100 shrink-0">
						<UtensilsCrossed class="w-6 h-6 text-stone-900" />
						<span class="text-[7.5px] font-mono font-black tracking-widest text-stone-800">UNB</span>
					</div>

					<div>
						<h1 class="font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-stone-900 leading-tight">
							UNIVERSIDADE DE BRASÍLIA • CAMPUS GAMA (FGA)
						</h1>
						<h2 class="font-sans text-[11px] sm:text-xs font-bold text-stone-700 uppercase tracking-widest mt-0.5">
							Diretoria de Gestão dos Restaurantes Universitários (RU)
						</h2>
						<span class="text-[10px] font-mono text-stone-500 block uppercase tracking-wider">
							Boletim Oficial de Cardápio & Previsão de Fila
						</span>
					</div>
				</div>

				<!-- Metadados de Tarifas e Acesso -->
				<div class="sm:text-right font-mono text-xs border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-300 w-full sm:w-auto">
					<div class="text-[10px] uppercase font-bold text-stone-600 mb-0.5">
						Tarifas Oficiais UnB
					</div>
					<div class="flex items-center sm:justify-end gap-1.5 flex-wrap justify-center">
						<span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold text-[11px]">
							Estudante: R$ 2,50
						</span>
						<span class="px-1.5 py-0.5 rounded bg-stone-200 text-stone-800 text-[10px]">
							Bolsista: Isento
						</span>
					</div>
				</div>
			</div>

			<!-- Faixa de Data e Status de Funcionamento em Tempo Real -->
			<div class="mt-3 pt-2.5 border-t border-dashed border-stone-300 flex flex-wrap items-center justify-between gap-2 text-xs">
				<div class="flex items-center gap-1.5 font-mono text-stone-700">
					<Calendar class="w-3.5 h-3.5 text-stone-500" />
					<span class="capitalize font-medium">{formattedTodayDate}</span>
				</div>

				<!-- Indicador do Turno Ativo -->
				<div class="flex items-center gap-2">
					<span class="px-2 py-0.5 rounded font-mono font-bold text-[11px] flex items-center gap-1.5 {isServiceOpen ? 'bg-emerald-700 text-white shadow-xs' : 'bg-stone-800 text-amber-200'}">
						{#if isServiceOpen}
							<span class="w-2 h-2 rounded-full bg-white animate-ping"></span>
						{:else}
							<span class="w-2 h-2 rounded-full bg-amber-400"></span>
						{/if}
						<span>{mealStatusText}</span>
					</span>
					<span class="text-[11px] font-mono text-stone-500 hidden md:inline">
						(Almoço 11:15-14h • Jantar 17:30-20h)
					</span>
				</div>
			</div>
		</header>

		<!-- ==================================================== -->
		<!-- NAVEGADOR DE DIAS DA SEMANA E SELETOR DE TURNO       -->
		<!-- ==================================================== -->
		<div class="bg-stone-100/90 rounded-md p-2.5 border border-stone-300 mb-5 flex flex-wrap items-center justify-between gap-2 select-none">
			<!-- Seletor dos Dias da Semana -->
			<div class="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-0.5">
				<span class="text-[10px] font-mono font-black uppercase text-stone-500 mr-1 hidden sm:inline">
					Dia:
				</span>
				{#each WEEKLY_RU_MENU as day}
					{@const isSelected = selectedDayOfWeek === day.dayOfWeek}
					{@const isToday = todayDayNumber === day.dayOfWeek}
					<button 
						type="button" 
						onclick={() => selectedDayOfWeek = day.dayOfWeek}
						class="px-2.5 py-1 rounded text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer {isSelected ? 'bg-stone-900 text-amber-100 shadow-xs scale-102' : 'bg-white hover:bg-stone-200 text-stone-700 border border-stone-300'}"
					>
						<span>{day.dayName.split('-')[0]}</span>
						{#if isToday}
							<span class="text-[9px] px-1 py-0.1 rounded font-black {isSelected ? 'bg-amber-400 text-stone-950' : 'bg-stone-900 text-white'}">
								Hoje
							</span>
						{/if}
					</button>
				{/each}
			</div>

			<!-- Alternador Almoço / Jantar -->
			<div class="flex items-center gap-1 bg-white p-1 rounded border border-stone-300 text-xs font-mono">
				<button 
					type="button" 
					onclick={() => selectedTurn = 'lunch'}
					class="px-2.5 py-1 rounded font-bold transition-all cursor-pointer {selectedTurn === 'lunch' ? 'bg-amber-100 text-amber-950 border border-amber-300' : 'text-stone-600 hover:text-stone-900'}"
				>
					☀️ Almoço
				</button>
				<button 
					type="button" 
					onclick={() => selectedTurn = 'dinner'}
					class="px-2.5 py-1 rounded font-bold transition-all cursor-pointer {selectedTurn === 'dinner' ? 'bg-indigo-100 text-indigo-950 border border-indigo-300' : 'text-stone-600 hover:text-stone-900'}"
				>
					🌙 Jantar
				</button>
			</div>
		</div>

		<!-- ==================================================== -->
		<!-- DESTAQUE DO PRATO PRINCIPAL & ALERTA DE HYPE         -->
		<!-- ==================================================== -->
		<div class="rounded-lg p-4 sm:p-5 border-2 mb-5 transition-all {
			hypeAnalysis.isHyped 
				? 'bg-amber-50/90 border-amber-500 shadow-xs' 
				: 'bg-stone-50/90 border-stone-300'
		}">
			<div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
				<div>
					<div class="flex items-center gap-2 flex-wrap mb-1">
						<span class="text-[10px] font-mono font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-stone-200 text-stone-800">
							{currentDayMenu.dayName} • {selectedTurn === 'lunch' ? 'Almoço' : 'Jantar'}
						</span>

						<!-- Carimbo de Alerta para Comida Muito Concorrida (Lasanha, Strogonoff, etc.) -->
						{#if hypeAnalysis.isHyped}
							<span class="font-mono font-black text-xs px-2 py-0.5 rounded bg-rose-600 text-white tracking-wide shadow-xs flex items-center gap-1 animate-pulse">
								<Flame class="w-3.5 h-3.5" />
								<span>{hypeAnalysis.badgeText}</span>
							</span>
						{/if}
					</div>

					<!-- Nome Gigante do Prato Principal -->
					<h3 class="font-sans font-black text-xl sm:text-2xl text-stone-950 leading-snug">
						{currentMeal.mainDish}
					</h3>

					<!-- Opção Vegana / Vegetariana -->
					<div class="mt-2 text-xs text-emerald-950 font-medium flex items-start gap-1.5 bg-emerald-50 px-2.5 py-1.5 rounded border border-emerald-200">
						<strong class="font-bold shrink-0">Opção Vegana:</strong>
						<span>{currentMeal.veganOption}</span>
					</div>
				</div>

				<!-- Aviso de Impacto na Fila para Prato Concorrido -->
				{#if hypeAnalysis.isHyped}
					<div class="sm:text-right shrink-0 bg-white/90 p-3 rounded-md border border-amber-300">
						<span class="text-[10px] font-mono font-black uppercase text-rose-700 block">
							Previsão Automática
						</span>
						<span class="font-sans font-black text-base text-rose-900 block leading-tight">
							FILA ALTA / QUILOMÉTRICA
						</span>
						<span class="text-[10px] text-stone-600 font-mono mt-0.5 block">
							Alta procura prevista
						</span>
					</div>
				{/if}
			</div>

			<!-- Itens Complementares da Refeição (Bandejão Completo) -->
			<div class="mt-3.5 pt-3 border-t border-black/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs text-stone-800">
				<div class="bg-white/70 p-2 rounded border border-stone-200">
					<span class="font-bold text-stone-900 block text-[10px] font-mono uppercase text-stone-500">Guarnição</span>
					<span class="leading-tight">{currentMeal.garnish}</span>
				</div>
				<div class="bg-white/70 p-2 rounded border border-stone-200">
					<span class="font-bold text-stone-900 block text-[10px] font-mono uppercase text-stone-500">Acompanhamentos</span>
					<span class="leading-tight">{currentMeal.sideDishes}</span>
				</div>
				<div class="bg-white/70 p-2 rounded border border-stone-200">
					<span class="font-bold text-stone-900 block text-[10px] font-mono uppercase text-stone-500">Saladas</span>
					<span class="leading-tight">{currentMeal.salad}</span>
				</div>
				<div class="bg-white/70 p-2 rounded border border-stone-200">
					<span class="font-bold text-stone-900 block text-[10px] font-mono uppercase text-stone-500">Sobremesa & Suco</span>
					<span class="leading-tight">{currentMeal.dessert} • {currentMeal.drink}</span>
				</div>
			</div>
		</div>

		<!-- ==================================================== -->
		<!-- FILÔMETRO DO RU: STATUS DA FILA & TEMPO ESTIMADO     -->
		<!-- ==================================================== -->
		<div class="border-2 rounded-lg p-4 sm:p-5 mb-5 transition-colors {
			$ru.currentStatus === 'vazia' ? 'bg-emerald-50/80 border-emerald-400' :
			$ru.currentStatus === 'moderada' ? 'bg-amber-50/80 border-amber-400' :
			$ru.currentStatus === 'grande' ? 'bg-orange-50/80 border-orange-400' :
			'bg-rose-50/80 border-rose-400'
		}">
			<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
				<div>
					<div class="flex items-center gap-2 mb-1">
						<span class="text-[10px] font-mono font-black uppercase text-stone-500 tracking-wider">
							Filômetro Oficial do Campus
						</span>
						{#if hypeAnalysis.isHyped}
							<span class="text-[9px] font-mono font-bold bg-amber-200 text-amber-950 px-1 rounded">
								Ajustado p/ Prato Nobre
							</span>
						{/if}
					</div>

					<div class="flex items-center gap-2.5">
						<!-- Ponto luminoso pulsante -->
						<span class="relative flex h-3.5 w-3.5">
							<span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 {
								$ru.currentStatus === 'vazia' ? 'bg-emerald-500' :
								$ru.currentStatus === 'moderada' ? 'bg-amber-500' :
								$ru.currentStatus === 'grande' ? 'bg-orange-500' :
								'bg-rose-500'
							}"></span>
							<span class="relative inline-flex rounded-full h-3.5 w-3.5 {
								$ru.currentStatus === 'vazia' ? 'bg-emerald-600' :
								$ru.currentStatus === 'moderada' ? 'bg-amber-600' :
								$ru.currentStatus === 'grande' ? 'bg-orange-600' :
								'bg-rose-600'
							}"></span>
						</span>

						<h4 class="font-sans font-black text-lg sm:text-xl {
							$ru.currentStatus === 'vazia' ? 'text-emerald-950' :
							$ru.currentStatus === 'moderada' ? 'text-amber-950' :
							$ru.currentStatus === 'grande' ? 'text-orange-950' :
							'text-rose-950'
						}">
							{#if $ru.currentStatus === 'vazia'}
								Fila Tranquila / Vazia (&lt; 5 min)
							{:else if $ru.currentStatus === 'moderada'}
								Fila Moderada (~12 min)
							{:else if $ru.currentStatus === 'grande'}
								Fila Grande (~25 min)
							{:else}
								Fila Quilométrica (35+ min)
							{/if}
						</h4>
					</div>

					<p class="text-xs text-stone-600 mt-1">
						{#if $ru.currentStatus === 'vazia'}
							Bandejão com fluxo livre! Quase sem fila nas catracas.
						{:else if $ru.currentStatus === 'moderada'}
							Fila normal dentro da rampa coberta. Andando rápido.
						{:else if $ru.currentStatus === 'grande'}
							Fila saindo na área externa antes do refeitório.
						{:else}
							Fila virando a curva e no gramado!
						{/if}
					</p>
				</div>

				<!-- Grande Indicador de Tempo Estimado de Espera -->
				<div class="sm:text-right shrink-0 bg-white/90 p-3 rounded border border-black/10">
					<span class="text-[10px] font-mono font-bold text-stone-500 uppercase block">
						Tempo Médio de Espera
					</span>
					<span class="font-mono font-black text-2xl sm:text-3xl tracking-tight {
						$ru.currentStatus === 'vazia' ? 'text-emerald-700' :
						$ru.currentStatus === 'moderada' ? 'text-amber-700' :
						$ru.currentStatus === 'grande' ? 'text-orange-700' :
						'text-rose-700'
					}">
						~{$ru.estimatedWaitMinutes} min
					</span>
				</div>
			</div>

			<!-- Barra de Medição Visual de 4 Níveis -->
			<div class="mt-3.5 space-y-1">
				<div class="grid grid-cols-4 gap-1.5 h-2.5">
					<div class="rounded-xs transition-all {$ru.currentStatus === 'vazia' || $ru.currentStatus === 'moderada' || $ru.currentStatus === 'grande' || $ru.currentStatus === 'lotada' ? 'bg-emerald-500' : 'bg-stone-200'}"></div>
					<div class="rounded-xs transition-all {$ru.currentStatus === 'moderada' || $ru.currentStatus === 'grande' || $ru.currentStatus === 'lotada' ? 'bg-amber-500' : 'bg-stone-200'}"></div>
					<div class="rounded-xs transition-all {$ru.currentStatus === 'grande' || $ru.currentStatus === 'lotada' ? 'bg-orange-500' : 'bg-stone-200'}"></div>
					<div class="rounded-xs transition-all {$ru.currentStatus === 'lotada' ? 'bg-rose-600' : 'bg-stone-200'}"></div>
				</div>

				<div class="flex items-center justify-between text-[9px] font-mono text-stone-500 pt-0.5">
					<span class="text-emerald-800 font-bold">Tranquila (&lt;5m)</span>
					<span class="text-amber-800 font-bold">Moderada (~12m)</span>
					<span class="text-orange-800 font-bold">Grande (~25m)</span>
					<span class="text-rose-800 font-bold">Lotada (35m+)</span>
				</div>
			</div>

			<div class="mt-2.5 pt-2 border-t border-black/10 flex items-center justify-between text-[11px] font-mono text-stone-600">
				<span>Última atualização: <strong>{$ru.lastUpdated}</strong></span>
				<span>{$ru.communityVotes.vazia + $ru.communityVotes.moderada + $ru.communityVotes.grande + $ru.communityVotes.lotada} relatos registrados</span>
			</div>
		</div>

		<!-- ==================================================== -->
		<!-- CARIMBOS FÍSICOS DE VALIDAÇÃO DOS ALUNOS NA FOLHA    -->
		<!-- ==================================================== -->
		<div class="border-2 border-dashed border-stone-400 rounded-lg p-4 bg-stone-50/90 mb-5 select-none">
			<div class="flex items-center justify-between gap-2 mb-2.5">
				<div class="flex items-center gap-2">
					<span class="font-mono font-black text-xs uppercase tracking-wider text-stone-900">
						Está no RU agora? Carimbe a situação real:
					</span>
					<span class="text-[10px] font-mono font-bold bg-amber-200 text-amber-950 px-1.5 py-0.2 rounded border border-amber-300">
						+20 XP
					</span>
				</div>

				<button 
					type="button" 
					onclick={() => showObservationBox = !showObservationBox}
					class="text-[11px] font-bold text-sky-800 hover:text-sky-950 flex items-center gap-1 hover:underline cursor-pointer"
				>
					<MessageSquare class="w-3 h-3" />
					<span>{showObservationBox ? 'Fechar nota' : '+ Adicionar nota'}</span>
				</button>
			</div>

			<!-- 4 Carimbos com Tinta Batidos na Folha -->
			<div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
				<!-- TRANQUILA -->
				<button 
					type="button" 
					onclick={() => handleVote('vazia')}
					class="py-2.5 px-2 border-2 border-dashed rounded font-mono font-black text-xs uppercase tracking-wider transition-all active:scale-90 flex flex-col items-center justify-center cursor-pointer {$ru.userLastVotedStatus === 'vazia' ? 'border-emerald-800 bg-emerald-200 text-emerald-950 shadow-inner -rotate-2 scale-105 ring-2 ring-emerald-500/50' : 'border-emerald-700/60 text-emerald-800 bg-emerald-500/10 hover:bg-emerald-500/20 -rotate-1'}"
					title="Carimbar que a fila está tranquila"
				>
					<span class="flex items-center gap-1">
						<Check class="w-3.5 h-3.5" /> TRANQUILA
					</span>
					<span class="text-[10px] font-sans font-bold opacity-80 mt-0.5">
						&lt; 5m ({$ru.communityVotes.vazia})
					</span>
				</button>

				<!-- MODERADA -->
				<button 
					type="button" 
					onclick={() => handleVote('moderada')}
					class="py-2.5 px-2 border-2 border-dashed rounded font-mono font-black text-xs uppercase tracking-wider transition-all active:scale-90 flex flex-col items-center justify-center cursor-pointer {$ru.userLastVotedStatus === 'moderada' ? 'border-amber-800 bg-amber-200 text-amber-950 shadow-inner rotate-2 scale-105 ring-2 ring-amber-500/50' : 'border-amber-700/60 text-amber-900 bg-amber-500/10 hover:bg-amber-500/20 rotate-1'}"
					title="Carimbar que a fila está moderada"
				>
					<span class="flex items-center gap-1">
						<Clock class="w-3.5 h-3.5" /> MODERADA
					</span>
					<span class="text-[10px] font-sans font-bold opacity-80 mt-0.5">
						~12m ({$ru.communityVotes.moderada})
					</span>
				</button>

				<!-- GRANDE -->
				<button 
					type="button" 
					onclick={() => handleVote('grande')}
					class="py-2.5 px-2 border-2 border-dashed rounded font-mono font-black text-xs uppercase tracking-wider transition-all active:scale-90 flex flex-col items-center justify-center cursor-pointer {$ru.userLastVotedStatus === 'grande' ? 'border-orange-800 bg-orange-200 text-orange-950 shadow-inner -rotate-2 scale-105 ring-2 ring-orange-500/50' : 'border-orange-700/60 text-orange-900 bg-orange-500/10 hover:bg-orange-500/20 -rotate-1'}"
					title="Carimbar que a fila está grande"
				>
					<span class="flex items-center gap-1">
						<AlertCircle class="w-3.5 h-3.5" /> GRANDE
					</span>
					<span class="text-[10px] font-sans font-bold opacity-80 mt-0.5">
						~25m ({$ru.communityVotes.grande})
					</span>
				</button>

				<!-- LOTADA -->
				<button 
					type="button" 
					onclick={() => handleVote('lotada')}
					class="py-2.5 px-2 border-2 border-dashed rounded font-mono font-black text-xs uppercase tracking-wider transition-all active:scale-90 flex flex-col items-center justify-center cursor-pointer {$ru.userLastVotedStatus === 'lotada' ? 'border-rose-800 bg-rose-200 text-rose-950 shadow-inner rotate-2 scale-105 ring-2 ring-rose-500/50' : 'border-rose-700/60 text-rose-800 bg-rose-500/10 hover:bg-rose-500/20 rotate-1'}"
					title="Carimbar que a fila está lotada"
				>
					<span class="flex items-center gap-1">
						<Users class="w-3.5 h-3.5" /> LOTADA
					</span>
					<span class="text-[10px] font-sans font-bold opacity-80 mt-0.5">
						35m+ ({$ru.communityVotes.lotada})
					</span>
				</button>
			</div>

			<!-- Campo de Observação Opcional -->
			{#if showObservationBox}
				<form onsubmit={handleSubmitDetailedReport} class="mt-3 pt-3 border-t border-stone-300">
					<div class="mb-2">
						<span class="text-[11px] font-bold text-stone-700 block mb-1">
							Adicione um detalhe da fila para os colegas da FGA:
						</span>

						<!-- Tags rápidas clicáveis -->
						<div class="flex items-center gap-1 flex-wrap mb-2">
							{#each quickTags as tag}
								<button 
									type="button" 
									onclick={() => selectQuickTag(tag)}
									class="text-[10px] px-2 py-0.5 rounded bg-white hover:bg-amber-100 border border-stone-300 text-stone-700 cursor-pointer active:scale-95 transition-all"
								>
									{tag}
								</button>
							{/each}
						</div>

						<div class="flex items-center gap-1.5">
							<input 
								type="text" 
								bind:value={customComment}
								placeholder="Ex: Fila tá rápida nas duas catracas, comida excelente hoje..."
								class="flex-1 text-xs px-3 py-2 rounded bg-white border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 placeholder:text-stone-400"
								maxlength="140"
							/>
							<button 
								type="submit" 
								class="px-3.5 py-2 rounded bg-amber-300 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer shrink-0 border border-amber-500"
							>
								<Send class="w-3.5 h-3.5 text-stone-950" />
								<span>Enviar (+25 XP)</span>
							</button>
						</div>
					</div>
				</form>
			{/if}
		</div>

		<!-- ==================================================== -->
		<!-- RELATOS RECENTES DOS ESTUDANTES                      -->
		<!-- ==================================================== -->
		<div class="bg-stone-50/90 rounded border border-stone-200 p-3.5 mb-5">
			<div class="flex items-center justify-between pb-2 border-b border-stone-300 mb-2.5">
				<span class="font-mono font-bold text-xs uppercase text-stone-800 flex items-center gap-1.5">
					<MessageSquare class="w-3.5 h-3.5 text-stone-600" />
					Relatos Recentes dos Estudantes ({$ru.recentReports.length})
				</span>
				<span class="text-[10px] font-mono text-stone-500">
					Atualizado ao vivo
				</span>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
				{#each $ru.recentReports as rep (rep.id)}
					<div class="p-2.5 rounded bg-white border border-stone-200 text-xs shadow-2xs font-sans flex flex-col justify-between">
						<div>
							<div class="flex items-center justify-between gap-1 mb-1">
								<div class="flex items-center gap-1.5 flex-wrap">
									<span class="font-bold text-stone-900">
										{rep.studentName}
									</span>
									{#if rep.studentCourse}
										<span class="text-[10px] text-stone-500 font-mono">
											({rep.studentCourse})
										</span>
									{/if}

									<span class="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded {
										rep.status === 'vazia' ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' :
										rep.status === 'moderada' ? 'bg-amber-100 text-amber-950 border border-amber-300' :
										rep.status === 'grande' ? 'bg-orange-100 text-orange-950 border border-orange-300' :
										'bg-rose-100 text-rose-950 border border-rose-300'
									}">
										{rep.status === 'vazia' ? '🟢 Tranquila' : rep.status === 'moderada' ? '🟡 Moderada' : rep.status === 'grande' ? '🟠 Grande' : '🔴 Lotada'}
									</span>
								</div>

								<span class="text-[10px] font-mono text-stone-400 shrink-0">
									{rep.timestamp}
								</span>
							</div>

							{#if rep.comment}
								<p class="text-[11px] text-stone-700 leading-tight my-1">
									"{rep.comment}"
								</p>
							{/if}
						</div>

						<div class="flex items-center justify-end pt-1">
							<button 
								type="button" 
								onclick={() => handleLikeReport(rep.id)}
								class="inline-flex items-center gap-1 text-[10px] font-mono text-stone-500 hover:text-amber-800 transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-stone-100 active:scale-95"
								title="Marcar relato como útil"
							>
								<ThumbsUp class="w-3 h-3" />
								<span>{rep.likes ?? 0} útil</span>
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- ==================================================== -->
		<!-- RODAPÉ DA FOLHA A4 COM CARIMBO DE EXPEDIÇÃO          -->
		<!-- ==================================================== -->
		<footer class="pt-3 border-t-2 border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-600 font-mono select-none">
			<div class="flex items-center gap-2">
				<span class="font-bold uppercase tracking-wider text-stone-700">
					Campus UnB Gama • FGA
				</span>
				<span>•</span>
				<span>Diretoria do RU</span>
			</div>

			<a 
				href="https://ru.unb.br/" 
				target="_blank" 
				rel="noreferrer"
				class="font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1 hover:underline"
				title="Consultar portal da Diretoria do RU da Universidade de Brasília"
			>
				<span>Portal Oficial ru.unb.br</span>
				<ExternalLink class="w-3 h-3" />
			</a>
		</footer>
	</article>
</div>
