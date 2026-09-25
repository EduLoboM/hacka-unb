<script lang="ts">
	import type { CaravanaPost } from '$lib/types/gamification';
	import Pin from '$lib/components/Pin.svelte';
	import WashiTape from '$lib/components/WashiTape.svelte';
	import CockroachIcon from '$lib/components/CockroachIcon.svelte';
	import { gameStore } from '$lib/stores/gameStore';
	import { Clock, MapPin, Users, AlertTriangle, ShieldCheck, CheckCircle2, PlusCircle, MessageSquare } from 'lucide-svelte';

	interface Props {
		post: CaravanaPost;
	}

	let { post }: Props = $props();

	const paperBgMap = {
		yellow: 'bg-[#fef9c3] border-t border-l border-white/60 border-b-2 border-r-2 border-amber-300/80 text-stone-900',
		white: 'bg-[#f8fafc] border-t border-l border-white/80 border-b-2 border-r-2 border-stone-300/80 text-stone-900',
		kraft: 'bg-[#fed7aa] border-t border-l border-amber-100/60 border-b-2 border-r-2 border-amber-400/80 text-stone-950',
		blue: 'bg-[#dbeafe] border-t border-l border-blue-100/60 border-b-2 border-r-2 border-blue-300/80 text-stone-900',
		pink: 'bg-[#fce7f3] border-t border-l border-pink-100/60 border-b-2 border-r-2 border-pink-300/80 text-stone-900',
		green: 'bg-[#dcfce7] border-t border-l border-emerald-100/60 border-b-2 border-r-2 border-emerald-300/80 text-stone-900'
	};

	function handleJoin() {
		gameStore.joinCaravana(post.id);
	}

	function handleSupport() {
		gameStore.supportDenuncia(post.id);
	}
</script>

<!-- Post-it Rápido Manuscrito da FGA com Pin Centralizado -->
<article 
	class="relative group rounded-xs shadow-[0_12px_24px_-6px_rgba(50,20,5,0.32),0_4px_8px_-2px_rgba(50,20,5,0.18)] hover:shadow-[0_18px_32px_-6px_rgba(50,20,5,0.42)] transition-all duration-200 p-5 pt-8 {paperBgMap[post.paperColor]} {post.rotation} transform-gpu hover:-translate-y-1 hover:rotate-0 flex flex-col justify-between"
