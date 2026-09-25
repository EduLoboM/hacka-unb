import { writable, derived, get } from 'svelte/store';
import type { 
	UserProfile, 
	Quest, 
	Badge, 
	LevelInfo, 
	ToastNotification, 
	CaravanaPost, 
	BusReport, 
	NoticePost 
} from '$lib/types/gamification';
import { playPinSound, playStampSound, playXpSound, playLevelUpSound } from '$lib/utils/soundEffects';

export const LEVEL_DATA: LevelInfo[] = [
	{ level: 1, title: 'Calouro Perdido', minXp: 0, maxXp: 100, badgeIcon: '🌱', titleColor: 'text-stone-600', perk: 'Acesso liberado ao mural e caravanas' },
	{ level: 2, title: 'Desbravador do UAC', minXp: 100, maxXp: 250, badgeIcon: '🗺️', titleColor: 'text-emerald-700', perk: 'Pode confirmar presença em até 3 caravanas' },
	{ level: 3, title: 'Freguês do RU', minXp: 250, maxXp: 450, badgeIcon: '🍽️', titleColor: 'text-amber-700', perk: 'Pode votar na lotação dos ônibus' },
	{ level: 4, title: 'Sobrevivente de Cálculo 1', minXp: 450, maxXp: 700, badgeIcon: '📐', titleColor: 'text-blue-700', perk: 'Desbloqueia pin azul para seus posts' },
	{ level: 5, title: 'Corredor da 480', minXp: 700, maxXp: 1000, badgeIcon: '🏃', titleColor: 'text-cyan-700', perk: 'Criação de caravana com badge destacada' },
	{ level: 6, title: 'Rato de Bancada do LDEL', minXp: 1000, maxXp: 1400, badgeIcon: '🔬', titleColor: 'text-purple-700', perk: 'Visualiza estatísticas de pontualidade' },
	{ level: 7, title: 'Soldador do Galpão', minXp: 1400, maxXp: 1900, badgeIcon: '⚡', titleColor: 'text-orange-700', perk: 'Criação de Squad multidisciplinar com até 5 vagas' },
	{ level: 8, title: 'Veterano de APC', minXp: 1900, maxXp: 2500, badgeIcon: '💻', titleColor: 'text-indigo-700', perk: 'Pins verdes de segurança em reportes' },
	{ level: 9, title: 'Capitão de Caravana', minXp: 2500, maxXp: 3200, badgeIcon: '🚗', titleColor: 'text-rose-700', perk: '+10% XP bônus em caravanas criadas' },
	{ level: 10, title: 'Estrategista de PI-1', minXp: 3200, maxXp: 4000, badgeIcon: '♟️', titleColor: 'text-yellow-700', perk: 'Selo de verificação em recrutamentos de PI' },
	{ level: 11, title: 'Oráculo do BRT', minXp: 4000, maxXp: 5000, badgeIcon: '🚌', titleColor: 'text-teal-700', perk: 'Votos de ônibus têm peso duplo na comunidade' },
	{ level: 12, title: 'Mestre Multidisciplinar', minXp: 5000, maxXp: 6200, badgeIcon: '🛠️', titleColor: 'text-sky-700', perk: 'Post-its com fita washi dourada' },
	{ level: 13, title: 'Guerreiro de Física 2', minXp: 6200, maxXp: 7600, badgeIcon: '⚛️', titleColor: 'text-violet-700', perk: 'Prioridade nas notificações de carona' },
	{ level: 14, title: 'Arquiteto de Software Livre', minXp: 7600, maxXp: 9200, badgeIcon: '🛡️', titleColor: 'text-blue-800', perk: 'Moderação comunitária em reportes falsos' },
	{ level: 15, title: 'Guardião da Rodoviária', minXp: 9200, maxXp: 11000, badgeIcon: '🏰', titleColor: 'text-amber-800', perk: 'Pin de emergência com destaque no mural' },
	{ level: 16, title: 'Monitor Lendário', minXp: 11000, maxXp: 13000, badgeIcon: '🎓', titleColor: 'text-emerald-800', perk: 'Avisos fixados no topo por 24h' },
	{ level: 17, title: 'Mestre da Engenharia', minXp: 13000, maxXp: 15500, badgeIcon: '⚙️', titleColor: 'text-stone-800', perk: 'Post-it customizado estilo Kraft Nobre' },
	{ level: 18, title: 'Veterano de TCC', minXp: 15500, maxXp: 18500, badgeIcon: '📜', titleColor: 'text-orange-800', perk: 'Pin Dourado Tridimensional exclusivo' },
	{ level: 19, title: 'Comandante da FGA', minXp: 18500, maxXp: 22000, badgeIcon: '👑', titleColor: 'text-red-700', perk: 'Emblema de Honra nos comentários' },
	{ level: 20, title: 'Lenda Imortal da FGA', minXp: 22000, maxXp: 99999, badgeIcon: '✨', titleColor: 'text-amber-600', perk: 'Pin Diamante Mítico e aura cintilante nos posts' }
];

