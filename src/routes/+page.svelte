<script lang="ts">
	import { gameStore } from '$lib/stores/gameStore';
	import Pin from '$lib/components/Pin.svelte';
	import WashiTape from '$lib/components/WashiTape.svelte';
	import GamificationSidebar from '$lib/components/GamificationSidebar.svelte';
	import StudentBadge from '$lib/components/StudentBadge.svelte';
	import CaravanaCard from '$lib/components/cards/CaravanaCard.svelte';
	import BusCard from '$lib/components/cards/BusCard.svelte';
	import NoticeCard from '$lib/components/cards/NoticeCard.svelte';
	import CreatePostModal from '$lib/components/CreatePostModal.svelte';
	import { 
		ShieldAlert, 
		Bus, 
		Megaphone, 
		Plus, 
		Filter, 
		Volume2, 
		VolumeX, 
		Sparkles,
		Flame,
		X,
		Award
	} from 'lucide-svelte';

	// Stores reativas
	const user = gameStore.user;
	const caravanas = gameStore.caravanas;
	const buses = gameStore.buses;
	const notices = gameStore.notices;

	// Estados locais com Svelte 5 Runes
	let activeTab = $state<'chamados' | 'mobilidade' | 'avisos'>('chamados');
	let chamadosFilter = $state<'todos' | 'caravana' | 'squad' | 'reporte'>('todos');
	let avisosFilter = $state<string>('Todos');
	let isCreateModalOpen = $state(false);
	let isProfileDrawerOpen = $state(false);

	// Contagens reativas
	let activeCaravanasCount = $derived($caravanas.length);
	let busesCount = $derived($buses.length);
	let activeNoticesCount = $derived($notices.length);

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

	const noticeCategories = ['Todos', 'Edital', 'Empresas Juniores', 'Extensão', 'Eventos'];
</script>

