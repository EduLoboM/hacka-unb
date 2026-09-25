<script lang="ts">
	import type { NoticePost } from '$lib/types/gamification';
	import Staple from '$lib/components/Staple.svelte';
	import InstagramIcon from '$lib/components/InstagramIcon.svelte';
	import { gameStore } from '$lib/stores/gameStore';
	import { Tag, ExternalLink, CheckCheck, Megaphone, FileText, Sparkles, Building2, Landmark, GraduationCap } from 'lucide-svelte';

	interface Props {
		notice: NoticePost;
	}

	let { notice }: Props = $props();

	// Temas visuais de Pôster / Flyer Universitário por categoria
	const posterThemes = {
		'Decanatos': {
			bannerBg: 'bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 text-blue-100',
			categoryLabel: 'DECANATO DA UNB • OFICIAL',
			accentBorder: 'border-blue-800/40',
			paperBg: 'bg-[#fffdfa]'
		},
		'Empresas Juniores': {
			bannerBg: 'bg-gradient-to-r from-amber-700 via-orange-800 to-stone-900 text-amber-100',
			categoryLabel: 'EMPRESA JÚNIOR • INSTAGRAM',
			accentBorder: 'border-amber-800/40',
			paperBg: 'bg-[#fffdfa]'
		},
		'Edital': {
			bannerBg: 'bg-gradient-to-r from-red-800 to-rose-950 text-rose-100',
			categoryLabel: 'EDITAL OFICIAL • UNB FGA',
			accentBorder: 'border-red-800/40',
			paperBg: 'bg-[#fffdfa]'
		},
		'Extensão': {
			bannerBg: 'bg-gradient-to-r from-emerald-800 to-teal-950 text-emerald-100',
			categoryLabel: 'WORKSHOP & EXTENSÃO',
			accentBorder: 'border-emerald-800/40',
			paperBg: 'bg-[#fffdfa]'
		},
		'Eventos': {
			bannerBg: 'bg-gradient-to-r from-purple-800 to-indigo-950 text-purple-100',
			categoryLabel: 'EVENTO UNIVERSITÁRIO',
			accentBorder: 'border-purple-800/40',
			paperBg: 'bg-[#fffdfa]'
		},
		'Estágio': {
			bannerBg: 'bg-gradient-to-r from-sky-800 to-blue-950 text-sky-100',
			categoryLabel: 'VAGA DE ESTÁGIO',
			accentBorder: 'border-sky-800/40',
			paperBg: 'bg-[#fffdfa]'
		}
	} as const;

	let theme = $derived(posterThemes[notice.category] ?? posterThemes.Edital);

	function handleMarkAsRead() {
		gameStore.markNoticeRead(notice.id);
	}
</script>

<!-- Flyer / Pôster Universitário com Grampos Metálicos Fixando na Cortiça -->
<article 
	class="relative {notice.rotation} transform-gpu hover:-translate-y-1 hover:rotate-0 transition-all duration-200"