export function getLevelInfo(xp: number): LevelInfo {
	for (let i = LEVEL_DATA.length - 1; i >= 0; i--) {
		if (xp >= LEVEL_DATA[i].minXp) {
			return LEVEL_DATA[i];
		}
	}
	return LEVEL_DATA[0];
}

const INITIAL_PROFILE: UserProfile = {
	id: 'user-calouro-fga',
	name: 'Alexandre FGA',
	matricula: '22/1004802',
	course: 'Engenharia de Software',
	semester: 4,
	xp: 480,
	karma: 35,
	level: 4,
	title: 'Sobrevivente de Cálculo 1',
	avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
	badges: [
		{ id: 'b1', name: 'Primeira Carona', description: 'Confirmou presença em uma caravana da 480', icon: '🚙', unlockedAt: '2026-09-10', rarity: 'comum' },
		{ id: 'b2', name: 'Olho Vivo no BRT', description: 'Votou no status das linhas 3 vezes', icon: '👁️', unlockedAt: '2026-09-15', rarity: 'raro' },
		{ id: 'b3', name: 'Membro de Squad', description: 'Ingressou em um esquadrão multidisciplinar de PI', icon: '🚀', unlockedAt: '2026-09-20', rarity: 'epico' }
	],
	completedQuestIds: [],
	soundEnabled: true
};

const INITIAL_QUESTS: Quest[] = [
	{
		id: 'q1',
		title: 'Oráculo do BRT',
		description: 'Vote no status de 2 linhas de ônibus hoje',
		xpReward: 35,
		karmaReward: 5,
		progress: 1,
		maxProgress: 2,
		isCompleted: false,
		icon: '🚌',
		category: 'bus'
	},
	{
		id: 'q2',
		title: 'Ninguém Fica pra Trás',
		description: 'Entre ou crie uma caravana noturna da 480',
		xpReward: 45,
		karmaReward: 8,
		progress: 0,
		maxProgress: 1,
		isCompleted: false,
		icon: '🛡️',
		category: 'caravana'
	},
	{
		id: 'q3',
		title: 'Caçador de Oportunidades',
		description: 'Marque 1 aviso acadêmico ou edital como lido',
		xpReward: 25,
		karmaReward: 3,
		progress: 0,
		maxProgress: 1,
		isCompleted: false,
		icon: '📌',
		category: 'notice'
	}
];