<!-- Moldura de Madeira ao Redor de Todo o Quadro de Cortiça -->
<div class="min-h-screen bg-[#381e0b] p-2 sm:p-4 md:p-6 flex flex-col">
	<div class="flex-1 flex flex-col rounded-2xl border-8 sm:border-12 md:border-14 border-[#522d14] shadow-[inset_0_2px_8px_rgba(255,255,255,0.2),inset_0_-4px_12px_rgba(0,0,0,0.8),0_20px_50px_rgba(0,0,0,0.6)] cork-texture relative overflow-hidden">
		
		<!-- Sombra Interna da Moldura de Madeira na Cortiça -->
		<div class="absolute inset-0 pointer-events-none shadow-[inset_0_8px_25px_rgba(30,12,5,0.7),inset_0_0_50px_rgba(20,8,2,0.4)] z-5"></div>

		<!-- ========================================== -->
		<!-- BARRA SUPERIOR (HEADER NA CORTIÇA)        -->
		<!-- ========================================== -->
		<header class="relative z-10 p-3 sm:p-4 md:p-5 border-b-2 border-[#8b5e34]/60 bg-[#996e3d]/30 backdrop-blur-[2px] flex flex-wrap items-center justify-between gap-3 shadow-sm">
			<!-- Logo / Placa de Metal Universitária -->
			<div class="flex items-center gap-3">
				<div class="relative bg-gradient-to-b from-[#dfbb83] via-[#c29656] to-[#8c6027] text-stone-950 px-3.5 py-1.5 rounded-sm border-2 border-[#6d4615] shadow-[0_4px_8px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.5)] flex items-center gap-2">
					<div class="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-500 shadow-inner"></div>
					<div>
						<h1 class="font-extrabold text-base sm:text-lg tracking-tight leading-none font-sans">
							HUB FGA
						</h1>
						<span class="text-[9px] uppercase tracking-widest font-black text-amber-950 block">
							Mural da UnB Gama
						</span>
					</div>
					<div class="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-500 shadow-inner"></div>
				</div>

				<!-- Badge Rápida de XP no Mobile -->
				<button 
					type="button" 
					onclick={() => isProfileDrawerOpen = true}
					class="xl:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100/90 border border-amber-300 shadow-xs text-xs font-bold text-amber-950"
					aria-label="Abrir Perfil e Missões"
				>
					<img src={$user.avatarUrl} alt="" class="w-5 h-5 rounded-full object-cover" />
					<span>Nv. {$user.level}</span>
					<span class="text-[10px] text-emerald-800 font-mono">+{$user.xp} XP</span>
				</button>
			</div>

			<!-- Abas Centrais Estilo Washi Tape / Carimbos -->
			<nav class="flex items-center gap-2 overflow-x-auto py-1" aria-label="Navegação do Mural">
				<button 
					type="button" 
					onclick={() => activeTab = 'chamados'}
					class="relative px-4 py-1.5 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-sm transition-all duration-150 flex items-center gap-1.5 select-none active:scale-95 {activeTab === 'chamados' ? 'bg-amber-100 text-stone-900 shadow-md border-b-3 border-amber-500 -rotate-1 font-extrabold scale-105' : 'bg-stone-900/40 text-amber-100/90 hover:bg-stone-900/60'}"
				>
					<ShieldAlert class="w-4 h-4 text-rose-600" />
					<span>Chamados</span>
					<span class="text-[10px] px-1.5 py-0.2 rounded-full {activeTab === 'chamados' ? 'bg-amber-800 text-amber-100' : 'bg-white/20 text-white'}">
						{activeCaravanasCount}
					</span>
				</button>

				<button 
					type="button" 
					onclick={() => activeTab = 'mobilidade'}
					class="relative px-4 py-1.5 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-sm transition-all duration-150 flex items-center gap-1.5 select-none active:scale-95 {activeTab === 'mobilidade' ? 'bg-sky-100 text-stone-900 shadow-md border-b-3 border-sky-500 rotate-1 font-extrabold scale-105' : 'bg-stone-900/40 text-amber-100/90 hover:bg-stone-900/60'}"
				>
					<Bus class="w-4 h-4 text-sky-700" />
					<span>Mobilidade</span>
					<span class="text-[10px] px-1.5 py-0.2 rounded-full {activeTab === 'mobilidade' ? 'bg-sky-800 text-sky-100' : 'bg-white/20 text-white'}">
						{busesCount}
					</span>
				</button>

				<button 
					type="button" 
					onclick={() => activeTab = 'avisos'}
					class="relative px-4 py-1.5 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-sm transition-all duration-150 flex items-center gap-1.5 select-none active:scale-95 {activeTab === 'avisos' ? 'bg-rose-100 text-stone-900 shadow-md border-b-3 border-rose-500 -rotate-1 font-extrabold scale-105' : 'bg-stone-900/40 text-amber-100/90 hover:bg-stone-900/60'}"
				>
					<Megaphone class="w-4 h-4 text-amber-700" />
					<span>Avisos</span>
					<span class="text-[10px] px-1.5 py-0.2 rounded-full {activeTab === 'avisos' ? 'bg-rose-800 text-rose-100' : 'bg-white/20 text-white'}">
						{activeNoticesCount}
					</span>
				</button>
			</nav>

			<!-- Ações da Direita: Crachá Estudantil UnB, Áudio e Botão Novo Post-it -->
			<div class="flex items-center gap-3">
				<!-- Carteirinha Estudantil da UnB (Crachá Compacto não invasivo no Desktop) -->
				<div class="hidden xl:block">
					<StudentBadge onOpenQuests={() => isProfileDrawerOpen = true} />
				</div>

				<button 
					type="button" 
					onclick={() => gameStore.toggleSound()}
					class="p-2 rounded-full bg-stone-900/50 hover:bg-stone-900/70 text-amber-200 transition-colors shadow-xs"
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
					class="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-md font-extrabold text-xs bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-stone-950 text-amber-50 shadow-md border border-amber-500/40 active:scale-95 transition-all"
				>
					<Plus class="w-4 h-4" />
					<span>+ Fixar Post-it</span>
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
						class="px-2.5 py-1 rounded text-xs font-bold transition-all {chamadosFilter === 'todos' ? 'bg-amber-100 text-stone-900 shadow-xs' : 'text-amber-200/80 hover:bg-black/20'}"
					>
						Todos
					</button>
					<button 
						type="button" 
						onclick={() => chamadosFilter = 'caravana'}
						class="px-2.5 py-1 rounded text-xs font-bold transition-all {chamadosFilter === 'caravana' ? 'bg-amber-100 text-stone-900 shadow-xs' : 'text-amber-200/80 hover:bg-black/20'}"
					>
						Caravanas 480
					</button>
					<button 
						type="button" 
						onclick={() => chamadosFilter = 'squad'}
						class="px-2.5 py-1 rounded text-xs font-bold transition-all {chamadosFilter === 'squad' ? 'bg-amber-100 text-stone-900 shadow-xs' : 'text-amber-200/80 hover:bg-black/20'}"
					>
						Squads PI
					</button>
					<button 
						type="button" 
						onclick={() => chamadosFilter = 'reporte'}
						class="px-2.5 py-1 rounded text-xs font-bold transition-all {chamadosFilter === 'reporte' ? 'bg-amber-100 text-stone-900 shadow-xs' : 'text-amber-200/80 hover:bg-black/20'}"
					>
						Alertas
					</button>

				{:else if activeTab === 'mobilidade'}
					<span class="text-xs text-amber-200/90 font-medium italic">
						Tíquetes e Painéis Oficiais da SEMOB-DF com validações comunitárias da FGA
					</span>

				{:else if activeTab === 'avisos'}
					<div class="flex items-center gap-1.5">
						{#each noticeCategories as cat}
							<button 
								type="button" 
								onclick={() => avisosFilter = cat}
								class="px-2.5 py-1 rounded text-xs font-bold transition-all {avisosFilter === cat ? 'bg-amber-100 text-stone-900 shadow-xs' : 'text-amber-200/80 hover:bg-black/20'}"
							>
								{cat}
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Indicador de Status Comunitário -->
			<div class="hidden md:flex items-center gap-2 text-xs text-amber-200 font-mono">
				<span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
				<span>Mural Universitário • Gama/DF</span>
			</div>
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
							class="px-4 py-2 rounded bg-amber-800 text-amber-50 font-bold text-xs"
						>
							+ Fixar Novo Post-it
						</button>
					</div>
				{:else}
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
						{#each filteredCaravanas as post (post.id)}
							<CaravanaCard {post} />
						{/each}
					</div>
				{/if}

			{:else if activeTab === 'mobilidade'}
				<!-- ABA 2: MOBILIDADE (Tíquetes de Ônibus com Picote e Fita Durex) -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
					{#each $buses as bus (bus.id)}
						<BusCard {bus} />
					{/each}
				</div>

			{:else if activeTab === 'avisos'}
				<!-- ABA 3: AVISOS (Flyers e Pôsteres de Eventos/Editais com Grampos) -->
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

			<!-- Mobilidade -->
			<button 
				type="button" 
				onclick={() => activeTab = 'mobilidade'}
				class="flex flex-col items-center gap-0.5 text-[11px] font-bold transition-colors {activeTab === 'mobilidade' ? 'text-sky-300' : 'text-amber-100/60 hover:text-amber-100'}"
			>
				<Bus class="w-5 h-5" />
				<span>Tíquetes</span>
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
				onclick={() => isProfileDrawerOpen = true}
				class="flex flex-col items-center gap-0.5 text-[11px] font-bold text-amber-100/60 hover:text-amber-100 transition-colors"
			>
				<Flame class="w-5 h-5 text-amber-500" />
				<span>Crachá</span>
			</button>
		</nav>

	</div>
</div>

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
					class="p-1 rounded-full text-stone-600 hover:text-stone-900 hover:bg-black/5"
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