>
	<!-- Grampos Metálicos Galvanizados de Grampeador de Mural (Cantos Superiores) -->
	<Staple position="dual" />

	<!-- Corpo do Pôster com Faixa Gráfica -->
	<div 
		class="relative group rounded-sm shadow-[0_12px_28px_rgba(40,15,5,0.32)] hover:shadow-[0_18px_36px_rgba(40,15,5,0.42)] transition-all duration-200 bg-[#fffdf8] border-2 border-stone-300 flex flex-col justify-between overflow-hidden h-full"
	>
		<div>
			<!-- Faixa Superior Gráfica de Pôster / Banner de Divulgação -->
			<header class="{theme.bannerBg} px-4 pt-5 pb-2 border-b-2 border-black/20 shadow-xs flex items-center justify-between">
				<div class="flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-wider">
					{#if notice.category === 'Decanatos'}
						<Landmark class="w-3.5 h-3.5 text-blue-300" />
					{:else if notice.category === 'Empresas Juniores'}
						<Building2 class="w-3.5 h-3.5 text-amber-300" />
					{:else if notice.category === 'Edital'}
						<FileText class="w-3.5 h-3.5 text-rose-300" />
					{:else if notice.category === 'Eventos'}
						<Sparkles class="w-3.5 h-3.5 text-purple-300" />
					{:else}
						<Megaphone class="w-3.5 h-3.5 text-emerald-300" />
					{/if}
					<span>{theme.categoryLabel}</span>
				</div>

				<span class="text-[9px] font-mono opacity-80">
					{notice.createdAt}
				</span>
			</header>

			<!-- Faixa de Identificação do Perfil Oficial do Instagram -->
			{#if notice.instagramHandle}
				<div class="px-4 py-2 bg-gradient-to-r from-stone-100 via-amber-50/40 to-stone-50 border-b border-stone-200 flex items-center justify-between gap-2 text-xs">
					<a 
						href={notice.instagramUrl || `https://www.instagram.com/${notice.instagramHandle.replace('@', '')}/`}
						target="_blank"
						rel="noreferrer"
						class="inline-flex items-center gap-1.5 group/handle hover:opacity-90 transition-opacity"
					>
						<div class="w-4.5 h-4.5 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-xs p-0.5 shrink-0">
							<InstagramIcon size={12} class="text-white" />
						</div>
						<span class="font-mono font-black text-stone-900 group-hover/handle:text-rose-700 transition-colors text-[11px]">
							{notice.instagramHandle}
						</span>
						{#if notice.verifiedBadge}
							<span class="w-3.5 h-3.5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[9px] font-black shrink-0" title="Perfil Verificado">
								✓
							</span>
						{/if}
					</a>

					{#if notice.likesCount}
						<div class="font-mono text-[10px] text-stone-600 font-bold flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-full border border-stone-200 shadow-2xs">
							<span class="text-rose-500 text-xs leading-none">♥</span>
							<span>{notice.likesCount}</span>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Corpo do Pôster -->
			<div class="p-5 pt-3.5">
				<!-- Organizador / Entidade e Selo de Validade -->
				<div class="flex items-center justify-between text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
					<span class="truncate max-w-[65%]">{notice.organizer}</span>
					<!-- Selo de Validade / Carimbo de Expiração -->
					<span class="font-mono text-[10px] text-rose-800 bg-rose-100 border border-rose-300/80 px-1.5 py-0.2 rounded -rotate-1 shrink-0 font-bold">
						{notice.expiresAt}
					</span>
				</div>

				<!-- Título em Tipografia de Cartaz Universitário -->
				<h3 class="text-base font-black text-stone-950 leading-snug mb-2 tracking-tight font-sans">
					{notice.title}
				</h3>

				<!-- Texto Informativo do Flyer -->
				<p class="text-xs text-stone-700 leading-relaxed font-sans mb-3.5">
					{notice.description}
				</p>

				<!-- Tags Gráficas do Evento -->
				<div class="flex items-center gap-1.5 flex-wrap">
					{#each notice.tags as tag}
						<span class="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-300/70">
							<Tag class="w-2.5 h-2.5 text-stone-500" />
							{tag}
						</span>
					{/each}
				</div>
			</div>
		</div>

		<!-- Rodapé do Pôster com Links e Botão de Ação -->
		<footer class="p-4 pt-3 border-t border-stone-200/80 bg-stone-50/50 flex items-center justify-between gap-2 mt-auto">
			<div>
				{#if notice.instagramHandle || notice.instagramUrl}
					<a 
						href={notice.instagramUrl || `https://www.instagram.com/${notice.instagramHandle?.replace('@', '')}/`} 
						target="_blank" 
						rel="noreferrer"
						class="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded text-white bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:brightness-105 active:scale-95 shadow-xs transition-all"
					>
						<InstagramIcon size={12} class="text-white" />
						<span>Ver no Instagram</span>
						<ExternalLink class="w-3 h-3 opacity-80" />
					</a>
				{:else if notice.linkUrl}
					<a 
						href={notice.linkUrl} 
						target="_blank" 
						rel="noreferrer"
						class="inline-flex items-center gap-1 text-xs font-bold text-amber-900 hover:text-amber-950 hover:underline"
					>
						<span>Acessar Link</span>
						<ExternalLink class="w-3.5 h-3.5" />
					</a>
				{/if}
			</div>

			<button 
				type="button" 
				onclick={handleMarkAsRead}
				class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded font-bold text-xs transition-all cursor-pointer {notice.isRead ? 'bg-emerald-700 text-white' : 'bg-stone-900 hover:bg-stone-800 text-white active:scale-95 shadow-xs'}"
				disabled={notice.isRead}
			>
				{#if notice.isRead}
					<CheckCheck class="w-3.5 h-3.5" />
					<span>Lido (+10 XP)</span>
				{:else}
					<span>Marcar Lido (+10 XP)</span>
				{/if}
			</button>
		</footer>
	</div>
</article>
