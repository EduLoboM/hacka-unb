<script lang="ts">
	import { gameStore, LEVEL_DATA, getLevelInfo } from '$lib/stores/gameStore';
	import type { EngineeringCourse } from '$lib/types/gamification';
	import { playStampSound, playPinSound } from '$lib/utils/soundEffects';
	import { 
		X, 
		RotateCw, 
		Check, 
		Copy, 
		Pencil, 
		Flame, 
		Sparkles, 
		Award, 
		CheckCircle2, 
		GraduationCap, 
		Volume2, 
		VolumeX, 
		RotateCcw,
		QrCode,
		ShieldCheck,
		Camera,
		ExternalLink
	} from 'lucide-svelte';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
	}

	let { isOpen, onClose }: Props = $props();

	const user = gameStore.user;
	const quests = gameStore.quests;

	// Estado local: virar crachá (frente ou verso)
	let isFlipped = $state(false);
	let isEditingName = $state(false);
	let editNameValue = $state('');
	let isEditingCourse = $state(false);
	let isCopiedMatricula = $state(false);
	let showAvatarPicker = $state(false);
	let cardHeight = $state<number>(0);
	let measuredFrontHeight = $state<number>(0);

	$effect(() => {
		if (measuredFrontHeight > 0) {
			cardHeight = measuredFrontHeight;
		}
	});

	const availableCourses: EngineeringCourse[] = [
		'Engenharia de Software',
		'Engenharia Aeroespacial',
		'Engenharia Automotiva',
		'Engenharia Eletrônica',
		'Engenharia de Energia',
		'Engenharias - FGA Geral'
	];

	const sampleAvatars = [
		{ name: 'Estudante 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80' },
		{ name: 'Estudante 2', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=160&auto=format&fit=crop&q=80' },
		{ name: 'Estudante 3', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80' },
		{ name: 'Estudante 4', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80' }
	];

	// Informações de nível
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

	function toggleFlip() {
		if ($user.soundEnabled) playPinSound();
		isFlipped = !isFlipped;
	}

	function handleCopyMatricula() {
		if (typeof navigator !== 'undefined' && navigator.clipboard) {
			navigator.clipboard.writeText($user.matricula);
			isCopiedMatricula = true;
			if ($user.soundEnabled) playStampSound();
			setTimeout(() => {
				isCopiedMatricula = false;
			}, 2000);
		}
	}

	function startEditName() {
		editNameValue = $user.name;
		isEditingName = true;
	}

	function saveName() {
		if (editNameValue.trim()) {
			gameStore.updateProfile({ name: editNameValue.trim() });
		}
		isEditingName = false;
	}

	function handleCourseChange(course: EngineeringCourse) {
		gameStore.updateProfile({ course });
		isEditingCourse = false;
	}

	function selectAvatar(url: string) {
		gameStore.updateProfile({ avatarUrl: url });
		showAvatarPicker = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isOpen) {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<div 
		class="fixed inset-0 z-120 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fade-in"
		role="dialog"
		aria-modal="true"
		aria-label="Crachá e Carteirinha Estudantil da UnB"
	>
		<!-- Fundo escuro para fechar ao clicar -->
		<button 
			type="button" 
			class="fixed inset-0 w-full h-full cursor-default -z-10" 
			onclick={onClose}
			aria-label="Fechar carteirinha"
		></button>

		<!-- Container Principal do Crachá Suspenso -->
		<div class="relative w-full max-w-[440px] my-auto flex flex-col items-center select-none">
			
			<!-- ============================================== -->
			<!-- CORDÃO DE PESCOÇO REALISTA (LANYARD DA UnB)    -->
			<!-- ============================================== -->
			<div class="w-full flex flex-col items-center pointer-events-none relative z-20 -mb-3 sm:-mb-4">
				<!-- Fita de Tecido com textura e estampa UnB -->
				<div class="h-10 sm:h-14 w-20 sm:w-24 relative overflow-hidden flex items-center justify-center shadow-lg">
					<!-- Fita esquerda -->
					<div class="absolute inset-y-0 left-2 w-7 bg-gradient-to-b from-[#003366] via-[#006633] to-[#003366] border-x border-[#002244] shadow-md -rotate-6 transform origin-top flex flex-col items-center justify-center py-1">
						<span class="text-[6px] text-amber-200/90 font-mono tracking-tighter uppercase writing-vertical transform -rotate-90 whitespace-nowrap">
							UnB • FGA
						</span>
					</div>
					<!-- Fita direita -->
					<div class="absolute inset-y-0 right-2 w-7 bg-gradient-to-b from-[#006633] via-[#003366] to-[#006633] border-x border-[#002244] shadow-md rotate-6 transform origin-top flex flex-col items-center justify-center py-1">
						<span class="text-[6px] text-amber-200/90 font-mono tracking-tighter uppercase writing-vertical transform -rotate-90 whitespace-nowrap">
							UnB • FGA
						</span>
					</div>
					<!-- Fivela metálica de união central -->
					<div class="absolute bottom-1 w-10 h-3.5 bg-gradient-to-r from-stone-400 via-stone-200 to-stone-400 rounded-xs border border-stone-500 shadow-sm flex items-center justify-center">
						<div class="w-2.5 h-1 bg-stone-700/60 rounded-xs"></div>
					</div>
				</div>

				<!-- Presilha Metálica Cromada Tipo Jacaré com Fivela Giratória -->
				<div class="flex flex-col items-center -mt-0.5">
					<!-- Argola cromada -->
					<div class="w-3.5 h-3.5 rounded-full border-2 border-stone-400 bg-stone-200 shadow-inner"></div>
					<!-- Presilha jacaré/grampo que atravessa a fenda da capinha plástica -->
					<div class="w-5 h-5 bg-gradient-to-b from-stone-300 via-stone-100 to-stone-400 border border-stone-500 rounded-sm shadow-md flex items-center justify-center -mt-1 z-30">
						<div class="w-1.5 h-2 bg-stone-600/70 rounded-xs"></div>
					</div>
				</div>
			</div>

			<!-- ============================================== -->
			<!-- CAPINHA PLÁSTICA TRANSPARENTE (PORTA-CRACHÁ)  -->
			<!-- ============================================== -->
			<div class="relative w-full rounded-2xl p-2.5 sm:p-3 bg-white/20 backdrop-blur-md border-2 border-white/60 shadow-[0_25px_60px_rgba(0,0,0,0.65),0_0_20px_rgba(255,255,255,0.2)]">
				
				<!-- Fenda superior para o clipe do crachá -->
				<div class="w-14 h-2.5 mx-auto -mt-1 mb-2 bg-stone-900/60 rounded-full border border-white/40 shadow-inner flex items-center justify-center">
					<div class="w-8 h-1 bg-stone-950/80 rounded-full"></div>
				</div>

				<!-- Reflexo de Luz no Plástico Transparente (Sheen diagonal realista) -->
				<div class="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-tr from-transparent via-white/15 to-transparent z-30"></div>

				<!-- Barra Superior de Ações do Crachá (Virar 3D & Fechar) -->
				<div class="relative z-40 flex items-center justify-between gap-2 px-1 mb-2.5">
					<!-- Seletor Rápido de Lado (Frente / Verso) -->
					<div class="flex items-center gap-1 bg-stone-900/70 backdrop-blur-sm p-0.5 rounded-full border border-white/20 shadow-xs">
						<button 
							type="button" 
							onclick={() => { if (isFlipped) toggleFlip(); }}
							class="px-2.5 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 {!isFlipped ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-300 hover:text-white'}"
						>
							<span>🪪 Carteirinha</span>
						</button>
						<button 
							type="button" 
							onclick={() => { if (!isFlipped) toggleFlip(); }}
							class="px-2.5 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 {isFlipped ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-300 hover:text-white'}"
						>
							<Award class="w-3 h-3" />
							<span>Missões & Badges</span>
						</button>
					</div>

					<!-- Botão Virar Crachá (3D) + Botão Fechar -->
					<div class="flex items-center gap-1.5">
						<button 
							type="button" 
							onclick={toggleFlip}
							class="px-2.5 py-1 rounded-full bg-stone-900/80 hover:bg-stone-900 text-amber-300 text-xs font-bold border border-amber-500/40 shadow-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
							title="Virar Crachá"
							aria-label="Virar crachá"
						>
							<RotateCw class="w-3.5 h-3.5 transition-transform duration-300 {isFlipped ? 'rotate-180' : ''}" />
							<span class="hidden sm:inline">Virar</span>
						</button>

						<button 
							type="button" 
							onclick={onClose}
							class="w-7 h-7 rounded-full bg-stone-900/80 hover:bg-rose-900/90 text-stone-300 hover:text-white border border-white/20 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
							title="Fechar Carteirinha (Esc)"
							aria-label="Fechar"
						>
							<X class="w-4 h-4" />
						</button>
					</div>
				</div>

				<!-- ============================================== -->
				<!-- CORPO DO CARTÃO: FRENTE OU VERSO (3D FLIP)    -->
				<!-- ============================================== -->
				<div 
					class="w-full relative transition-[height] duration-300"
					style="min-height: {cardHeight > 0 ? cardHeight + 'px' : 'auto'};"
				>
					{#if !isFlipped}
						<!-- ============================================== -->
						<!-- LADO 1: FRENTE DA CARTEIRINHA ESTUDANTIL DA UnB-->
						<!-- ============================================== -->
						<div 
							bind:clientHeight={measuredFrontHeight}
							class="card-face animate-flip-front bg-[#fafaf9] rounded-xl overflow-hidden border border-stone-300/90 shadow-xl flex flex-col justify-between text-stone-900 relative w-full"
						>
							
							<!-- Selo de Fundo / Marca D'água Oficial da UnB -->
							<div class="absolute inset-0 pointer-events-none opacity-[0.035] flex items-center justify-center overflow-hidden">
								<span class="font-black text-9xl tracking-widest uppercase">UnB</span>
							</div>

							<!-- Cabeçalho Oficial UnB / FGA -->
							<div class="bg-gradient-to-r from-[#003366] via-[#004d80] to-[#006633] text-white p-3 sm:p-3.5 relative overflow-hidden border-b-2 border-amber-400/80 shadow-xs shrink-0">
								<!-- Detalhes gráficos do cabeçalho -->
								<div class="absolute -right-4 -bottom-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none"></div>
								<div class="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400"></div>

								<div class="flex items-center justify-between gap-2 pl-1.5">
									<!-- Brasão Vetorial UnB e Nomes Institucionais -->
									<div class="flex items-center gap-2.5">
										<!-- Logo UnB em SVG Vetorial Fiel -->
										<div class="w-9 h-9 rounded-md bg-white p-1 flex items-center justify-center shadow-xs shrink-0">
											<svg viewBox="0 0 100 100" class="w-full h-full" aria-hidden="true">
												<!-- Colunas clássicas do logo UnB (Oscar Niemeyer) -->
												<path d="M 22 18 C 38 18, 48 35, 48 50 C 48 65, 38 82, 22 82 C 34 72, 38 60, 38 50 C 38 40, 34 28, 22 18 Z" fill="#003366" />
												<path d="M 78 18 C 62 18, 52 35, 52 50 C 52 65, 62 82, 78 82 C 66 72, 62 60, 62 50 C 62 40, 66 28, 78 18 Z" fill="#006633" />
											</svg>
										</div>

										<div>
											<div class="text-[8px] font-mono tracking-widest text-emerald-200 uppercase font-bold leading-tight">
												República Federativa do Brasil
											</div>
											<h2 class="font-extrabold text-xs sm:text-sm tracking-tight text-white leading-tight uppercase font-sans">
												Universidade de Brasília
											</h2>
											<div class="text-[9px] font-semibold text-amber-200 tracking-wide">
												Faculdade do Gama • FGA
											</div>
										</div>
									</div>

									<!-- Selo de Validação do Período -->
									<div class="text-right shrink-0">
										<div class="inline-block bg-amber-400 text-stone-950 font-mono font-black text-[9px] px-1.5 py-0.5 rounded shadow-xs">
											2026/2
										</div>
										<div class="text-[7px] text-white/80 font-mono tracking-tighter mt-0.5 block">
											CIE • FGA
										</div>
									</div>
								</div>
							</div>

							<!-- Faixa de Identificação Estudantil -->
							<div class="bg-stone-200/90 px-3 py-1 border-b border-stone-300 flex items-center justify-between text-[9px] font-mono text-stone-700 font-bold uppercase tracking-wider shrink-0">
								<span>Carteira de Identidade Estudantil</span>
								<span class="text-emerald-800 font-black flex items-center gap-1">
									<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
									Regular / Ativo
								</span>
							</div>

							<!-- Dados Centrais: Foto 3x4 + Informações do Estudante -->
							<div class="p-3 sm:p-4 flex gap-3 sm:gap-4 items-start relative z-10">
								
								<!-- Foto 3x4 com Moldura e Carimbo Oficial -->
								<div class="flex flex-col items-center shrink-0">
									<div class="relative w-22 sm:w-26 h-28 sm:h-32 rounded-md overflow-hidden bg-stone-200 border-2 border-stone-400 shadow-md">
										<img 
											src={$user.avatarUrl} 
											alt={$user.name} 
											class="w-full h-full object-cover"
										/>

										<!-- Carimbo D'água Institucional sobre a foto -->
										<div class="absolute bottom-1 right-1 pointer-events-none opacity-40">
											<div class="border border-stone-900 rounded-full w-8 h-8 flex items-center justify-center text-[7px] font-mono font-black text-stone-900 -rotate-12">
												UnB/FGA
											</div>
										</div>

										<!-- Botão para trocar foto do avatar -->
										<button 
											type="button" 
											onclick={() => showAvatarPicker = !showAvatarPicker}
											class="absolute top-1 right-1 p-1 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white text-[9px] transition-colors shadow-xs"
											title="Trocar Foto"
											aria-label="Trocar Foto"
										>
											<Camera class="w-3 h-3" />
										</button>
									</div>

									<!-- Selo de Nível Universitário -->
									<div class="mt-1.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950 font-mono font-black text-[10px] shadow-xs">
										<span>Nv. {$user.level}</span>
										<span class="text-stone-400">•</span>
										<span class="text-emerald-700">+{$user.xp} XP</span>
									</div>
								</div>

								<!-- Informações do Estudante -->
								<div class="flex-1 flex flex-col min-w-0 space-y-1.5 sm:space-y-2">
									
									<!-- Nome do Aluno -->
									<div>
										<div class="text-[8px] font-mono uppercase text-stone-500 font-bold leading-none">
											Nome do Aluno(a)
										</div>
										{#if isEditingName}
											<div class="flex items-center gap-1 mt-1">
												<input 
													type="text" 
													bind:value={editNameValue} 
													class="w-full text-xs font-bold px-2 py-0.5 rounded border border-emerald-600 bg-white focus:outline-none"
													maxlength={30}
												/>
												<button 
													type="button" 
													onclick={saveName} 
													class="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
													title="Salvar Nome"
												>
													<Check class="w-3.5 h-3.5" />
												</button>
											</div>
										{:else}
											<div class="flex items-center gap-1 mt-0.5">
												<span class="font-black text-sm sm:text-base text-stone-950 truncate leading-tight tracking-tight">
													{$user.name}
												</span>
												<button 
													type="button" 
													onclick={startEditName}
													class="text-stone-400 hover:text-stone-700 p-0.5"
													title="Editar Nome"
													aria-label="Editar Nome"
												>
													<Pencil class="w-3 h-3" />
												</button>
											</div>
										{/if}
									</div>

									<!-- Matrícula Oficial com Botão de Copiar -->
									<div class="flex items-center justify-between gap-2 bg-stone-100 px-2 py-1 rounded border border-stone-200">
										<div>
											<span class="text-[8px] font-mono uppercase text-stone-500 font-bold block leading-none">
												Matrícula UnB
											</span>
											<span class="font-mono font-bold text-xs sm:text-sm text-stone-900 tracking-wider">
												{$user.matricula}
											</span>
										</div>

										<button 
											type="button" 
											onclick={handleCopyMatricula}
											class="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 text-[9px] font-mono font-bold shadow-2xs active:scale-95 transition-all"
											title="Copiar Matrícula"
										>
											{#if isCopiedMatricula}
												<Check class="w-2.5 h-2.5 text-emerald-600" />
												<span class="text-emerald-700">Copiado</span>
											{:else}
												<Copy class="w-2.5 h-2.5 text-stone-500" />
												<span>Copiar</span>
											{/if}
										</button>
									</div>

									<!-- Curso da FGA -->
									<div>
										<div class="flex items-center justify-between">
											<span class="text-[8px] font-mono uppercase text-stone-500 font-bold leading-none">
												Curso / Habilitação
											</span>
											<button 
												type="button" 
												onclick={() => isEditingCourse = !isEditingCourse}
												class="text-[8px] text-emerald-800 font-bold hover:underline"
											>
												{isEditingCourse ? 'Fechar' : 'Alterar'}
											</button>
										</div>

										{#if isEditingCourse}
											<div class="grid grid-cols-1 gap-1 mt-1 max-h-24 overflow-y-auto bg-white p-1 rounded border border-stone-300 text-[10px]">
												{#each availableCourses as c}
													<button 
														type="button" 
														onclick={() => handleCourseChange(c)}
														class="text-left px-1.5 py-0.5 rounded hover:bg-emerald-50 hover:text-emerald-950 font-medium {c === $user.course ? 'bg-emerald-100 font-bold text-emerald-900' : 'text-stone-700'}"
													>
														{c}
													</button>
												{/each}
											</div>
										{:else}
											<div class="text-[11px] sm:text-xs font-extrabold text-emerald-950 flex items-center gap-1 mt-0.5 leading-tight">
												<GraduationCap class="w-3.5 h-3.5 text-emerald-700 shrink-0" />
												<span class="truncate">{$user.course}</span>
											</div>
										{/if}
									</div>

									<!-- Semestre, Título e Campus -->
									<div class="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-mono text-stone-700">
										<div>
											<span class="text-[7.5px] uppercase text-stone-400 block font-bold leading-none">
												Semestre
											</span>
											<span class="font-bold text-stone-900">
												{$user.semester}º Semestre
											</span>
										</div>
										<div>
											<span class="text-[7.5px] uppercase text-stone-400 block font-bold leading-none">
												Campus
											</span>
											<span class="font-bold text-stone-900">
												Gama (FGA)
											</span>
										</div>
									</div>

									<!-- Título Honorário / Gamificação -->
									<div class="text-[10px] font-semibold {currentLevelInfo.titleColor} flex items-center gap-1 pt-0.5">
										<span>{currentLevelInfo.badgeIcon}</span>
										<span class="truncate">{$user.title}</span>
									</div>

								</div>
							</div>

							<!-- Modal Seletor de Avatar Rápido -->
							{#if showAvatarPicker}
								<div class="mx-3 mb-2 p-2 bg-stone-100 rounded-lg border border-stone-300 shadow-sm animate-fade-in">
									<div class="flex items-center justify-between text-[10px] font-bold text-stone-800 mb-1.5">
										<span>Escolha uma foto de estudante:</span>
										<button type="button" onclick={() => showAvatarPicker = false} class="text-stone-500 hover:text-stone-800">
											<X class="w-3 h-3" />
										</button>
									</div>
									<div class="flex items-center justify-around gap-2">
										{#each sampleAvatars as sample}
											<button 
												type="button" 
												onclick={() => selectAvatar(sample.url)}
												class="w-10 h-10 rounded-full overflow-hidden border-2 hover:border-emerald-600 transition-all hover:scale-105"
											>
												<img src={sample.url} alt="" class="w-full h-full object-cover" />
											</button>
										{/each}
									</div>
								</div>
							{/if}

							<!-- Rodapé de Segurança da Carteirinha: Chip, Código de Barras e Holograma -->
							<div class="bg-gradient-to-r from-stone-100 via-stone-50 to-stone-100 px-3 py-2 border-t border-stone-300 flex items-center justify-between gap-3 text-stone-800 shrink-0">
								
								<!-- Chip Eletrônico Universitário de Aproximação (Catracas / RU) -->
								<div class="flex flex-col items-center">
									<!-- Visual metálico do microchip dourado -->
									<div class="w-7 h-5.5 rounded-xs bg-gradient-to-br from-amber-300 via-yellow-200 to-amber-500 border border-amber-600 shadow-2xs flex flex-col justify-between p-0.5">
										<div class="flex justify-between">
											<div class="w-1.5 h-1 border-b border-r border-amber-700"></div>
											<div class="w-1.5 h-1 border-b border-l border-amber-700"></div>
										</div>
										<div class="w-full h-0.5 bg-amber-700/60 my-auto"></div>
										<div class="flex justify-between">
											<div class="w-1.5 h-1 border-t border-r border-amber-700"></div>
											<div class="w-1.5 h-1 border-t border-l border-amber-700"></div>
										</div>
									</div>
									<span class="text-[6.5px] font-mono text-stone-500 font-bold uppercase mt-0.5">
										Acesso RU
									</span>
								</div>

								<!-- Código de Barras Estudantil Autêntico -->
								<div class="flex-1 flex flex-col items-center justify-center">
									<!-- Barras desenhadas em SVG -->
									<svg viewBox="0 0 160 22" class="w-full max-w-[170px] h-5" aria-hidden="true">
										<g fill="#1c1917">
											<rect x="0" y="0" width="2" height="22" />
											<rect x="4" y="0" width="1" height="22" />
											<rect x="7" y="0" width="3" height="22" />
											<rect x="12" y="0" width="1" height="22" />
											<rect x="15" y="0" width="2" height="22" />
											<rect x="19" y="0" width="4" height="22" />
											<rect x="25" y="0" width="1" height="22" />
											<rect x="28" y="0" width="3" height="22" />
											<rect x="33" y="0" width="2" height="22" />
											<rect x="37" y="0" width="1" height="22" />
											<rect x="40" y="0" width="3" height="22" />
											<rect x="45" y="0" width="2" height="22" />
											<rect x="49" y="0" width="1" height="22" />
											<rect x="52" y="0" width="4" height="22" />
											<rect x="58" y="0" width="2" height="22" />
											<rect x="62" y="0" width="1" height="22" />
											<rect x="65" y="0" width="3" height="22" />
											<rect x="70" y="0" width="2" height="22" />
											<rect x="74" y="0" width="1" height="22" />
											<rect x="77" y="0" width="4" height="22" />
											<rect x="83" y="0" width="2" height="22" />
											<rect x="87" y="0" width="3" height="22" />
											<rect x="92" y="0" width="1" height="22" />
											<rect x="95" y="0" width="2" height="22" />
											<rect x="99" y="0" width="4" height="22" />
											<rect x="105" y="0" width="1" height="22" />
											<rect x="108" y="0" width="3" height="22" />
											<rect x="113" y="0" width="2" height="22" />
											<rect x="117" y="0" width="1" height="22" />
											<rect x="120" y="0" width="4" height="22" />
											<rect x="126" y="0" width="2" height="22" />
											<rect x="130" y="0" width="1" height="22" />
											<rect x="133" y="0" width="3" height="22" />
											<rect x="138" y="0" width="2" height="22" />
											<rect x="142" y="0" width="1" height="22" />
											<rect x="145" y="0" width="4" height="22" />
											<rect x="151" y="0" width="2" height="22" />
											<rect x="155" y="0" width="3" height="22" />
										</g>
									</svg>
									<span class="font-mono text-[8px] text-stone-600 tracking-widest mt-0.5">
										*{$user.matricula.replace('/', '')}*
									</span>
								</div>

								<!-- Selo Holográfico com Efeito Iridescente -->
								<div class="relative shrink-0 flex flex-col items-center">
									<div class="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-rose-300 to-cyan-300 p-0.5 shadow-sm border border-stone-400/80 flex items-center justify-center animate-pulse">
										<div class="w-full h-full rounded-full bg-white/70 flex items-center justify-center">
											<ShieldCheck class="w-4 h-4 text-emerald-800" />
										</div>
									</div>
									<span class="text-[6px] font-mono text-stone-600 font-bold uppercase mt-0.5">
										MEC / UnB
									</span>
								</div>

							</div>

						</div>
					{:else}
						<div 
							class="card-face animate-flip-back bg-[#fcf9f4] rounded-xl overflow-hidden border border-stone-300/90 shadow-xl flex flex-col justify-between text-stone-900 relative w-full"
							style="height: {cardHeight > 0 ? cardHeight + 'px' : 'auto'};"
						>
							
							<!-- Cabeçalho do Verso -->
							<div class="bg-gradient-to-r from-[#8c6027] via-[#a87432] to-[#593910] text-amber-50 p-2.5 sm:p-3 border-b-2 border-amber-300/60 shadow-xs flex items-center justify-between shrink-0">
								<div class="flex items-center gap-2">
									<Award class="w-4 h-4 text-amber-300" />
									<div>
										<h3 class="font-black text-xs sm:text-sm tracking-tight text-white uppercase leading-tight font-sans">
											Atividades & Conquistas
										</h3>
										<span class="text-[8px] font-mono text-amber-200 block uppercase">
											Mural Universitário FGA
										</span>
									</div>
								</div>

								<!-- Karma & XP Compactos -->
								<div class="flex items-center gap-1.5 text-[10px] font-mono">
									<span class="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 font-black">
										<Flame class="w-3 h-3 text-amber-900" />
										{$user.karma} Karma
									</span>
								</div>
							</div>

							<!-- Conteúdo do Verso com Scroll Suave -->
							<div class="flex-1 p-3 sm:p-3.5 space-y-2.5 overflow-y-auto min-h-0">
								
								<!-- Barra de Progresso de Nível -->
								<div class="bg-white rounded-lg p-2.5 border border-stone-300 shadow-2xs">
									<div class="flex items-center justify-between text-xs font-bold text-stone-900 mb-1">
										<span class="flex items-center gap-1">
											<span>Nv. {$user.level}</span>
											<span class="text-stone-400">→</span>
											<span class="text-emerald-800">Nv. {nextLevelInfo.level}</span>
										</span>
										<span class="font-mono text-[11px] text-stone-600">
											{progressPercent}%
										</span>
									</div>

									<div class="w-full h-2.5 rounded-full bg-stone-200 overflow-hidden border border-stone-300 p-0.5">
										<div 
											class="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 transition-all duration-500"
											style="width: {progressPercent}%;"
										></div>
									</div>

									<div class="flex items-center justify-between text-[9px] font-mono text-stone-500 mt-1">
										<span>{$user.xp} XP acumulado</span>
										<span>Meta: {nextLevelInfo.minXp} XP</span>
									</div>

									<div class="mt-1.5 pt-1.5 border-t border-stone-200 text-[10px] text-stone-600">
										<strong>Benefício ativo:</strong> {currentLevelInfo.perk}
									</div>
								</div>

								<!-- Missões Diárias -->
								<div>
									<div class="flex items-center justify-between mb-1.5">
										<span class="text-[10px] font-mono uppercase font-black text-stone-700 tracking-wider">
											Missões Diárias
										</span>
										<span class="text-[8px] font-mono text-stone-500 bg-stone-200 px-1 rounded">
											Reseta 00h
										</span>
									</div>

									<div class="space-y-1.5">
										{#each $quests as quest (quest.id)}
											<div class="p-2 rounded-md border text-xs {quest.isCompleted ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-white border-stone-200 text-stone-800'}">
												<div class="flex items-center justify-between gap-1 mb-0.5">
													<div class="flex items-center gap-1 font-bold text-[11px]">
														<span>{quest.icon}</span>
														<span>{quest.title}</span>
													</div>
													{#if quest.isCompleted}
														<CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
													{:else}
														<span class="text-[9px] font-mono font-bold text-amber-800 bg-amber-100 px-1 py-0.2 rounded border border-amber-200 shrink-0">
															+{quest.xpReward} XP
														</span>
													{/if}
												</div>

												<p class="text-[10px] text-stone-600 leading-tight mb-1">
													{quest.description}
												</p>

												<div class="w-full h-1 rounded-full bg-stone-200 overflow-hidden">
													<div 
														class="h-full {quest.isCompleted ? 'bg-emerald-600' : 'bg-amber-600'}"
														style="width: {(quest.progress / quest.maxProgress) * 100}%;"
													></div>
												</div>
											</div>
										{/each}
									</div>
								</div>

								<!-- Medalhas Universitárias -->
								<div>
									<div class="flex items-center justify-between mb-1.5">
										<span class="text-[10px] font-mono uppercase font-black text-stone-700 tracking-wider">
											Medalhas Desbloqueadas ({$user.badges.length}/8)
										</span>
									</div>

									<div class="grid grid-cols-4 gap-1.5">
										{#each $user.badges as badge}
											<div 
												class="flex flex-col items-center justify-center p-1.5 rounded bg-white border border-stone-300 shadow-2xs hover:border-amber-500 transition-all cursor-help"
												title="{badge.name}: {badge.description}"
											>
												<span class="text-base">{badge.icon}</span>
												<span class="text-[8px] font-bold text-stone-800 text-center leading-tight truncate w-full mt-0.5">
													{badge.name}
												</span>
											</div>
										{/each}
										{#each Array(4 - ($user.badges.length % 4 === 0 ? 4 : $user.badges.length % 4)) as _}
											<div class="flex flex-col items-center justify-center p-1.5 rounded bg-stone-100 border border-dashed border-stone-300 opacity-60">
												<span class="text-xs text-stone-400">🔒</span>
												<span class="text-[7.5px] text-stone-400">Bloqueada</span>
											</div>
										{/each}
									</div>
								</div>

								<!-- Termos de Validação do Crachá e Assinatura -->
								<div class="pt-2 border-t border-stone-200 flex items-end justify-between text-[8px] font-mono text-stone-500">
									<div class="max-w-[180px] leading-tight">
										Uso pessoal e intransferível. Válido em toda a Universidade de Brasília e transporte estudantil do DF.
									</div>
									<div class="text-right">
										<div class="w-20 border-b border-stone-400 mb-0.5"></div>
										<span class="font-bold text-stone-700 block">Diretoria FGA</span>
									</div>
								</div>

							</div>

							<!-- Rodapé com Ações Rápidas (Sons & Reset) -->
							<div class="bg-stone-100 px-3 py-2 border-t border-stone-300 flex items-center justify-between text-[11px] text-stone-600 shrink-0 mt-auto">
								<button 
									type="button" 
									onclick={() => gameStore.toggleSound()}
									class="flex items-center gap-1 hover:text-stone-900 font-medium"
									title={$user.soundEnabled ? 'Silenciar Áudio' : 'Ativar Efeitos Sonoros'}
								>
									{#if $user.soundEnabled}
										<Volume2 class="w-3.5 h-3.5 text-emerald-700" />
										<span>Áudio Ativo</span>
									{:else}
										<VolumeX class="w-3.5 h-3.5 text-stone-400" />
										<span>Mudo</span>
									{/if}
								</button>

								<button 
									type="button" 
									onclick={() => toggleFlip()}
									class="flex items-center gap-1 font-bold text-emerald-800 hover:text-emerald-950"
								>
									<RotateCw class="w-3 h-3" />
									<span>Voltar para Frente</span>
								</button>

								<button 
									type="button" 
									onclick={() => gameStore.resetToDefaults()}
									class="flex items-center gap-0.5 text-stone-400 hover:text-stone-700 text-[10px]"
									title="Resetar dados para padrão"
								>
									<RotateCcw class="w-3 h-3" />
									<span>Reset</span>
								</button>
							</div>

						</div>
					{/if}
				</div>

			</div>

		</div>
	</div>
{/if}

<style>
	/* Animação suave e nítida de Flip 3D para o Crachá */
	@keyframes flipFrontIn {
		0% {
			transform: perspective(1200px) rotateY(-80deg) scale(0.95);
			opacity: 0;
		}
		100% {
			transform: perspective(1200px) rotateY(0deg) scale(1);
			opacity: 1;
		}
	}

	@keyframes flipBackIn {
		0% {
			transform: perspective(1200px) rotateY(80deg) scale(0.95);
			opacity: 0;
		}
		100% {
			transform: perspective(1200px) rotateY(0deg) scale(1);
			opacity: 1;
		}
	}

	.animate-flip-front {
		animation: flipFrontIn 0.32s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
		transform-origin: center center;
	}

	.animate-flip-back {
		animation: flipBackIn 0.32s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
		transform-origin: center center;
	}

	@keyframes fadeIn {
		from { opacity: 0; transform: scale(0.96); }
		to { opacity: 1; transform: scale(1); }
	}

	.animate-fade-in {
		animation: fadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}
</style>
