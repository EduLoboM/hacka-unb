<script lang="ts">
	import { onMount } from 'svelte';
	import type { BusReport } from '$lib/types/gamification';
	import ClearTape from '$lib/components/ClearTape.svelte';
	import { gameStore } from '$lib/stores/gameStore';
	import { ExternalLink, Check, AlertCircle, Users, Clock, MapPin, Ticket } from 'lucide-svelte';

	interface Props {
		bus: BusReport;
	}

	let { bus }: Props = $props();

	let currentTimeStr = $state('');
	let nextTripTime = $state('');
	let minutesUntilNext = $state<number>(0);

	function updateNextTrip() {
		const now = new Date();
		const hours = now.getHours();
		const minutes = now.getMinutes();
		currentTimeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

		const currentTotalMinutes = hours * 60 + minutes;

		const trips = bus.scheduledTrips || [];
		let foundTrip = '';
		let minDiff = Infinity;

		for (const trip of trips) {
			const [th, tm] = trip.split(':').map(Number);
			const tripTotalMinutes = th * 60 + tm;
			if (tripTotalMinutes >= currentTotalMinutes) {
				const diff = tripTotalMinutes - currentTotalMinutes;
				if (diff < minDiff) {
					minDiff = diff;
					foundTrip = trip;
				}
			}
		}

		if (!foundTrip && trips.length > 0) {
			foundTrip = trips[0];
			const [th, tm] = foundTrip.split(':').map(Number);
			minDiff = (24 * 60 - currentTotalMinutes) + (th * 60 + tm);
		}

		nextTripTime = foundTrip;
		minutesUntilNext = minDiff === Infinity ? 0 : minDiff;
	}

	onMount(() => {
		updateNextTrip();
		const timer = setInterval(updateNextTrip, 15000);
		return () => clearInterval(timer);
	});

	function handleVote(type: 'passou' | 'atrasado' | 'lotado') {
		gameStore.voteBusLine(bus.id, type);
	}
</script>

<!-- Tíquete / Bilhete Oficial de Ônibus de Brasília com Fitas Adesivas Translúcidas Fixando na Cortiça -->
<article 
	class="relative {bus.rotation} transform-gpu hover:-translate-y-1 hover:rotate-0 transition-all duration-200"
