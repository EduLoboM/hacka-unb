<script lang="ts">
	import { gameStore } from '$lib/stores/gameStore';
	import Pin from '$lib/components/Pin.svelte';
	import WashiTape from '$lib/components/WashiTape.svelte';
	import GamificationSidebar from '$lib/components/GamificationSidebar.svelte';
	import StudentBadge from '$lib/components/StudentBadge.svelte';
	import StudentIdCardModal from '$lib/components/StudentIdCardModal.svelte';
	import CaravanaCard from '$lib/components/cards/CaravanaCard.svelte';
	import BusCard from '$lib/components/cards/BusCard.svelte';
	import NoticeCard from '$lib/components/cards/NoticeCard.svelte';
	import RuCard from '$lib/components/cards/RuCard.svelte';
	import CreatePostModal from '$lib/components/CreatePostModal.svelte';
	import { 
		ShieldAlert, 
		Toolbox, 
		Megaphone, 
		Plus, 
		Filter, 
		Volume2, 
		VolumeX, 
		Sparkles, 
		Flame, 
		X, 
		Award,
		IdCard,
		UtensilsCrossed,
		RefreshCw,
		Landmark,
		Building2
	} from 'lucide-svelte';
	import InstagramIcon from '$lib/components/InstagramIcon.svelte';
	import CockroachIcon from '$lib/components/CockroachIcon.svelte';

	// Stores reativas
	const user = gameStore.user;
	const caravanas = gameStore.caravanas;
	const buses = gameStore.buses;
	const ru = gameStore.ru;
	const notices = gameStore.notices;

	// Estados locais com Svelte 5 Runes
	let activeTab = $state<'chamados' | 'toolbox' | 'avisos'>('chamados');
	let chamadosFilter = $state<'todos' | 'caravana' | 'squad' | 'reporte' | 'denuncia'>('todos');
	let toolboxFilter = $state<'todos' | 'ru' | 'onibus'>('todos');
	let avisosFilter = $state<string>('Todos');
	let isCreateModalOpen = $state(false);
	let isProfileDrawerOpen = $state(false);
	let isStudentIdCardOpen = $state(false);
	let isSyncing = $state(false);

	// Contagens reativas
	let activeCaravanasCount = $derived($caravanas.length);
	let denunciasCount = $derived($caravanas.filter((c) => c.type === 'denuncia').length);
	let busesCount = $derived($buses.length);
	let toolboxTotalCount = $derived($buses.length + 1);
	let activeNoticesCount = $derived($notices.length);
	let decanatosCount = $derived($notices.filter((n) => n.category === 'Decanatos').length);
	let ejsCount = $derived($notices.filter((n) => n.category === 'Empresas Juniores').length);

	// Filtros reativos
	let filteredCaravanas = $derived(
		chamadosFilter === 'todos' 
			? $caravanas 
			: $caravanas.filter((c) => c.type === chamadosFilter)
	);

	let filteredNotices = $derived(
		avisosFilter === 'Todos'
			? $notices
			: $notices.filter((n) => n.category === avisosFilter)
	);

	let noticeCategories = $derived([
		{ id: 'Todos', label: 'Todos', count: activeNoticesCount },
		{ id: 'Decanatos', label: '🏛️ Decanatos UnB', count: decanatosCount },
		{ id: 'Empresas Juniores', label: '🚀 Empresas Juniores', count: ejsCount },
		{ id: 'Edital', label: 'Editais', count: $notices.filter((n) => n.category === 'Edital').length },
		{ id: 'Extensão', label: 'Extensão', count: $notices.filter((n) => n.category === 'Extensão').length },
		{ id: 'Eventos', label: 'Eventos', count: $notices.filter((n) => n.category === 'Eventos').length }
	]);

	function handleSyncInstagram() {
		isSyncing = true;
		setTimeout(() => {
			gameStore.syncInstagramFeeds();
			isSyncing = false;
		}, 600);
	}
</script>

