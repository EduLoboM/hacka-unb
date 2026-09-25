<script lang="ts">
	import { gameStore } from '$lib/stores/gameStore';
	import type { CaravanaPost, NoticePost, PinColor, PostPaperColor } from '$lib/types/gamification';
	import Pin from '$lib/components/Pin.svelte';
	import { X, Sparkles, Plus, Car, Users, AlertTriangle, Bell } from 'lucide-svelte';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
	}

	let { isOpen, onClose }: Props = $props();

	const user = gameStore.user;

	let postCategory = $state<'caravana' | 'squad' | 'reporte' | 'aviso'>('caravana');
	let title = $state('');
	let description = $state('');
	let departureTime = $state('21:45');
	let origin = $state('Estacionamento UAC');
	let destination = $state('Metrô Samambaia / DF-480');
	let noticeCategory = $state<'Edital' | 'Empresas Juniores' | 'Extensão' | 'Eventos' | 'Estágio'>('Edital');
	let noticeLink = $state('');
	let squadRole1 = $state('Software (Fullstack)');
	let squadRole2 = $state('Aeroespacial (Estruturas)');
	let selectedColor = $state<PostPaperColor>('yellow');
	let selectedPin = $state<PinColor>('gold');

	const paperColorOptions: { id: PostPaperColor; bg: string; name: string }[] = [
		{ id: 'yellow', bg: 'bg-[#fef9c3]', name: 'Amarelo' },
		{ id: 'kraft', bg: 'bg-[#fed7aa]', name: 'Kraft' },
		{ id: 'white', bg: 'bg-[#f8fafc]', name: 'Branco' },
		{ id: 'blue', bg: 'bg-[#dbeafe]', name: 'Azul' },
		{ id: 'pink', bg: 'bg-[#fce7f3]', name: 'Rosa' },
		{ id: 'green', bg: 'bg-[#dcfce7]', name: 'Verde' }
	];

	const pinOptions: { id: PinColor; name: string }[] = [
		{ id: 'red', name: 'Vermelho' },
		{ id: 'gold', name: 'Ouro' },
		{ id: 'blue', name: 'Azul' },
		{ id: 'emerald', name: 'Esmeralda' },
		{ id: 'silver', name: 'Prata' },
		{ id: 'purple', name: 'Púrpura' }
	];

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!title.trim() || !description.trim()) return;

		const randomRotations = ['rot-n-1', 'rot-p-1', 'rot-n-2', 'rot-p-2'];
		const rotation = randomRotations[Math.floor(Math.random() * randomRotations.length)];

		if (postCategory === 'aviso') {
			const newNotice: NoticePost = {
				id: 'notice-' + Date.now(),
				title: title.trim(),
				category: noticeCategory,
				organizer: $user.name + ' (' + $user.course.replace('Engenharia de ', '') + ')',
				description: description.trim(),
				expiresAt: 'Expira em 48h',
				linkUrl: noticeLink.trim() || undefined,
				paperColor: selectedColor,
				pinColor: selectedPin,
				rotation,
				tags: [noticeCategory, 'FGA'],
				createdAt: 'Agora mesmo',
				isRead: false
			};
			gameStore.createNotice(newNotice);
		} else {
			const newPost: CaravanaPost = {
				id: 'post-' + Date.now(),
				type: postCategory,
				title: title.trim(),
				description: description.trim(),
				author: {
					name: $user.name,
					course: $user.course,
					karma: $user.karma,
					level: $user.level,
					avatar: $user.avatarUrl
				},
				departureTime: postCategory === 'caravana' ? departureTime : undefined,
				origin: postCategory === 'caravana' ? origin : undefined,
				destination: postCategory === 'caravana' ? destination : undefined,
				requiredRoles: postCategory === 'squad' ? [
					{ role: squadRole1, course: 'Multidisciplinar', filled: false },
					{ role: squadRole2, course: 'Multidisciplinar', filled: false }
				] : undefined,
				attendees: postCategory === 'caravana' ? [
					{
						id: $user.id,
						name: $user.name.split(' ')[0],
						avatar: $user.avatarUrl,
						course: $user.course.replace('Engenharia de ', '')
					}
				] : [],
				maxCapacity: postCategory === 'caravana' ? 5 : undefined,
				urgency: postCategory === 'reporte' ? 'emergencia' : 'normal',
				paperColor: selectedColor,
				pinColor: selectedPin,
				rotation,
				createdAt: 'Agora mesmo',
				commentsCount: 0,
				userJoined: postCategory === 'caravana'
			};
			gameStore.createPost(newPost);
		}

		// Limpar e fechar
		title = '';
		description = '';
		onClose();
	}
</script>