export const INITIAL_CARAVANAS: CaravanaPost[] = [
	{
		id: 'c1',
		type: 'caravana',
		title: 'Caravana Noturna: Saída UAC ➔ Metrô Taguatinga Sul',
		description: 'Saindo pontualmente às 21h55 do estacionamento do UAC. Vamos em grupo pela DF-480 com 2 carros e a pé até a parada iluminada.',
		author: {
			name: 'Mariana Souza',
			course: 'Engenharia Aeroespacial',
			karma: 74,
			level: 7,
			avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'
		},
		departureTime: '21:55',
		origin: 'Estacionamento UAC (em frente aos bancos)',
		destination: 'Metrô Taguatinga Sul / Samambaia',
		attendees: [
			{ id: 'u1', name: 'Mariana', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', course: 'Aero' },
			{ id: 'u2', name: 'Lucas P.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', course: 'Software' },
			{ id: 'u3', name: 'Beatriz L.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', course: 'Energia' }
		],
		maxCapacity: 6,
		urgency: 'alta',
		paperColor: 'yellow',
		pinColor: 'red',
		rotation: 'rot-n-1',
		createdAt: 'Há 18 min',
		commentsCount: 4,
		userJoined: false
	},
	{
		id: 'c2',
		type: 'squad',
		title: 'Squad PI-2: Projeto Dispositivo IoT de Telemetria Automotiva',
		description: 'Tema aprovado com prof. do galpão! Já temos 2 de Eletrônica e 1 de Software. Procuramos mais 1 Software (firmware/web) e 1 de Automotiva!',
		author: {
			name: 'Felipe Rocha',
			course: 'Engenharia Eletrônica',
			karma: 92,
			level: 10,
			avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
		},
		origin: 'LabMaker / Galpão',
		destination: 'Apresentação Final PI-2',
		requiredRoles: [
			{ role: 'Backend/Firmware C++', course: 'Software', filled: false },
			{ role: 'Dinâmica Veicular', course: 'Automotiva', filled: false },
			{ role: 'Hardware PCB & Sensores', course: 'Eletrônica', filled: true, assignedTo: 'Felipe R.' },
			{ role: 'Gestão & Documentação', course: 'Eletrônica', filled: true, assignedTo: 'Camila T.' }
		],
		attendees: [
			{ id: 'f1', name: 'Felipe', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', course: 'Eletrônica' },
			{ id: 'f2', name: 'Camila', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100', course: 'Eletrônica' }
		],
		urgency: 'normal',
		paperColor: 'white',
		pinColor: 'gold',
		rotation: 'rot-p-1',
		createdAt: 'Há 45 min',
		commentsCount: 7,
		userJoined: false
	},
	{
		id: 'c3',
		type: 'reporte',
		title: '⚠️ Alerta: Poste apagado na rotatória de acesso à 480',
		description: 'Atenção quem for pegar ônibus na parada externa: trecho da calçada antes da passarela está em escuridão total. Prefiram ir sempre em caravana com o grupo!',
		author: {
			name: 'Gabriel Martins',
			course: 'Engenharia de Energia',
			karma: 110,
			level: 11,
			avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'
		},
		urgency: 'emergencia',
		attendees: [],
		paperColor: 'pink',
		pinColor: 'red',
		rotation: 'rot-n-2',
		createdAt: 'Há 12 min',
		commentsCount: 9,
		userJoined: false
	},
	{
		id: 'c4',
		type: 'caravana',
		title: 'Caravana BRT Gama Expresso - Saída às 18h20',
		description: 'Indo pro Terminal do BRT Gama no horário de pico. Saída da cantina do UAC. Quem anima rachar Uber ou ir junto no 2201?',
		author: {
			name: 'Thaís Oliveira',
			course: 'Engenharia de Software',
			karma: 45,
			level: 5,
			avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80'
		},
		departureTime: '18:20',
		origin: 'Cantina do UAC',
		destination: 'Terminal BRT Gama',
		attendees: [
			{ id: 't1', name: 'Thaís', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100', course: 'Software' },
			{ id: 't2', name: 'Rodrigo', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100', course: 'Software' }
		],
		maxCapacity: 5,
		urgency: 'normal',
		paperColor: 'kraft',
		pinColor: 'blue',
		rotation: 'rot-p-2',
		createdAt: 'Há 1h',
		commentsCount: 3,
		userJoined: false
	}
];

export const INITIAL_BUS_LINES: BusReport[] = [
	{
		id: 'bus-0234',
		lineNumber: '0.234',
		lineName: 'Gama Oeste-Leste ⇄ Águas Claras / Taguatinga',
		routeDescription: 'DF-480 (Entrada FGA), Balão do Periquito, Pistão Sul, Areal, Estação Águas Claras Metrô',
		destination: 'Águas Claras / Taguatinga (via Pistão Sul)',
		operator: 'Viação Pioneira',
		via: 'Pistão Sul / DF-480 (Campus FGA) / Areal / Metrô',
		farePrice: 'R$ 5,50 (Passe Livre Estudantil)',
		baseIntervalMinutes: 20,
		scheduledTrips: ['06:20', '06:50', '07:20', '08:00', '11:30', '12:15', '13:00', '16:40', '17:25', '18:10', '19:00', '21:40', '22:25'],
		studentTip: 'Malandragem: se for pro Metrô em Taguatinga, pega na parada em frente ao UAC antes das 17h pra ir sentado.',
		recentReports: [
			{ id: 'r0', type: 'passou', timestamp: 'Há 5 min', studentName: 'Henrique M.' },
			{ id: 'r0b', type: 'lotado', timestamp: 'Há 22 min', studentName: 'Letícia R.' }
		],
		communityScore: { passedVotes: 18, delayedVotes: 4, crowdedVotes: 12 },
		pinColor: 'emerald',
		paperColor: 'white',
		rotation: 'rot-n-1'
	},
	{
		id: 'bus-2201',
		lineNumber: '2201',
		lineName: 'Terminal BRT Gama ⇄ Rodoviária do Plano Piloto',
		routeDescription: 'Corredor Exclusivo BRT Sul, DF-480, Eixão Sul até a Rodoviária do Plano Piloto',
		destination: 'Rodoviária do Plano (Expresso BRT)',
		operator: 'Viação Pioneira (BRT Sul)',
		via: 'Canaleta Exclusiva BRT / Eixão Direto',
		farePrice: 'R$ 5,50 (Passe Livre Estudantil)',
		baseIntervalMinutes: 12,
		scheduledTrips: ['06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '11:15', '11:45', '12:15', '16:30', '17:00', '17:30', '18:00', '18:30', '21:30', '22:00', '22:30'],
		studentTip: 'Expresso puro. Não para nas estações intermediárias da DF-040. Melhor rota para a Asa Sul/Plano.',
		recentReports: [
			{ id: 'r1', type: 'passou', timestamp: 'Há 4 min', studentName: 'Danilo K.' },
			{ id: 'r2', type: 'lotado', timestamp: 'Há 18 min', studentName: 'Ana C.' }
		],
		communityScore: { passedVotes: 26, delayedVotes: 2, crowdedVotes: 14 },
		pinColor: 'blue',
		paperColor: 'white',
		rotation: 'rot-p-1'
	},
	{
		id: 'bus-2202',
		lineNumber: '2202',
		lineName: 'Terminal BRT Gama ⇄ Rodoviária do Plano Piloto',
		routeDescription: 'BRT Sul, DF-480, Estações Park Way, Floricultura, Catetinho, Eixão',
		destination: 'Rodoviária do Plano (Parador BRT)',
		operator: 'Viação Pioneira (BRT Sul)',
		via: 'Parador em todas as estações do BRT',
		farePrice: 'R$ 5,50 (Passe Livre Estudantil)',
		baseIntervalMinutes: 18,
		scheduledTrips: ['06:10', '06:35', '07:05', '07:40', '11:20', '12:00', '12:40', '16:45', '17:15', '17:50', '18:25', '21:45', '22:20'],
		studentTip: 'Usa quando o 2201 estiver com fila gigante no terminal. Para no Catetinho e Park Way.',
		recentReports: [
			{ id: 'r3', type: 'atrasado', timestamp: 'Há 10 min', studentName: 'Vitor S.' }
		],
		communityScore: { passedVotes: 9, delayedVotes: 11, crowdedVotes: 6 },
		pinColor: 'gold',
		paperColor: 'yellow',
		rotation: 'rot-n-2'
	},
	{
		id: 'bus-2208',
		lineNumber: '2208',
		lineName: 'Terminal BRT Gama ⇄ SIG / Eixo W/L',
		routeDescription: 'BRT Sul, DF-480, Eixão Sul, Setor Hospitalar Sul, SIG e Setor Gráfico',
		destination: 'SIG / Setor de Indústrias Gráficas',
		operator: 'Viação Pioneira',
		via: 'Eixinho W / L2 Sul / SIG',
		farePrice: 'R$ 5,50 (Passe Livre Estudantil)',
		baseIntervalMinutes: 25,
		scheduledTrips: ['06:20', '06:55', '07:30', '11:30', '12:30', '16:50', '17:35', '18:20', '21:50'],
		studentTip: 'Salvação pra quem estagia no SIG ou setores centrais sem precisar fazer baldeação na rodoviária.',
		recentReports: [
			{ id: 'r4', type: 'passou', timestamp: 'Há 12 min', studentName: 'Paula M.' },
			{ id: 'r5', type: 'passou', timestamp: 'Há 35 min', studentName: 'João F.' }
		],
		communityScore: { passedVotes: 14, delayedVotes: 3, crowdedVotes: 5 },
		pinColor: 'silver',
		paperColor: 'kraft',
		rotation: 'rot-p-2'
	},
	{
		id: 'bus-205',
		lineNumber: '205',
		lineName: 'Gama (Setor Sul) ⇄ Rodoviária Plano Piloto',
		routeDescription: 'Gama Sul, DF-480 (passarela externa da FGA), Balão do Periquito, Eixo W',
		destination: 'Rodoviária do Plano Piloto (via Eixo W)',
		operator: 'Viação Pioneira',
		via: 'DF-480 / Eixo Rodoviário W',
		farePrice: 'R$ 5,50 (Passe Livre Estudantil)',
		baseIntervalMinutes: 15,
		scheduledTrips: ['06:15', '06:40', '07:10', '07:45', '11:10', '11:50', '12:35', '16:40', '17:15', '17:55', '18:40', '21:35', '22:15'],
		studentTip: 'Para na passarela da DF-480. Se sair à noite do UAC, atravesse a passarela em caravana!',
		recentReports: [
			{ id: 'r6', type: 'lotado', timestamp: 'Há 6 min', studentName: 'Bruna G.' }
		],
		communityScore: { passedVotes: 24, delayedVotes: 8, crowdedVotes: 21 },
		pinColor: 'red',
		paperColor: 'yellow',
		rotation: 'rot-n-1'
	},
	{
		id: 'bus-205-1',
		lineNumber: '205.1',
		lineName: 'Gama Sul ⇄ Rodoviária do Plano Piloto',
		routeDescription: 'Gama Sul, DF-480, acesso direto EPIA Sul / Eixão sem paradas locais',
		destination: 'Rodoviária do Plano (Semi-Expresso)',
		operator: 'Viação Pioneira',
		via: 'EPIA Sul / Eixão Direto',
		farePrice: 'R$ 5,50 (Passe Livre Estudantil)',
		baseIntervalMinutes: 30,
		scheduledTrips: ['06:25', '07:00', '07:35', '11:40', '12:40', '17:05', '17:50', '18:35', '22:00'],
		studentTip: 'Mais rápido que o 205 convencional porque corta parte das paradas do Eixo.',
		recentReports: [
			{ id: 'r7', type: 'passou', timestamp: 'Há 19 min', studentName: 'Caio T.' }
		],
		communityScore: { passedVotes: 10, delayedVotes: 4, crowdedVotes: 4 },
		pinColor: 'purple',
		paperColor: 'white',
		rotation: 'rot-p-1'
	}
];

export const INITIAL_NOTICES: NoticePost[] = [
	{
		id: 'n1',
		title: 'Processo Seletivo 2026/2 - Orc’sLab Empresa Júnior',
		category: 'Empresas Juniores',
		organizer: 'Orc’sLab Software & Hardware',
		description: 'Venha construir soluções reais de impacto! Vagas para desenvolvedores full-stack, designers de produto e gestão de projetos. Não precisa de experiência prévia!',
		expiresAt: 'Expira em 3 dias',
		linkUrl: 'https://orcslab.fga.unb.br',
		tags: ['Software', 'Inovação', 'Carreira'],
		paperColor: 'yellow',
		pinColor: 'gold',
		rotation: 'rot-p-1',
		isRead: false,
		createdAt: 'Há 2h'
	},
	{
		id: 'n2',
		title: 'Edital de Iniciação Científica (PIBIC/PIBITI) FGA',
		category: 'Edital',
		organizer: 'Diretoria de Pesquisa e Pós-Graduação',
		description: 'Bolsas abertas para projetos nas áreas de Veículos Autônomos, Microeletrônica e Energias Renováveis. CR mínimo 3.0 e plano de trabalho com orientador.',
		expiresAt: 'Expira em 48h',
		linkUrl: 'https://unb.br/editais',
		tags: ['Pesquisa', 'Bolsa', 'PIBIC'],
		paperColor: 'white',
		pinColor: 'red',
		rotation: 'rot-n-2',
		isRead: false,
		createdAt: 'Há 5h'
	},
	{
		id: 'n3',
		title: 'Oficina Prática de Git & GitHub para Calouros',
		category: 'Extensão',
		organizer: 'Coletivo Software Livre FGA',
		description: 'Aprenda versionamento na prática com comandos essenciais, branches e pull requests para não passar sufoco em APC e Orientação a Objetos. No Lab 3 do UAC.',
		expiresAt: 'Expira em 24h',
		linkUrl: 'https://t.me/fga_git',
		tags: ['Workshops', 'Calouros', 'Git'],
		paperColor: 'kraft',
		pinColor: 'blue',
		rotation: 'rot-p-2',
		isRead: false,
		createdAt: 'Há 1 dia'
	},
	{
		id: 'n4',
		title: 'Copa InterEngenharias Gama (CIG 2026)',
		category: 'Eventos',
		organizer: 'Atlética Manada FGA',
		description: 'Inscrições abertas para as modalidades Futsal, Basquete, Vôlei e E-Sports. Vista a camisa do seu curso e venha torcer na quadra poliesportiva!',
		expiresAt: 'Expira em 5 dias',
		tags: ['Esportes', 'Integração', 'Manada'],
		paperColor: 'pink',
		pinColor: 'purple',
		rotation: 'rot-n-1',
		isRead: false,
		createdAt: 'Há 2 dias'
	}
];

function createGameStore() {
	// Carregar do localStorage caso exista no browser
	const storedUser = typeof window !== 'undefined' ? localStorage.getItem('hubfga_user') : null;
	const initialUser: UserProfile = storedUser ? JSON.parse(storedUser) : INITIAL_PROFILE;

	const storedQuests = typeof window !== 'undefined' ? localStorage.getItem('hubfga_quests') : null;
	const initialQuests: Quest[] = storedQuests ? JSON.parse(storedQuests) : INITIAL_QUESTS;

	const storedCaravanas = typeof window !== 'undefined' ? localStorage.getItem('hubfga_caravanas') : null;
	const initialCaravanas: CaravanaPost[] = storedCaravanas ? JSON.parse(storedCaravanas) : INITIAL_CARAVANAS;

	function getInitialBuses(): BusReport[] {
		if (typeof window === 'undefined') return INITIAL_BUS_LINES;
		const stored = localStorage.getItem('hubfga_buses');
		if (!stored) return INITIAL_BUS_LINES;
		try {
			const parsed: BusReport[] = JSON.parse(stored);
			const idMap = new Map(parsed.map((b) => [b.id, b]));
			return INITIAL_BUS_LINES.map((defaultBus) => {
				const existing = idMap.get(defaultBus.id);
				return existing
					? {
							...defaultBus,
							communityScore: existing.communityScore ?? defaultBus.communityScore,
							recentReports: existing.recentReports?.length ? existing.recentReports : defaultBus.recentReports,
							userLastVotedType: existing.userLastVotedType
						}
					: defaultBus;
			});
		} catch {
			return INITIAL_BUS_LINES;
		}
	}

	const initialBuses = getInitialBuses();

	const storedNotices = typeof window !== 'undefined' ? localStorage.getItem('hubfga_notices') : null;
	const initialNotices: NoticePost[] = storedNotices ? JSON.parse(storedNotices) : INITIAL_NOTICES;

	const user = writable<UserProfile>(initialUser);
	const quests = writable<Quest[]>(initialQuests);
	const caravanas = writable<CaravanaPost[]>(initialCaravanas);
	const buses = writable<BusReport[]>(initialBuses);
	const notices = writable<NoticePost[]>(initialNotices);
	const toasts = writable<ToastNotification[]>([]);

	// Sincronização automática para localStorage
	if (typeof window !== 'undefined') {
		user.subscribe((val) => localStorage.setItem('hubfga_user', JSON.stringify(val)));
		quests.subscribe((val) => localStorage.setItem('hubfga_quests', JSON.stringify(val)));
		caravanas.subscribe((val) => localStorage.setItem('hubfga_caravanas', JSON.stringify(val)));
		buses.subscribe((val) => localStorage.setItem('hubfga_buses', JSON.stringify(val)));
		notices.subscribe((val) => localStorage.setItem('hubfga_notices', JSON.stringify(val)));
	}

	function triggerToast(toast: Omit<ToastNotification, 'id'>) {
		const newToast: ToastNotification = {
			...toast,
			id: 'toast-' + Math.random().toString(36).substring(2, 9)
		};
		toasts.update((current) => [...current, newToast]);

		// Auto remove após 4.2 segundos
		setTimeout(() => {
			toasts.update((current) => current.filter((t) => t.id !== newToast.id));
		}, 4200);
	}

	function dismissToast(id: string) {
		toasts.update((current) => current.filter((t) => t.id !== id));
	}

	function addXp(amount: number, karmaBonus: number = 0, reason: string = 'Ação no Mural') {
		user.update((u) => {
			const oldLevel = u.level;
			const newXp = u.xp + amount;
			const newKarma = u.karma + karmaBonus;
			const levelInfo = getLevelInfo(newXp);
			const leveledUp = levelInfo.level > oldLevel;

			if (u.soundEnabled) {
				if (leveledUp) {
					playLevelUpSound();
				} else {
					playXpSound();
				}
			}

			if (leveledUp) {
				triggerToast({
					title: `LEVEL UP! Nível ${levelInfo.level}`,
					xpAmount: amount,
					karmaAmount: karmaBonus,
					type: 'level-up',
					message: `Você agora é "${levelInfo.title}"! ${levelInfo.perk}`
				});
			} else {
				triggerToast({
					title: `+${amount} XP!`,
					xpAmount: amount,
					karmaAmount: karmaBonus,
					type: 'xp',
					message: reason
				});
			}

			return {
				...u,
				xp: newXp,
				karma: newKarma,
				level: levelInfo.level,
				title: levelInfo.title
			};
		});
	}

	function toggleSound() {
		user.update((u) => {
			const updated = !u.soundEnabled;
			if (updated) playPinSound();
			return { ...u, soundEnabled: updated };
		});
	}

	function checkQuestProgress(category: 'caravana' | 'bus' | 'notice') {
		quests.update((qList) => {
			return qList.map((q) => {
				if (q.category === category && !q.isCompleted) {
					const newProg = q.progress + 1;
					if (newProg >= q.maxProgress) {
						// Recompensa da Quest!
						addXp(q.xpReward, q.karmaReward, `Missão Diária Concluída: ${q.title}`);
						triggerToast({
							title: `Missão Concluída: ${q.title}!`,
							xpAmount: q.xpReward,
							karmaAmount: q.karmaReward,
							type: 'quest',
							message: `+${q.xpReward} XP e +${q.karmaReward} Karma recebidos!`
						});
						return { ...q, progress: q.maxProgress, isCompleted: true };
					}
					return { ...q, progress: newProg };
				}
				return q;
			});
		});
	}

	function joinCaravana(postId: string) {
		const currentUser = get(user);
		caravanas.update((list) => {
			return list.map((item) => {
				if (item.id === postId) {
					if (item.userJoined) {
						// Sair
						if (currentUser.soundEnabled) playPinSound();
						return {
							...item,
							userJoined: false,
							attendees: item.attendees.filter((a) => a.id !== currentUser.id)
						};
					} else {
						// Entrar (+30 XP)
						if (currentUser.soundEnabled) playStampSound();
						addXp(30, 2, 'Confirmou presença na caravana!');
						checkQuestProgress('caravana');
						return {
							...item,
							userJoined: true,
							attendees: [
								...item.attendees,
								{
									id: currentUser.id,
									name: currentUser.name.split(' ')[0],
									avatar: currentUser.avatarUrl,
									course: currentUser.course.replace('Engenharia de ', '').replace('Engenharia ', '')
								}
							]
						};
					}
				}
				return item;
			});
		});
	}

	function voteBusLine(lineId: string, voteType: 'passou' | 'atrasado' | 'lotado') {
		const currentUser = get(user);
		if (currentUser.soundEnabled) playStampSound();

		buses.update((list) => {
			return list.map((b) => {
				if (b.id === lineId) {
					const newScores = { ...b.communityScore };
					if (voteType === 'passou') newScores.passedVotes += 1;
					if (voteType === 'atrasado') newScores.delayedVotes += 1;
					if (voteType === 'lotado') newScores.crowdedVotes += 1;

					const newReports = [
						{
							id: 'rep-' + Date.now(),
							type: voteType,
							timestamp: 'Agora mesmo',
							studentName: currentUser.name.split(' ')[0]
						},
						...b.recentReports.slice(0, 3)
					];

					return {
						...b,
						communityScore: newScores,
						recentReports: newReports,
						userLastVotedType: voteType
					};
				}
				return b;
			});
		});

		addXp(15, 1, `Reportou status do ônibus (${voteType})`);
		checkQuestProgress('bus');
	}

	function markNoticeRead(noticeId: string) {
		const currentUser = get(user);
		notices.update((list) => {
			return list.map((n) => {
				if (n.id === noticeId && !n.isRead) {
					if (currentUser.soundEnabled) playStampSound();
					addXp(10, 1, 'Marcou aviso universitário como lido');
					checkQuestProgress('notice');
					return { ...n, isRead: true };
				}
				return n;
			});
		});
	}

	function createPost(newPost: CaravanaPost) {
		const currentUser = get(user);
		if (currentUser.soundEnabled) playPinSound();

		caravanas.update((current) => [newPost, ...current]);

		const xpReward = newPost.type === 'caravana' ? 60 : newPost.type === 'squad' ? 45 : 30;
		const karmaReward = newPost.type === 'caravana' ? 5 : 4;
		addXp(xpReward, karmaReward, `Fixou novo chamado no mural (${newPost.type.toUpperCase()})`);
		checkQuestProgress('caravana');
	}

	function createNotice(newNotice: NoticePost) {
		const currentUser = get(user);
		if (currentUser.soundEnabled) playPinSound();

		notices.update((current) => [newNotice, ...current]);
		addXp(25, 3, 'Fixou novo comunicado no mural');
		checkQuestProgress('notice');
	}

	function resetToDefaults() {
		user.set(INITIAL_PROFILE);
		quests.set(INITIAL_QUESTS);
		caravanas.set(INITIAL_CARAVANAS);
		buses.set(INITIAL_BUS_LINES);
		notices.set(INITIAL_NOTICES);
		if (typeof window !== 'undefined') {
			localStorage.clear();
		}
		triggerToast({
			title: 'Mural Reiniciado',
			xpAmount: 0,
			type: 'xp',
			message: 'Dados e pontuações resetados para os valores padrão da FGA.'
		});
	}

	return {
		user,
		quests,
		caravanas,
		buses,
		notices,
		toasts,
		addXp,
		toggleSound,
		joinCaravana,
		voteBusLine,
		markNoticeRead,
		createPost,
		createNotice,
		dismissToast,
		resetToDefaults
	};
}

export const gameStore = createGameStore();