<!-- Moldura de Madeira ao Redor de Todo o Quadro de Cortiça -->
<div class="min-h-screen bg-[#381e0b] p-2 sm:p-4 md:p-6 flex flex-col">
	<div class="flex-1 flex flex-col rounded-2xl border-8 sm:border-12 md:border-14 border-[#522d14] shadow-[inset_0_2px_8px_rgba(255,255,255,0.2),inset_0_-4px_12px_rgba(0,0,0,0.8),0_20px_50px_rgba(0,0,0,0.6)] cork-texture relative overflow-hidden">
		
		<!-- Sombra Interna da Moldura de Madeira na Cortiça -->
		<div class="absolute inset-0 pointer-events-none shadow-[inset_0_8px_25px_rgba(30,12,5,0.7),inset_0_0_50px_rgba(20,8,2,0.4)] z-5"></div>

		<!-- ========================================== -->
		<!-- BARRA SUPERIOR (HEADER NA CORTIÇA)        -->
		<!-- ========================================== -->
		<header class="relative z-10 px-3 sm:px-5 py-2.5 sm:py-3 border-b-2 border-[#8b5e34]/70 bg-gradient-to-r from-[#8a5d32]/45 via-[#996e3d]/35 to-[#8a5d32]/45 backdrop-blur-[3px] flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 shadow-md">
			<!-- Logo / Placa de Metal Universitária -->
			<div class="flex items-center gap-2.5">
				<div class="relative bg-gradient-to-b from-[#e3c18b] via-[#c49857] to-[#875b22] text-stone-950 px-3 sm:px-4 py-1.5 sm:py-2 rounded-sm border-2 border-[#633e10] shadow-[0_4px_10px_rgba(0,0,0,0.35),inset_0_1px_2px_rgba(255,255,255,0.7)] flex items-center gap-2 sm:gap-2.5 select-none">
					<!-- Parafuso de latão chanfrado esquerdo -->
					<div class="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-400/80 shadow-inner flex items-center justify-center">
						<div class="w-1.5 h-0.5 bg-stone-400 rotate-45"></div>
					</div>
					<div>
						<div class="flex items-center gap-1.5">
							<h1 class="font-black text-base sm:text-lg tracking-tight leading-none font-sans text-stone-950">
								HUB FGA
							</h1>
							<span class="text-[8px] font-mono font-black px-1 py-0.2 rounded bg-stone-950/20 text-stone-950 border border-stone-950/30">
								UnB
							</span>
						</div>
						<span class="text-[8px] sm:text-[9px] uppercase tracking-widest font-black text-amber-950 block mt-0.5">
							Mural Universitário
						</span>
					</div>
					<!-- Parafuso de latão chanfrado direito -->
					<div class="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-400/80 shadow-inner flex items-center justify-center">
						<div class="w-1.5 h-0.5 bg-stone-400 -rotate-45"></div>
					</div>
				</div>
			</div>

			<!-- Abas Centrais Estilo Washi Tape / Carimbos -->
			<nav class="flex items-center gap-2 overflow-x-auto py-1 order-3 lg:order-2 w-full lg:w-auto justify-center" aria-label="Navegação do Mural">
				<button 
					type="button" 
					onclick={() => activeTab = 'chamados'}
					class="relative px-3.5 sm:px-4 py-1.5 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-sm transition-all duration-150 flex items-center gap-1.5 select-none active:scale-95 cursor-pointer {activeTab === 'chamados' ? 'bg-amber-100 text-stone-950 shadow-md border-b-3 border-amber-500 -rotate-1 font-black scale-105' : 'bg-amber-100/70 text-stone-900 hover:bg-amber-100 border border-stone-400/40'}"
				>
					<ShieldAlert class="w-4 h-4 text-rose-600" />
					<span>Chamados</span>
					<span class="text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold {activeTab === 'chamados' ? 'bg-amber-300 text-stone-950 border border-amber-500' : 'bg-black/15 text-stone-950'}">
						{activeCaravanasCount}
					</span>
				</button>

				<button 
					type="button" 
					onclick={() => activeTab = 'toolbox'}
					class="relative px-3.5 sm:px-4 py-1.5 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-sm transition-all duration-150 flex items-center gap-1.5 select-none active:scale-95 cursor-pointer {activeTab === 'toolbox' ? 'bg-sky-100 text-stone-950 shadow-md border-b-3 border-sky-500 rotate-1 font-black scale-105' : 'bg-sky-100/70 text-stone-900 hover:bg-sky-100 border border-stone-400/40'}"
				>
					<Toolbox class="w-4 h-4 text-sky-700" />
					<span>Toolbox</span>
					<span class="text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold {activeTab === 'toolbox' ? 'bg-sky-300 text-stone-950 border border-sky-400' : 'bg-black/15 text-stone-950'}">
						{toolboxTotalCount}
					</span>
				</button>

				<button 
					type="button" 
					onclick={() => activeTab = 'avisos'}
					class="relative px-3.5 sm:px-4 py-1.5 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-sm transition-all duration-150 flex items-center gap-1.5 select-none active:scale-95 cursor-pointer {activeTab === 'avisos' ? 'bg-rose-100 text-stone-950 shadow-md border-b-3 border-rose-500 -rotate-1 font-black scale-105' : 'bg-rose-100/70 text-stone-900 hover:bg-rose-100 border border-stone-400/40'}"
				>
					<Megaphone class="w-4 h-4 text-amber-700" />
					<span>Avisos</span>
					<span class="text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold {activeTab === 'avisos' ? 'bg-rose-300 text-stone-950 border border-rose-400' : 'bg-black/15 text-stone-950'}">
						{activeNoticesCount}
					</span>
				</button>
			</nav>

			<!-- Ações da Direita: Botão da Pessoa (Crachá), Áudio e Botão Novo Post-it -->
			<div class="flex items-center gap-2 sm:gap-2.5 order-2 lg:order-3">
				<!-- Botão da Pessoa: Crachá / Carteirinha Estudantil da UnB (abre por cima ao clicar) -->
				<StudentBadge onOpenQuests={() => isStudentIdCardOpen = true} />

				<!-- Controle de Efeitos Sonoros -->
				<button 
					type="button" 
					onclick={() => gameStore.toggleSound()}
					class="p-2 sm:p-2.5 rounded-full bg-stone-900/50 hover:bg-stone-900/75 text-amber-200 hover:text-amber-100 transition-colors shadow-xs border border-amber-900/30 cursor-pointer active:scale-95"
					title={$user.soundEnabled ? 'Silenciar Áudio' : 'Ativar Efeitos Sonoros'}
					aria-label="Controle de Som"
				>
					{#if $user.soundEnabled}
						<Volume2 class="w-4 h-4" />
					{:else}
						<VolumeX class="w-4 h-4 text-stone-400" />
					{/if}
				</button>

				<!-- Botão Fixar Post-it no Mural -->
				<button 
					type="button" 
					onclick={() => isCreateModalOpen = true}
					class="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-md font-black text-xs bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 text-stone-950 shadow-md border border-amber-600/70 active:scale-95 transition-all cursor-pointer"
				>
					<Plus class="w-4 h-4 text-stone-950 stroke-[2.5]" />
					<span>Fixar Post-it</span>
				</button>
			</div>
		</header>

		<!-- Sub-Barra de Filtros Contextuais -->
		<div class="relative z-10 px-4 sm:px-6 py-2.5 bg-black/15 border-b border-[#8b5e34]/40 flex items-center justify-between gap-3 overflow-x-auto">
			<div class="flex items-center gap-2 text-xs">
				<span class="text-amber-100/80 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1 shrink-0">
					<Filter class="w-3.5 h-3.5" />
					Filtrar:
				</span>

				{#if activeTab === 'chamados'}
					<button 
						type="button" 
						onclick={() => chamadosFilter = 'todos'}
						class="px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer {chamadosFilter === 'todos' ? 'bg-amber-100 text-stone-950 shadow-xs ring-1 ring-amber-900/20' : 'bg-white/80 hover:bg-white text-stone-900 border border-stone-300'}"
					>
						Todos
					</button>
					<button 
						type="button" 
						onclick={() => chamadosFilter = 'caravana'}
						class="px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer {chamadosFilter === 'caravana' ? 'bg-amber-100 text-stone-950 shadow-xs ring-1 ring-amber-900/20' : 'bg-white/80 hover:bg-white text-stone-900 border border-stone-300'}"
					>
						Caravanas 480
					</button>
					<button 
						type="button" 
						onclick={() => chamadosFilter = 'squad'}
						class="px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer {chamadosFilter === 'squad' ? 'bg-amber-100 text-stone-950 shadow-xs ring-1 ring-amber-900/20' : 'bg-white/80 hover:bg-white text-stone-900 border border-stone-300'}"
					>
						Squads PI
					</button>
					<button 
						type="button" 
						onclick={() => chamadosFilter = 'reporte'}
						class="px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer {chamadosFilter === 'reporte' ? 'bg-amber-100 text-stone-950 shadow-xs ring-1 ring-amber-900/20' : 'bg-white/80 hover:bg-white text-stone-900 border border-stone-300'}"
					>
						Alertas
					</button>
					<button 
						type="button" 
						onclick={() => chamadosFilter = 'denuncia'}
						class="px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer {chamadosFilter === 'denuncia' ? 'bg-amber-100 text-stone-950 shadow-xs ring-1 ring-amber-900/20' : 'bg-white/80 hover:bg-white text-stone-900 border border-stone-300'}"
					>
						<CockroachIcon size={14} class="text-stone-950" />
						<span>Denúncias</span>
						<span class="text-[10px] px-1.5 py-0.2 rounded-full font-mono {chamadosFilter === 'denuncia' ? 'bg-rose-200 text-stone-950 border border-rose-400 font-bold' : 'bg-black/10 text-stone-950'}">
							{denunciasCount}
						</span>
					</button>

				{:else if activeTab === 'toolbox'}
					<div class="flex items-center gap-1.5 flex-wrap">
						<button 
							type="button" 
							onclick={() => toolboxFilter = 'todos'}
							class="px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer {toolboxFilter === 'todos' ? 'bg-sky-100 text-stone-950 shadow-xs ring-1 ring-sky-900/20' : 'bg-white/80 hover:bg-white text-stone-900 border border-stone-300'}"
						>
							Todos
						</button>
						<button 
							type="button" 
							onclick={() => toolboxFilter = 'ru'}
							class="px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer {toolboxFilter === 'ru' ? 'bg-sky-100 text-stone-950 shadow-xs ring-1 ring-sky-900/20' : 'bg-white/80 hover:bg-white text-stone-900 border border-stone-300'}"
						>
							<UtensilsCrossed class="w-3.5 h-3.5 text-amber-700" />
							<span>Fila do RU</span>
							<span class="text-[10px] px-1.5 py-0.2 rounded font-mono font-black {
								$ru.currentStatus === 'vazia' ? 'bg-emerald-200 text-stone-950 border border-emerald-400' :
								$ru.currentStatus === 'moderada' ? 'bg-amber-200 text-stone-950 border border-amber-400' :
								$ru.currentStatus === 'grande' ? 'bg-orange-200 text-stone-950 border border-orange-400' :
								'bg-rose-200 text-stone-950 border border-rose-400'
							}">
								~{$ru.estimatedWaitMinutes}m
							</span>
						</button>
						<button 
							type="button" 
							onclick={() => toolboxFilter = 'onibus'}
							class="px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 cursor-pointer {toolboxFilter === 'onibus' ? 'bg-sky-100 text-stone-950 shadow-xs ring-1 ring-sky-900/20' : 'bg-white/80 hover:bg-white text-stone-900 border border-stone-300'}"
						>
							<span>Ônibus SEMOB</span>
							<span class="text-[10px] px-1.5 py-0.2 rounded-full font-mono {toolboxFilter === 'onibus' ? 'bg-sky-200 text-stone-950 border border-sky-400 font-bold' : 'bg-black/10 text-stone-950'}">
								{busesCount}
							</span>
						</button>
					</div>

				{:else if activeTab === 'avisos'}
					<div class="flex items-center gap-1.5 flex-wrap">
						{#each noticeCategories as cat}
							<button 
								type="button" 
								onclick={() => avisosFilter = cat.id}
								class="px-2.5 py-1 rounded text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer {avisosFilter === cat.id ? 'bg-amber-100 text-stone-950 shadow-xs ring-1 ring-amber-900/20' : 'bg-white/80 hover:bg-white text-stone-900 border border-stone-300'}"
							>
								<span>{cat.label}</span>
								<span class="text-[10px] px-1.5 py-0.2 rounded-full font-mono {avisosFilter === cat.id ? 'bg-amber-300 text-stone-950 font-black border border-amber-400' : 'bg-black/10 text-stone-950'}">
									{cat.count}
								</span>
							</button>
						{/each}
					</div>
				{/if}
			</div>

			{#if activeTab === 'avisos'}
				<!-- Botão de Sincronização Dinâmica com Instagram dos Decanatos e EJs -->
				<div class="flex items-center gap-2 shrink-0">
					<button
						type="button"
						onclick={handleSyncInstagram}
						class="inline-flex items-center gap-1.5 px-3 py-1 rounded font-bold text-xs bg-amber-200 hover:bg-amber-300 text-stone-950 border border-amber-500 shadow-xs active:scale-95 transition-all cursor-pointer {isSyncing ? 'opacity-75' : ''}"
						disabled={isSyncing}
						title="Sincronizar feeds mais recentes dos Instagrams da UnB e EJs (+15 XP)"
					>
						<RefreshCw class="w-3.5 h-3.5 text-stone-950 {isSyncing ? 'animate-spin' : ''}" />
						<span class="hidden sm:inline">{isSyncing ? 'Sincronizando...' : 'Sincronizar Feeds'}</span>
						<span class="text-[10px] text-stone-950 font-mono font-black bg-amber-400 px-1 py-0.2 rounded border border-amber-500">+15 XP</span>
					</button>
				</div>
			{:else}
				<!-- Indicador de Status Comunitário -->
				<div class="hidden md:flex items-center gap-2 text-xs text-amber-200 font-mono">
					<span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
					<span>Mural Universitário • Gama/DF</span>
				</div>
			{/if}
		</div>

		<!-- ========================================== -->
		<!-- CORPO PRINCIPAL: CORTIÇA AMPLA E DESPOLUÍDA-->
		<!-- ========================================== -->
		<div class="flex-1 relative z-10 p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-180px)] pb-24 sm:pb-10">
			
			{#if activeTab === 'chamados'}
				<!-- ABA 1: CHAMADOS (Post-its rápidos manuscritos com Pin 3D) -->
				{#if filteredCaravanas.length === 0}
					<div class="bg-amber-100/90 border-2 border-dashed border-amber-400/80 rounded-lg p-10 text-center max-w-md mx-auto shadow-md">
						<Pin color="gold" size="lg" class="mb-2" />
						<h3 class="text-base font-bold text-stone-900 mb-1">Nenhum chamado neste filtro</h3>
						<p class="text-xs text-stone-600 mb-4">Seja o primeiro a fixar um post-it de caravana ou esquadrão no mural!</p>
						<button 
							type="button" 
							onclick={() => isCreateModalOpen = true}
							class="px-4 py-2 rounded bg-amber-300 hover:bg-amber-400 text-stone-950 font-black text-xs border border-amber-500 shadow-sm"
						>
							Fixar Post-it
						</button>
					</div>
				{:else}
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
						{#each filteredCaravanas as post (post.id)}
							<CaravanaCard {post} />
						{/each}
					</div>
				{/if}

			{:else if activeTab === 'toolbox'}
				<!-- ABA 2: TOOLBOX (Fila do RU + Tíquetes de Ônibus com Picote e Fita Durex) -->
				{#if toolboxFilter === 'todos'}
					<!-- Destaque: Fila do RU em Tempo Real -->
					<div class="mb-10 max-w-4xl mx-auto">
						<RuCard />
					</div>

					<!-- Divisor / Tarja Washi Tape da Cortiça -->
					<div class="flex items-center gap-3 my-8 max-w-4xl mx-auto select-none">
						<div class="flex-1 h-[2px] bg-[#8b5e34]/50"></div>
						<div class="washi-tape-blue text-[11px] font-mono shadow-sm">
							🚌 TÍQUETES & HORÁRIOS OFICIAIS DA SEMOB-DF
						</div>
						<div class="flex-1 h-[2px] bg-[#8b5e34]/50"></div>
					</div>

					<!-- Grade de Ônibus -->
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 xl:gap-x-14 gap-y-12 xl:gap-y-16 pt-2 items-start">
						{#each $buses as bus (bus.id)}
							<BusCard {bus} />
						{/each}
					</div>

				{:else if toolboxFilter === 'ru'}
					<!-- Visão Focada Exclusiva da Fila do RU -->
					<div class="max-w-4xl mx-auto pt-2">
						<RuCard />
					</div>

				{:else if toolboxFilter === 'onibus'}
					<!-- Visão Apenas de Ônibus -->
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 xl:gap-x-14 gap-y-12 xl:gap-y-16 pt-4 sm:pt-6 items-start">
						{#each $buses as bus (bus.id)}
							<BusCard {bus} />
						{/each}
					</div>
				{/if}

			{:else if activeTab === 'avisos'}
				<!-- ABA 3: AVISOS (Flyers e Pôsteres Universitários com Grampos) -->

				{#if filteredNotices.length === 0}
					<div class="bg-amber-100/90 border-2 border-dashed border-amber-400/80 rounded-lg p-10 text-center max-w-md mx-auto shadow-md">
						<h3 class="text-base font-bold text-stone-900 mb-1">Nenhum pôster nesta categoria</h3>
						<p class="text-xs text-stone-600">Alterne os filtros acima para visualizar editais e eventos da FGA.</p>
					</div>
				{:else}
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
						{#each filteredNotices as notice (notice.id)}
							<NoticeCard {notice} />
						{/each}
					</div>
				{/if}
			{/if}
		</div>

		<!-- ========================================== -->
		<!-- BOTTOM NAVIGATION BAR NO MOBILE (RÉGUA)    -->
		<!-- ========================================== -->
		<nav class="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#42220e] border-t-3 border-[#6b3c1b] shadow-[0_-6px_20px_rgba(0,0,0,0.5)] px-3 py-2 flex items-center justify-around select-none">
			<!-- Chamados -->
			<button 
				type="button" 
				onclick={() => activeTab = 'chamados'}
				class="flex flex-col items-center gap-0.5 text-[11px] font-bold transition-colors {activeTab === 'chamados' ? 'text-amber-300' : 'text-amber-100/60 hover:text-amber-100'}"
			>
				<ShieldAlert class="w-5 h-5" />
				<span>Post-its</span>
			</button>

			<!-- Toolbox -->
			<button 
				type="button" 
				onclick={() => activeTab = 'toolbox'}
				class="flex flex-col items-center gap-0.5 text-[11px] font-bold transition-colors {activeTab === 'toolbox' ? 'text-sky-300' : 'text-amber-100/60 hover:text-amber-100'}"
			>
				<Toolbox class="w-5 h-5" />
				<span>Toolbox</span>
			</button>

			<!-- Botão Central Flutuante: Fixar Post-it -->
			<button 
				type="button" 
				onclick={() => isCreateModalOpen = true}
				class="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 font-black flex items-center justify-center shadow-lg -mt-5 border-2 border-amber-200 active:scale-90 transition-transform"
				aria-label="Fixar novo post-it no mural"
			>
				<Plus class="w-6 h-6" />
			</button>

			<!-- Avisos -->
			<button 
				type="button" 
				onclick={() => activeTab = 'avisos'}
				class="flex flex-col items-center gap-0.5 text-[11px] font-bold transition-colors {activeTab === 'avisos' ? 'text-rose-300' : 'text-amber-100/60 hover:text-amber-100'}"
			>
				<Megaphone class="w-5 h-5" />
				<span>Flyers</span>
			</button>

			<!-- Perfil / Crachá -->
			<button 
				type="button" 
				onclick={() => isStudentIdCardOpen = true}
				class="flex flex-col items-center gap-0.5 text-[11px] font-bold text-amber-100/70 hover:text-amber-100 transition-colors cursor-pointer"
				aria-label="Abrir Crachá e Carteirinha Estudantil"
			>
				<IdCard class="w-5 h-5 text-amber-400" />
				<span>Crachá</span>
			</button>
		</nav>

	</div>
</div>

<!-- ========================================== -->
<!-- CARTEIRINHA ESTUDANTIL DA UnB (CRACHÁ POR CIMA) -->
<!-- ========================================== -->
<StudentIdCardModal 
	isOpen={isStudentIdCardOpen}
	onClose={() => isStudentIdCardOpen = false}
/>

<!-- ========================================== -->
<!-- GAVETA LATERAL RETRÁTIL DE MISSÕES & PERFIL-->
<!-- ========================================== -->
{#if isProfileDrawerOpen}
	<div 
		class="fixed inset-0 z-110 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity"
		role="dialog"
		aria-modal="true"
	>
		<!-- Fundo escuro para fechar ao clicar -->
		<button 
			type="button" 
			class="flex-1 w-full cursor-default" 
			onclick={() => isProfileDrawerOpen = false}
			aria-label="Fechar painel de conquistas"
		></button>

		<!-- Painel Deslizante -->
		<div class="relative z-10 w-full sm:w-96 max-h-screen bg-[#f5ede0] shadow-2xl p-4 sm:p-5 flex flex-col justify-between overflow-y-auto border-l-4 border-[#8c6027]">
			<div class="flex items-center justify-between pb-3 border-b border-stone-300 mb-3">
				<span class="font-extrabold text-sm text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
					<Award class="w-4 h-4 text-amber-700" />
					Mural de Conquistas & Missões
				</span>
				<button 
					type="button" 
					onclick={() => isProfileDrawerOpen = false}
					class="p-1 rounded-full text-stone-600 hover:text-stone-900 hover:bg-black/5 cursor-pointer"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<GamificationSidebar isMobileDrawer={true} />
		</div>
	</div>
{/if}

<!-- Modal de Criação de Novos Post-its -->
<CreatePostModal 
	isOpen={isCreateModalOpen} 
	onClose={() => isCreateModalOpen = false} 
/>