{#if isOpen}
	<div 
		class="fixed inset-0 z-110 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
		role="dialog"
		aria-modal="true"
	>
		<!-- Fundo que fecha ao clicar fora -->
		<button 
			type="button" 
			class="absolute inset-0 w-full h-full cursor-default" 
			onclick={onClose}
			aria-label="Fechar modal"
		></button>

		<!-- Card de Post-it estilizado com Pin no Topo -->
		<div 
			class="relative z-10 w-full max-w-lg bg-[#fef9c3] rounded-xs shadow-[0_20px_50px_rgba(40,15,5,0.6)] border-2 border-amber-300/80 p-6 pt-9 transform transition-all -rotate-0.5"
		>
			<!-- Pin Tridimensional decorativo no topo -->
			<div class="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
				<Pin color={selectedPin} size="lg" />
			</div>

			<!-- Botão de Fechar -->
			<button 
				type="button" 
				onclick={onClose}
				class="absolute top-3 right-3 text-stone-600 hover:text-stone-900 p-1.5 rounded-full hover:bg-black/5"
				aria-label="Cancelar e fechar"
			>
				<X class="w-5 h-5" />
			</button>

			<div class="mb-4">
				<h2 class="text-xl font-black text-stone-900 font-sans flex items-center gap-2">
					<Sparkles class="w-5 h-5 text-amber-700" />
					<span>Pregoar Novo Post-it no Mural</span>
				</h2>
				<p class="text-xs text-stone-700 font-sans mt-0.5">
					Compartilhe caravanas, recrute squads ou alerte a comunidade da UnB Gama.
				</p>
			</div>

			<form onsubmit={handleSubmit} class="space-y-4">
				<!-- Seleção de Categoria do Post -->
				<div>
					<span class="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-1.5">
						O que você quer fixar?
					</span>
					<div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
						<button 
							type="button"
							onclick={() => { postCategory = 'caravana'; selectedColor = 'yellow'; }}
							class="flex items-center justify-center gap-1.5 py-2 px-2 rounded text-xs font-bold border transition-all {postCategory === 'caravana' ? 'bg-amber-800 text-amber-100 border-amber-900 shadow-xs' : 'bg-white/60 text-stone-800 border-stone-300'}"
						>
							<Car class="w-4 h-4" />
							<span>Caravana</span>
						</button>
						<button 
							type="button"
							onclick={() => { postCategory = 'squad'; selectedColor = 'white'; }}
							class="flex items-center justify-center gap-1.5 py-2 px-2 rounded text-xs font-bold border transition-all {postCategory === 'squad' ? 'bg-sky-800 text-sky-100 border-sky-900 shadow-xs' : 'bg-white/60 text-stone-800 border-stone-300'}"
						>
							<Users class="w-4 h-4" />
							<span>Squad PI</span>
						</button>
						<button 
							type="button"
							onclick={() => { postCategory = 'reporte'; selectedColor = 'pink'; selectedPin = 'red'; }}
							class="flex items-center justify-center gap-1.5 py-2 px-2 rounded text-xs font-bold border transition-all {postCategory === 'reporte' ? 'bg-rose-800 text-rose-100 border-rose-900 shadow-xs' : 'bg-white/60 text-stone-800 border-stone-300'}"
						>
							<AlertTriangle class="w-4 h-4" />
							<span>Alerta</span>
						</button>
						<button 
							type="button"
							onclick={() => { postCategory = 'aviso'; selectedColor = 'kraft'; }}
							class="flex items-center justify-center gap-1.5 py-2 px-2 rounded text-xs font-bold border transition-all {postCategory === 'aviso' ? 'bg-amber-950 text-amber-200 border-stone-900 shadow-xs' : 'bg-white/60 text-stone-800 border-stone-300'}"
						>
							<Bell class="w-4 h-4" />
							<span>Aviso</span>
						</button>
					</div>
				</div>

				<!-- Título -->
				<div>
					<label for="post-title" class="block text-xs font-bold text-stone-800 mb-1">
						Título do Chamado *
					</label>
					<input 
						id="post-title"
						type="text" 
						bind:value={title}
						required
						placeholder={postCategory === 'caravana' ? 'Ex: Caravana Noturna Metrô Taguatinga - 21h50' : postCategory === 'squad' ? 'Ex: Falta 1 Software e 1 Eletrônica para PI-1' : 'Ex: Comunicado da Atlética'}
						class="w-full px-3 py-2 text-sm bg-white/80 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-700 font-sans"
					/>
				</div>

				<!-- Campos Específicos por Tipo -->
				{#if postCategory === 'caravana'}
					<div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
						<div>
							<label for="post-dep-time" class="block font-bold text-stone-800 mb-1">Horário de Saída</label>
							<input 
								id="post-dep-time"
								type="text" 
								bind:value={departureTime}
								placeholder="21:50"
								class="w-full px-2.5 py-1.5 bg-white/80 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-700 font-mono"
							/>
						</div>
						<div>
							<label for="post-origin" class="block font-bold text-stone-800 mb-1">Local de Encontro</label>
							<input 
								id="post-origin"
								type="text" 
								bind:value={origin}
								placeholder="Estacionamento UAC"
								class="w-full px-2.5 py-1.5 bg-white/80 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-700"
							/>
						</div>
						<div>
							<label for="post-dest" class="block font-bold text-stone-800 mb-1">Destino</label>
							<input 
								id="post-dest"
								type="text" 
								bind:value={destination}
								placeholder="Metrô Samambaia / BRT"
								class="w-full px-2.5 py-1.5 bg-white/80 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-700"
							/>
						</div>
					</div>
				{:else if postCategory === 'squad'}
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
						<div>
							<label for="post-role-1" class="block font-bold text-stone-800 mb-1">Vaga 1 procurada</label>
							<input 
								id="post-role-1"
								type="text" 
								bind:value={squadRole1}
								class="w-full px-2.5 py-1.5 bg-white/80 border border-stone-300 rounded focus:outline-none"
							/>
						</div>
						<div>
							<label for="post-role-2" class="block font-bold text-stone-800 mb-1">Vaga 2 procurada</label>
							<input 
								id="post-role-2"
								type="text" 
								bind:value={squadRole2}
								class="w-full px-2.5 py-1.5 bg-white/80 border border-stone-300 rounded focus:outline-none"
							/>
						</div>
					</div>
				{:else if postCategory === 'aviso'}
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
						<div>
							<label for="post-notice-cat" class="block font-bold text-stone-800 mb-1">Categoria</label>
							<select 
								id="post-notice-cat"
								bind:value={noticeCategory}
								class="w-full px-2.5 py-1.5 bg-white/80 border border-stone-300 rounded focus:outline-none"
							>
								<option value="Edital">Edital</option>
								<option value="Empresas Juniores">Empresas Juniores</option>
								<option value="Extensão">Extensão</option>
								<option value="Eventos">Eventos</option>
								<option value="Estágio">Estágio</option>
							</select>
						</div>
						<div>
							<label for="post-link" class="block font-bold text-stone-800 mb-1">Link Externo (Opcional)</label>
							<input 
								id="post-link"
								type="url" 
								bind:value={noticeLink}
								placeholder="https://..."
								class="w-full px-2.5 py-1.5 bg-white/80 border border-stone-300 rounded focus:outline-none"
							/>
						</div>
					</div>
				{/if}

				<!-- Descrição -->
				<div>
					<label for="post-desc" class="block text-xs font-bold text-stone-800 mb-1">
						Descrição e Orientações *
					</label>
					<textarea 
						id="post-desc"
						bind:value={description}
						required
						rows="3"
						placeholder="Dê detalhes importantes para seus colegas da FGA..."
						class="w-full px-3 py-2 text-sm bg-white/80 border border-stone-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-700 font-sans"
					></textarea>
				</div>

				<!-- Escolha de Cor do Post-it e Cor do Pin -->
				<div class="flex items-center justify-between gap-4 pt-2 border-t border-black/10">
					<div>
						<span class="block text-[11px] font-bold text-stone-700 mb-1">Cor do Papel:</span>
						<div class="flex items-center gap-1.5">
							{#each paperColorOptions as col}
								<button 
									type="button" 
									onclick={() => selectedColor = col.id}
									class="w-5 h-5 rounded-full {col.bg} border-2 {selectedColor === col.id ? 'border-amber-900 scale-110' : 'border-stone-400'}"
									title={col.name}
									aria-label={col.name}
								></button>
							{/each}
						</div>
					</div>

					<div>
						<span class="block text-[11px] font-bold text-stone-700 mb-1">Alfinete de Bola:</span>
						<div class="flex items-center gap-1.5">
							{#each pinOptions as pin}
								<button 
									type="button" 
									onclick={() => selectedPin = pin.id}
									class="p-1 rounded-full transition-transform {selectedPin === pin.id ? 'scale-120 ring-2 ring-amber-950 ring-offset-1 bg-amber-200/60' : 'hover:scale-110 opacity-80 hover:opacity-100'}"
									title={pin.name}
									aria-label={pin.name}
								>
									<Pin color={pin.id} size="sm" />
								</button>
							{/each}
						</div>
					</div>
				</div>

				<!-- Botão de Submeter -->
				<div class="pt-3 flex items-center justify-end gap-2">
					<button 
						type="button" 
						onclick={onClose}
						class="px-3 py-2 text-xs font-bold text-stone-700 hover:text-stone-900"
					>
						Cancelar
					</button>
					<button 
						type="submit"
						class="px-5 py-2.5 rounded-md font-bold text-sm bg-gradient-to-r from-amber-800 to-amber-950 text-amber-50 hover:from-amber-900 hover:to-black shadow-md flex items-center gap-2 active:scale-95 transition-all"
					>
						<Plus class="w-4 h-4" />
						<span>Espetar no Mural (+60 XP)</span>
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
