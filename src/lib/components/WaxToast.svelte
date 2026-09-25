<script lang="ts">
	import { gameStore } from '$lib/stores/gameStore';
	import { Sparkles, Trophy, Award, X } from 'lucide-svelte';

	const toasts = gameStore.toasts;
</script>

<div class="fixed top-4 right-4 z-100 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
	{#each $toasts as toast (toast.id)}
		<div 
			class="pointer-events-auto relative overflow-hidden bg-[#fffdf5] border-2 border-[#e6d5bc] rounded-lg shadow-[0_12px_28px_rgba(50,20,10,0.35)] p-3.5 flex items-start gap-3 transform transition-all duration-300 ease-out animate-bounce-in"
		>
			<!-- Efeito de Carimbo de Cera (Wax Seal) com relevo 3D -->
			<div class="relative shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-red-600 via-rose-700 to-amber-950 border-2 border-amber-900/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_3px_6px_rgba(80,0,0,0.5)] flex items-center justify-center text-amber-100">
				<!-- Borda irregular simulando cera derretida -->
				<div class="absolute inset-0 rounded-full border border-red-400/40 pointer-events-none"></div>

				{#if toast.type === 'level-up'}
					<Trophy class="w-5 h-5 text-amber-200 animate-pulse" />
				{:else if toast.type === 'quest'}
					<Award class="w-5 h-5 text-amber-200" />
				{:else}
					<Sparkles class="w-5 h-5 text-amber-200" />
				{/if}
			</div>

			<!-- Conteúdo do Toast -->
			<div class="flex-1 min-w-0">
				<div class="flex items-center gap-1.5 flex-wrap">
					<span class="font-extrabold text-sm text-stone-900 tracking-tight">
						{toast.title}
					</span>
					{#if toast.xpAmount > 0}
						<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300">
							+{toast.xpAmount} XP
						</span>
					{/if}
					{#if toast.karmaAmount && toast.karmaAmount > 0}
						<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
							+{toast.karmaAmount} Karma
						</span>
					{/if}
				</div>

				{#if toast.message}
					<p class="text-xs text-stone-600 mt-0.5 leading-relaxed font-sans">
						{toast.message}
					</p>
				{/if}
			</div>

			<!-- Botão de Fechar -->
			<button 
				type="button" 
				onclick={() => gameStore.dismissToast(toast.id)}
				class="shrink-0 p-1 text-stone-400 hover:text-stone-700 transition-colors"
				aria-label="Fechar notificação"
			>
				<X class="w-4 h-4" />
			</button>
		</div>
	{/each}
</div>

<style>
	@keyframes bounceIn {
		0% {
			opacity: 0;
			transform: translateY(-20px) scale(0.95);
		}
		60% {
			opacity: 1;
			transform: translateY(4px) scale(1.02);
		}
		100% {
			transform: translateY(0) scale(1);
		}
	}
	.animate-bounce-in {
		animation: bounceIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
	}
</style>