>
	<!-- Fitas Adesivas Transparentes (Durex) Fixando as Pontas do Bilhete na Cortiça -->
	<ClearTape corner="top-left" />
	<ClearTape corner="top-right" />

	<!-- Corpo do Tíquete com Picote e Textura de Papel -->
	<div 
		class="relative rounded-sm shadow-[0_10px_25px_rgba(40,20,5,0.35)] hover:shadow-[0_16px_32px_rgba(40,20,5,0.45)] transition-all duration-200 p-5 pt-6 bg-[#fbf9f4] border-2 border-[#d6cbbe] flex flex-col justify-between overflow-hidden h-full"
	>
		<!-- Picote Lateral de Bilhete de Transporte (Entalhes semicirculares) -->
		<div class="absolute top-24 -left-3 w-6 h-6 rounded-full bg-[#c19a6b] shadow-inner pointer-events-none border-r border-[#d6cbbe]"></div>
		<div class="absolute top-24 -right-3 w-6 h-6 rounded-full bg-[#c19a6b] shadow-inner pointer-events-none border-l border-[#d6cbbe]"></div>

		<div>
		<!-- Cabeçalho do Tíquete: Número de Série e Tarja SEMOB -->
		<header class="border-b-2 border-dashed border-stone-400/70 pb-3 mb-3">
			<div class="flex items-center justify-between text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest mb-1.5">
				<span class="flex items-center gap-1">
					<Ticket class="w-3 h-3 text-stone-700" />
					TÍQUETE DF • {bus.operator}
				</span>
				<span class="bg-stone-200 text-stone-800 px-1 rounded text-[9px]">
					SÉRIE {bus.lineNumber}-FGA
				</span>
			</div>

			<!-- Número Gigante do Ônibus no Formato de Letreiro de Transporte do DF -->
			<div class="flex items-center justify-between gap-2">
				<div class="flex items-baseline gap-2">
					<span class="font-mono font-black text-3xl tracking-tight text-stone-950">
						{bus.lineNumber}
					</span>
					<span class="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-950 border border-emerald-300">
						{bus.farePrice}
					</span>
				</div>
			</div>

			<h3 class="font-extrabold text-sm text-stone-900 leading-snug mt-1">
				{bus.lineName}
			</h3>

			<!-- Itinerário / Via -->
			<div class="mt-1.5 text-xs text-stone-700 flex items-start gap-1 leading-tight">
				<MapPin class="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
				<span><strong>Via:</strong> {bus.via}</span>
			</div>
		</header>

		<!-- Painel de Horários com Marca-Texto Fluorescente na Próxima Partida -->
		<div class="bg-stone-100/90 rounded p-3 mb-3 border border-stone-300/80 shadow-inner">
			<div class="flex items-center justify-between mb-2">
				<span class="text-[11px] font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1">
					<Clock class="w-3 h-3 text-stone-600" />
					Painel Oficial de Partidas:
				</span>
				
				{#if minutesUntilNext > 0}
					<span class="text-[11px] font-black text-amber-950 bg-amber-300 border border-amber-500 px-2 py-0.2 rounded font-mono shadow-xs animate-pulse">
						A SEGUIR (~{minutesUntilNext} min)
					</span>
				{/if}
			</div>

			<!-- Grade de Viagens com Marca-Texto Fluorescente -->
			<div class="grid grid-cols-4 sm:grid-cols-6 gap-1 font-mono text-xs text-center">
				{#each bus.scheduledTrips as trip}
					{@const isNext = trip === nextTripTime}
					<div 
						class="py-1 px-1 rounded transition-all {isNext 
							? 'bg-yellow-300 text-stone-950 font-black shadow-xs border border-amber-400 rotate-[-1deg] ring-2 ring-amber-400/60 scale-105' 
							: 'text-stone-700 bg-white/80 border border-stone-200'}"
						title={isNext ? 'Próxima viagem programada da SEMOB' : `Viagem programada: ${trip}`}
					>
						<span>{trip}</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- Dica de Veterano Escrita com Caneta Esferográfica -->
		{#if bus.studentTip}
			<div class="font-hand text-base leading-tight text-blue-950 bg-blue-50/80 border-l-3 border-blue-500 px-2.5 py-1.5 rounded-r mb-3 -rotate-0.5 shadow-xs">
				<span class="font-bold">Malandragem FGA:</span> {bus.studentTip}
			</div>
		{/if}

		<!-- Relatos Rápidos dos Alunos -->
		<div class="mb-3">
			<span class="text-[10px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
				Validações recentes:
			</span>
			<div class="space-y-1">
				{#each bus.recentReports as rep}
					<div class="flex items-center justify-between text-xs py-1 px-2 rounded bg-stone-200/50 border border-stone-300/60 font-mono">
						<div class="flex items-center gap-1.5">
							{#if rep.type === 'passou'}
								<span class="w-2 h-2 rounded-full bg-emerald-600"></span>
								<span class="text-emerald-950 font-bold">Passou</span>
							{:else if rep.type === 'atrasado'}
								<span class="w-2 h-2 rounded-full bg-rose-600"></span>
								<span class="text-rose-950 font-bold">Atrasado</span>
							{:else}
								<span class="w-2 h-2 rounded-full bg-amber-600"></span>
								<span class="text-amber-950 font-bold">Lotado</span>
							{/if}
							<span class="text-stone-600 font-sans text-[11px]">({rep.studentName})</span>
						</div>
						<span class="text-stone-500 text-[10px]">{rep.timestamp}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Rodapé com Carimbos de Tinta Físicos e Código de Barras -->
	<footer class="pt-3 border-t-2 border-dashed border-stone-400/70 flex flex-col gap-2 mt-auto">
		<div class="flex items-center justify-between text-[11px]">
			<span class="font-bold text-stone-800 uppercase tracking-wider">
				Carimbar Status do Tíquete (+15 XP):
			</span>
			
			<a 
				href="https://dfnoponto.semob.df.gov.br/" 
				target="_blank" 
				rel="noreferrer"
				class="text-[11px] font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1 hover:underline"
				title="Acessar o portal oficial DF no Ponto da SEMOB-DF"
			>
				<span>GPS Oficial</span>
				<ExternalLink class="w-3 h-3" />
			</a>
		</div>

		<!-- Carimbos Físicos de Tinta -->
		<div class="grid grid-cols-3 gap-2 select-none">
			<!-- Carimbo PASSOU -->
			<button 
				type="button" 
				onclick={() => handleVote('passou')}
				class="relative py-2 px-1 border-2 border-dashed rounded font-mono font-black text-xs uppercase tracking-wider transition-all active:scale-90 flex flex-col items-center justify-center {bus.userLastVotedType === 'passou' ? 'border-emerald-800 bg-emerald-200 text-emerald-950 shadow-inner -rotate-2 scale-105 ring-2 ring-emerald-500/40' : 'border-emerald-700/60 text-emerald-800 bg-emerald-500/10 hover:bg-emerald-500/20 -rotate-1'}"
				title="Carimbar que o ônibus passou"
			>
				<span class="flex items-center gap-1">
					<Check class="w-3.5 h-3.5" /> PASSOU
				</span>
				<span class="text-[10px] font-sans font-bold opacity-80 mt-0.5">
					{bus.communityScore.passedVotes} votos
				</span>
			</button>

			<!-- Carimbo ATRASADO -->
			<button 
				type="button" 
				onclick={() => handleVote('atrasado')}
				class="relative py-2 px-1 border-2 border-dashed rounded font-mono font-black text-xs uppercase tracking-wider transition-all active:scale-90 flex flex-col items-center justify-center {bus.userLastVotedType === 'atrasado' ? 'border-rose-800 bg-rose-200 text-rose-950 shadow-inner rotate-2 scale-105 ring-2 ring-rose-500/40' : 'border-rose-700/60 text-rose-800 bg-rose-500/10 hover:bg-rose-500/20 rotate-1'}"
				title="Carimbar que está atrasado"
			>
				<span class="flex items-center gap-1">
					<AlertCircle class="w-3.5 h-3.5" /> ATRASADO
				</span>
				<span class="text-[10px] font-sans font-bold opacity-80 mt-0.5">
					{bus.communityScore.delayedVotes} votos
				</span>
			</button>

			<!-- Carimbo LOTADO -->
			<button 
				type="button" 
				onclick={() => handleVote('lotado')}
				class="relative py-2 px-1 border-2 border-dashed rounded font-mono font-black text-xs uppercase tracking-wider transition-all active:scale-90 flex flex-col items-center justify-center {bus.userLastVotedType === 'lotado' ? 'border-amber-800 bg-amber-200 text-amber-950 shadow-inner -rotate-3 scale-105 ring-2 ring-amber-500/40' : 'border-amber-700/60 text-amber-900 bg-amber-500/10 hover:bg-amber-500/20 -rotate-2'}"
				title="Carimbar que veio lotado"
			>
				<span class="flex items-center gap-1">
					<Users class="w-3.5 h-3.5" /> LOTADO
				</span>
				<span class="text-[10px] font-sans font-bold opacity-80 mt-0.5">
					{bus.communityScore.crowdedVotes} votos
				</span>
			</button>
		</div>

		<!-- Código de Barras Decorativo no Fim do Tíquete -->
		<div class="pt-2 flex items-center justify-between opacity-50">
			<div class="h-4 flex items-center gap-0.5 font-mono text-[8px] text-stone-500">
				<div class="w-0.5 h-full bg-stone-700"></div>
				<div class="w-1 h-full bg-stone-700"></div>
				<div class="w-0.5 h-full bg-stone-700"></div>
				<div class="w-1.5 h-full bg-stone-700"></div>
				<div class="w-0.5 h-full bg-stone-700"></div>
				<div class="w-1 h-full bg-stone-700"></div>
				<div class="w-2 h-full bg-stone-700"></div>
				<div class="w-0.5 h-full bg-stone-700"></div>
				<div class="w-1 h-full bg-stone-700"></div>
			</div>
			<span class="font-mono text-[9px] text-stone-500">
				SEMOB-DF • LINHA {bus.lineNumber}
			</span>
		</div>
	</footer>
	</div>
</article>