>
	<!-- Faixa Translúcida de Cola do Post-it no Topo -->
	<div class="absolute top-0 inset-x-0 h-4 bg-black/3 border-b border-black/5 pointer-events-none rounded-t-xs"></div>

	<!-- Pin Único Centralizado no Topo com Parallax 3D Interativo -->
	<div class="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
		<Pin 
			color={post.type === 'denuncia' ? 'red' : post.urgency === 'emergencia' ? 'red' : post.pinColor} 
			size="md" 
		/>
	</div>

	<!-- Fita Adesiva / Washi Tape no Canto Superior Direito -->
	<div class="absolute -top-2.5 right-4 z-10 pointer-events-none">
		{#if post.type === 'caravana'}
			<WashiTape color="amber" rotation="right" text="Caravana 480" />
		{:else if post.type === 'squad'}
			<WashiTape color="blue" rotation="right" text="Squad PI" />
		{:else if post.type === 'denuncia'}
			<div class="h-7 px-3 backdrop-blur-[1px] bg-red-700 text-white shadow-washi border-x-2 border-dashed border-red-950/40 flex items-center justify-center gap-1.5 font-black text-xs uppercase tracking-wider select-none rotate-2">
				<CockroachIcon size={14} class="text-amber-300" />
				<span>DENÚNCIA</span>
			</div>
		{:else}
			<WashiTape color="red" rotation="right" text="Alerta FGA" />
		{/if}
	</div>

	<!-- Cabeçalho do Autor e Timestamp -->
	<header class="flex items-center gap-2.5 mb-3 border-b border-black/10 pb-2.5 relative z-2">
		<img 
			src={post.author.avatar} 
			alt={post.author.name} 
			class="w-9 h-9 rounded-full object-cover border-2 border-white/80 shadow-xs" 
		/>
		<div class="flex-1 min-w-0">
			<div class="flex items-center gap-1.5 flex-wrap">
				<span class="font-bold text-sm text-stone-900 leading-tight truncate">
					{post.author.name}
				</span>
				<span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-black/5 text-stone-700">
					Nv. {post.author.level}
				</span>
			</div>
			<div class="flex items-center gap-2 text-xs text-stone-600 font-medium">
				<span class="truncate">{post.author.course.replace('Engenharia de ', '').replace('Engenharia ', '')}</span>
				<span>•</span>
				<span>{post.createdAt}</span>
			</div>
		</div>
	</header>

	<!-- Ocorrência / Local da Denúncia com Ícone Material de Barata -->
	{#if post.type === 'denuncia'}
		<div class="mb-3 p-2 rounded bg-amber-950/8 border border-amber-900/15 flex items-center justify-between gap-2 relative z-2">
			<div class="flex items-center gap-2 min-w-0">
				<div class="w-8 h-8 rounded-full bg-amber-950 text-amber-300 flex items-center justify-center shadow-xs shrink-0 ring-2 ring-amber-800/30">
					<CockroachIcon size={18} class="text-amber-300" />
				</div>
				<div class="min-w-0">
					<span class="text-[9px] font-mono font-black uppercase tracking-wider text-rose-900 block leading-tight">
						Reporte • Fiscalização FGA
					</span>
					{#if post.location}
						<span class="text-xs font-bold text-stone-900 flex items-center gap-1 truncate">
							<MapPin class="w-3.5 h-3.5 text-red-700 shrink-0" />
							<span class="truncate">{post.location}</span>
						</span>
					{/if}
				</div>
			</div>
			<span class="px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase bg-red-800 text-white shadow-2xs shrink-0">
				Ouvidoria
			</span>
		</div>
	{/if}

	<!-- Título com Destaque Manuscrito de Post-it -->
	<div class="mb-4 relative z-2">
		<h3 class="text-base font-extrabold text-stone-950 mb-1.5 leading-snug flex items-start gap-1.5">
			{#if post.type === 'denuncia'}
				<div class="w-5 h-5 rounded-full bg-amber-950/15 text-amber-950 flex items-center justify-center shrink-0 mt-0.5">
					<CockroachIcon size={15} class="text-amber-950" />
				</div>
			{:else if post.urgency === 'emergencia'}
				<AlertTriangle class="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
			{/if}
			<span>{post.title}</span>
		</h3>
		
		<p class="text-sm text-stone-800 leading-relaxed font-sans opacity-95">
			{post.description}
		</p>
	</div>

	<!-- Informações Específicas por Tipo -->
	{#if post.type === 'caravana'}
		<!-- Detalhes de Rota e Horário de Saída com Letra Manuscrita -->
		<div class="bg-black/4 rounded-md p-3 mb-3 border border-black/5 text-xs flex flex-col gap-2 font-sans relative z-2">
			{#if post.departureTime}
				<div class="flex items-center justify-between gap-2 border-b border-black/5 pb-1.5">
					<span class="font-bold text-stone-800 flex items-center gap-1.5">
						<Clock class="w-4 h-4 text-amber-800 shrink-0" />
						Horário de Saída:
					</span>
					<span class="font-hand font-bold text-2xl text-amber-950 bg-amber-200/80 px-2.5 py-0.5 rounded shadow-xs -rotate-1 border border-amber-300">
						{post.departureTime}
					</span>
				</div>
			{/if}
			{#if post.origin}
				<div class="flex items-center gap-2 text-stone-700">
					<MapPin class="w-3.5 h-3.5 text-stone-500 shrink-0" />
					<span class="truncate">De: <strong>{post.origin}</strong></span>
				</div>
			{/if}
			{#if post.destination}
				<div class="flex items-center gap-2 text-stone-700">
					<MapPin class="w-3.5 h-3.5 text-stone-800 shrink-0" />
					<span class="truncate">Para: <strong>{post.destination}</strong></span>
				</div>
			{/if}
		</div>

		<!-- Lista de Alunos Confirmados -->
		<div class="mb-4 relative z-2">
			<div class="flex items-center justify-between text-xs font-semibold text-stone-700 mb-2">
				<span class="flex items-center gap-1.5">
					<Users class="w-3.5 h-3.5 text-stone-600" />
					Quem vai junto ({post.attendees.length}{post.maxCapacity ? `/${post.maxCapacity}` : ''}):
				</span>
				{#if post.userJoined}
					<span class="text-emerald-700 font-bold flex items-center gap-1">
						<ShieldCheck class="w-3.5 h-3.5" /> Você está na caravana
					</span>
				{/if}
			</div>

			<div class="flex items-center -space-x-2 overflow-hidden py-1">
				{#each post.attendees as att}
					<img 
						src={att.avatar} 
						alt={att.name} 
						title="{att.name} ({att.course})"
						class="w-7 h-7 rounded-full object-cover border-2 border-white shadow-xs inline-block" 
					/>
				{/each}
				{#if post.attendees.length === 0}
					<span class="text-xs italic text-stone-500 font-hand text-base">Seja o primeiro a colar junto!</span>
				{/if}
			</div>
		</div>

	{:else if post.type === 'squad'}
		<!-- Vagas Requisitadas no Squad Multidisciplinar -->
		<div class="mb-4 relative z-2">
			<h4 class="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
				<span>Vagas no Esquadrão:</span>
			</h4>
			<div class="flex flex-col gap-1.5">
				{#each post.requiredRoles ?? [] as role}
					<div class="flex items-center justify-between text-xs p-1.5 rounded {role.filled ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-amber-50 text-amber-950 border border-amber-200 font-semibold'}">
						<span class="truncate">{role.role} ({role.course})</span>
						{#if role.filled}
							<span class="text-[10px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-0.5">
								<CheckCircle2 class="w-3 h-3" /> Preenchida
							</span>
						{:else}
							<span class="text-[10px] font-black uppercase tracking-wider bg-amber-200 px-1.5 py-0.5 rounded text-amber-900">
								Aberta
							</span>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Rodapé com Ações e Botão Gamificado -->
	<footer class="pt-3 border-t border-black/10 flex items-center justify-between gap-2 mt-auto relative z-2">
		<div class="flex items-center gap-1 text-xs text-stone-600">
			<MessageSquare class="w-3.5 h-3.5" />
			<span>{post.commentsCount} respostas</span>
		</div>

		{#if post.type === 'caravana'}
			<button 
				type="button" 
				onclick={handleJoin}
				class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold text-xs transition-all duration-150 shadow-xs active:scale-95 cursor-pointer {post.userJoined ? 'bg-emerald-700 hover:bg-emerald-800 text-white' : 'bg-amber-800 hover:bg-amber-900 text-amber-50'}"
			>
				{#if post.userJoined}
					<CheckCircle2 class="w-4 h-4" />
					<span>Confirmado!</span>
				{:else}
					<PlusCircle class="w-4 h-4" />
					<span>+1 Vou Junto (+30 XP)</span>
				{/if}
			</button>
		{:else if post.type === 'squad'}
			<button 
				type="button" 
				onclick={handleJoin}
				class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold text-xs bg-sky-800 hover:bg-sky-900 text-white transition-all shadow-xs active:scale-95 cursor-pointer"
			>
				{#if post.userJoined}
					<CheckCircle2 class="w-4 h-4" />
					<span>Interesse Enviado!</span>
				{:else}
					<Users class="w-4 h-4" />
					<span>Candidatar-se (+30 XP)</span>
				{/if}
			</button>
		{:else if post.type === 'denuncia'}
			<button 
				type="button" 
				onclick={handleSupport}
				class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold text-xs transition-all duration-150 shadow-xs active:scale-95 cursor-pointer {post.userSupported ? 'bg-amber-950 text-amber-100 shadow-inner' : 'bg-red-800 hover:bg-red-900 text-white'}"
				title="Confirmar ou apoiar denúncia"
			>
				<CockroachIcon size={14} class={post.userSupported ? 'text-amber-300' : 'text-amber-200'} />
				{#if post.userSupported}
					<span>Confirmado ({post.supportedCount ?? 1})</span>
				{:else}
					<span>+1 Eu Vi ({post.supportedCount ?? 0}) • +20 XP</span>
				{/if}
			</button>
		{:else}
			<span class="stamp-alert text-[10px]">
				EMERGÊNCIA FGA
			</span>
		{/if}
	</footer>
</article>
