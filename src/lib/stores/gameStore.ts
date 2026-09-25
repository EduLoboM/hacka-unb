import { writable, derived, get } from 'svelte/store';
import type { 
	UserProfile, 
	Quest, 
	Badge, 
	LevelInfo, 
	ToastNotification, 
	CaravanaPost, 
	BusReport, 
	NoticePost,
	RuReport,
	RuQueueStatus,
	RuQueueVoteReport,
	RuWeekdayMenu
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
	},
	{
		id: 'q4',
		title: 'Fiscal do Bandejão',
		description: 'Colabore reportando como está a fila do RU hoje',
		xpReward: 35,
		karmaReward: 4,
		progress: 0,
		maxProgress: 1,
		isCompleted: false,
		icon: '🍽️',
		category: 'ru'
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
	},
	{
		id: 'c5',
		type: 'denuncia',
		title: '🪳 Barata no balcão de distribuição de bandejas do RU',
		description: 'Atenção comunidade FGA: avistada barata grande na calha lateral onde os alunos pegam as bandejas de inox. A fiscalização sanitária da UnB precisa agir urgente!',
		location: 'Restaurante Universitário • RU FGA',
		author: {
			name: 'Lucas Pinheiro',
			course: 'Engenharia de Software',
			karma: 85,
			level: 8,
			avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
		},
		urgency: 'emergencia',
		supportedCount: 54,
		commentsCount: 19,
		attendees: [],
		paperColor: 'yellow',
		pinColor: 'red',
		rotation: 'rot-n-1',
		createdAt: 'Há 25 min'
	},
	{
		id: 'c6',
		type: 'denuncia',
		title: '🪳 Insetos e baratas no bebedouro central do UAC',
		description: 'Não bebam água no bebedouro em frente ao auditório do térreo! Tem baratas saindo da grade do compressor de refrigeração. Já protocolamos reclamação na ouvidoria da UnB.',
		location: 'UAC • Térreo próximo ao Auditório',
		author: {
			name: 'Beatriz Lima',
			course: 'Engenharia de Energia',
			karma: 95,
			level: 9,
			avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
		},
		urgency: 'alta',
		supportedCount: 78,
		commentsCount: 31,
		attendees: [],
		paperColor: 'kraft',
		pinColor: 'red',
		rotation: 'rot-p-1',
		createdAt: 'Há 50 min'
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
		studentTip: 'Se for pro Metrô em Taguatinga, pega na parada em frente ao UAC antes das 17h pra ir sentado.',
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

export const WEEKLY_RU_MENU: RuWeekdayMenu[] = [
	{
		dayOfWeek: 1,
		dayName: 'Segunda-feira',
		lunch: {
			mainDish: 'Feijoada Completa Tradicional',
			veganOption: 'Feijoada Vegana com Tofu Defumado & Cogumelos',
			garnish: 'Couve Manteiga Refogada no Alho & Farofa Crocante',
			sideDishes: 'Arroz Branco, Arroz Integral, Laranja Fatiada',
			salad: 'Vinagrete Especial e Mix de Folhas Verdes',
			dessert: 'Laranja Higienizada ou Doce de Abóbora Caseiro',
			drink: 'Suco Natural de Laranja'
		},
		dinner: {
			mainDish: 'Iscas de Frango Grelhado com Ervas Finas',
			veganOption: 'Quibe Assado de Berinjela com Nozes',
			garnish: 'Mandioca Cozida na Manteiga de Garrafa',
			sideDishes: 'Arroz Branco, Integral e Feijão Preto',
			salad: 'Acelga Crocante, Cenoura e Tomate',
			dessert: 'Banana Prata ou Gelatina',
			drink: 'Suco Natural de Uva'
		}
	},
	{
		dayOfWeek: 2,
		dayName: 'Terça-feira',
		lunch: {
			mainDish: 'Filé de Frango à Parmegiana Gratinado',
			veganOption: 'Berinjela à Parmegiana com Queijo Vegano',
			garnish: 'Espaguete ao Alho e Óleo com Ervas',
			sideDishes: 'Arroz Branco, Integral e Feijão Carioca',
			salad: 'Alface Americana, Tomate e Rúcula',
			dessert: 'Maçã Nacional ou Mousse de Limão',
			drink: 'Suco Natural de Maracujá'
		},
		dinner: {
			mainDish: 'Carne Moída Refogada com Batatas e Cenoura',
			veganOption: 'Chili Vegano de Feijão Vermelho com Milho',
			garnish: 'Purê de Batata Cremoso',
			sideDishes: 'Arroz Branco, Integral e Feijão Carioca',
			salad: 'Repolho Roxo, Abacaxi e Cenoura Ralada',
			dessert: 'Melão Fatiado ou Pudim',
			drink: 'Suco Natural de Goiaba'
		}
	},
	{
		dayOfWeek: 3,
		dayName: 'Quarta-feira',
		lunch: {
			mainDish: 'Lasanha Tradicional à Bolonhesa',
			veganOption: 'Lasanha Vegana de Berinjela, Abobrinha e Castanhas',
			garnish: 'Batata Souté com Salsinha Fresca',
			sideDishes: 'Arroz Branco, Arroz Integral e Feijão Preto',
			salad: 'Salada Caprese com Manjericão e Tomate',
			dessert: 'Melancia Fatiada ou Doce de Leite',
			drink: 'Suco Natural de Abacaxi com Hortelã'
		},
		dinner: {
			mainDish: 'Cubos de Alcatra ao Molho Madeira',
			veganOption: 'Moqueca de Palmito e Banana-da-Terra',
			garnish: 'Polenta Cremosa de Milho',
			sideDishes: 'Arroz Branco, Integral e Feijão Preto',
			salad: 'Beterraba Cozida, Pepino e Alface',
			dessert: 'Laranja ou Gelatina',
			drink: 'Suco Natural de Manga'
		}
	},
	{
		dayOfWeek: 4,
		dayName: 'Quinta-feira',
		lunch: {
			mainDish: 'Churrasco Misto na Chapa (Carne Bovina & Linguiça)',
			veganOption: 'Espeto Vegano de Cogumelos, Pimentões e Tofu',
			garnish: 'Mandioca Frita Crocante & Farofa de Ovos',
			sideDishes: 'Arroz Branco, Integral e Feijão Carioca',
			salad: 'Vinagrete Tradicional, Alface e Tomate',
			dessert: 'Abacaxi Fatiado com Canela',
			drink: 'Suco Natural de Caju'
		},
		dinner: {
			mainDish: 'Sobrecoxa de Frango Assada Dourada',
			veganOption: 'Fricassê de Grão-de-Bico com Creme de Castanhas',
			garnish: 'Legumes Salteados no Azeite',
			sideDishes: 'Arroz Branco, Integral e Feijão Carioca',
			salad: 'Mix de Folhas Verdes e Rabanete',
			dessert: 'Banana ou Doce de Banana',
			drink: 'Suco Natural de Acerola'
		}
	},
	{
		dayOfWeek: 5,
		dayName: 'Sexta-feira',
		lunch: {
			mainDish: 'Strogonoff de Frango Especial com Batata Palha',
			veganOption: 'Strogonoff Vegano de Grão-de-Bico e Cogumelos',
			garnish: 'Batata Rústica Assada com Alecrim',
			sideDishes: 'Arroz Branco, Arroz Integral e Feijão Carioca',
			salad: 'Mix de Folhas Verdes, Tomate Cereja e Cenoura Ralada',
			dessert: 'Bombom Especial ou Melancia Fatiada',
			drink: 'Suco Natural de Maracujá'
		},
		dinner: {
			mainDish: 'Iscas de Carne Aceboladas com Pimentões',
			veganOption: 'Hambúrguer Artesanal de Lentilha com Molho Barbecue',
			garnish: 'Purê Cremoso de Mandioquinha',
			sideDishes: 'Arroz Branco, Integral e Feijão Preto',
			salad: 'Acelga Crocante e Milho Verde',
			dessert: 'Laranja Higienizada ou Gelatina',
			drink: 'Suco Natural de Limão'
		}
	}
];

export function isHypedMeal(dishName: string): { isHyped: boolean; badgeText: string; reason: string } {
	const lower = dishName.toLowerCase();
	if (lower.includes('lasanha') || lower.includes('lasha')) {
		return {
			isHyped: true,
			badgeText: '🔥 DIA DE LASANHA • FILA ALTA',
			reason: 'Prato mais concorrido da UnB! Fila costuma dobrar a rampa rapidamente.'
		};
	}
	if (lower.includes('strogonoff') || lower.includes('estrogonofe')) {
		return {
			isHyped: true,
			badgeText: '🔥 DIA DE STROGONOFF • FILA ALTA',
			reason: 'Clássico imbatível do RU! Alta demanda em todos os turnos.'
		};
	}
	if (lower.includes('feijoada')) {
		return {
			isHyped: true,
			badgeText: '🔥 DIA DE FEIJOADA • FILA ALTA',
			reason: 'Almoço muito disputado com tradicional feijoada completa.'
		};
	}
	if (lower.includes('parmegiana')) {
		return {
			isHyped: true,
			badgeText: '⭐ PRATO NOBRE: PARMEGIANA',
			reason: 'Prato especial gratinado, grande atrativo para os estudantes.'
		};
	}
	if (lower.includes('churrasco')) {
		return {
			isHyped: true,
			badgeText: '⭐ PRATO ESPECIAL: CHURRASCO',
			reason: 'Grande movimentação e demanda no refeitório.'
		};
	}
	return { isHyped: false, badgeText: '', reason: '' };
}

export const INITIAL_RU_DATA: RuReport = {
	id: 'ru-fga-campus',
	name: 'Restaurante Universitário • RU FGA',
	campus: 'Campus UnB Gama (FGA)',
	priceStudent: 'R$ 2,50',
	priceVisitor: 'R$ 14,30',
	lunchHours: '11:15 às 14:00',
	dinnerHours: '17:30 às 20:00',
	currentStatus: 'grande',
	estimatedWaitMinutes: 28,
	lastUpdated: 'Há 3 min',
	communityVotes: {
		vazia: 5,
		moderada: 14,
		grande: 32,
		lotada: 19
	},
	recentReports: [
		{
			id: 'ru-r1',
			status: 'grande',
			timestamp: 'Há 3 min',
			studentName: 'Danilo K.',
			studentCourse: 'Software',
			comment: 'Dia de strogonoff é assim mesmo, fila já passou da rampa mas tá andando!',
			likes: 14
		},
		{
			id: 'ru-r2',
			status: 'grande',
			timestamp: 'Há 12 min',
			studentName: 'Mariana S.',
			studentCourse: 'Aeroespacial',
			comment: 'Strogonoff com batata palha tá sensacional hoje! Vale a pena esperar.',
			likes: 22
		},
		{
			id: 'ru-r3',
			status: 'moderada',
			timestamp: 'Há 28 min',
			studentName: 'Lucas P.',
			studentCourse: 'Eletrônica',
			comment: 'Cheguei às 11h20 antes do pico e peguei fila de apenas 10 minutos.',
			likes: 9
		},
		{
			id: 'ru-r4',
			status: 'lotada',
			timestamp: 'Há 45 min',
			studentName: 'Letícia R.',
			studentCourse: 'Energia',
			comment: 'Turmas de Cálculo e Física saíram agora, fila foi bater quase no gramado.',
			likes: 12
		}
	],
	menu: {
		dateStr: 'Sexta-feira • Cardápio do Dia',
		lunch: {
			mainDish: 'Strogonoff de Frango Especial com Batata Palha',
			veganOption: 'Strogonoff Vegano de Grão-de-Bico e Cogumelos',
			garnish: 'Batata Rústica Assada com Alecrim',
			sideDishes: 'Arroz Branco, Arroz Integral & Feijão Carioca',
			salad: 'Mix de Folhas Verdes, Tomate Cereja & Cenoura Ralada',
			dessert: 'Bombom Especial ou Melancia Fatiada',
			drink: 'Suco Natural de Maracujá'
		},
		dinner: {
			mainDish: 'Iscas de Carne Aceboladas com Pimentões',
			veganOption: 'Hambúrguer Artesanal de Lentilha com Molho Barbecue',
			garnish: 'Purê Cremoso de Mandioquinha',
			sideDishes: 'Arroz Branco, Arroz Integral & Feijão Preto',
			salad: 'Acelga Crocante e Milho Verde',
			dessert: 'Laranja Higienizada ou Gelatina',
			drink: 'Suco Natural de Limão'
		}
	},
	weeklySchedule: WEEKLY_RU_MENU,
	rotation: 'rot-n-1'
};

export const INITIAL_NOTICES: NoticePost[] = [
	// ==========================================
	// 🚀 EMPRESAS JUNIORES (EJs UNB & FGA)
	// ==========================================
	{
		id: 'ig-orcestragamificacao-ps',
		title: '🚀 Processo Seletivo Orc’estra 2026/2: Software & Gamificação na FGA',
		category: 'Empresas Juniores',
		organizer: 'Orc’estra Gamificação',
		description: 'Construa softwares reais com impacto! Vagas em desenvolvimento Full-Stack (Svelte, React, Node), UI/UX gamificado e gestão ágil de projetos. Não exige experiência prévia: venha aprender fazendo no maior ecossistema de software da FGA! Inscrições na bio.',
		expiresAt: 'Expira em 3 dias',
		linkUrl: 'https://www.instagram.com/orcestragamificacao/',
		instagramHandle: '@orcestragamificacao',
		instagramUrl: 'https://www.instagram.com/orcestragamificacao/',
		likesCount: 432,
		verifiedBadge: true,
		sourceType: 'instagram',
		tags: ['#OrcsTrainee', '#SoftwareFGA', '#Gamificacao', '#ProcessoSeletivo'],
		paperColor: 'yellow',
		pinColor: 'gold',
		rotation: 'rot-p-1',
		isRead: false,
		createdAt: 'Há 2h'
	},
	{
		id: 'ig-eletronjun-pcb',
		title: '⚡ Workshop Hands-on: Projetando sua Primeira PCB no KiCad',
		category: 'Empresas Juniores',
		organizer: 'EletronJun Engenharia',
		description: 'Aprenda do zero como desenhar o esquemático, rotear trilhas e preparar a fabricação física de circuitos impressos com os consultores da EletronJun no LDEL (Laboratório de Desenvolvimento Eletrônico). Vagas limitadas para estudantes da FGA!',
		expiresAt: 'Sábado no LDEL',
		linkUrl: 'https://www.instagram.com/eletronjun/',
		instagramHandle: '@eletronjun',
		instagramUrl: 'https://www.instagram.com/eletronjun/',
		likesCount: 318,
		verifiedBadge: true,
		sourceType: 'instagram',
		tags: ['#EletronJun', '#Hardware', '#PCB', '#EletrônicaFGA'],
		paperColor: 'kraft',
		pinColor: 'blue',
		rotation: 'rot-n-2',
		isRead: false,
		createdAt: 'Há 18h'
	},
	{
		id: 'ig-zenitaerospace-ps',
		title: '🛸 Recrutamento Zenit Aerospace: Satélites CubeSat & Foguetes',
		category: 'Empresas Juniores',
		organizer: 'Zenit Aerospace',
		description: 'Decole sua trajetória na engenharia aeroespacial! Abertas as inscrições para os squads de Aerodinâmica & CFD, Estruturas Compósitas, Propulsão e Telemetria Espacial. Aberto para todos os cursos de Engenharia do Gama.',
		expiresAt: 'Expira em 4 dias',
		linkUrl: 'https://www.instagram.com/zenitaerospace/',
		instagramHandle: '@zenitaerospace',
		instagramUrl: 'https://www.instagram.com/zenitaerospace/',
		likesCount: 384,
		verifiedBadge: true,
		sourceType: 'instagram',
		tags: ['#ZenitAerospace', '#EngAeroespacial', '#CubeSat', '#FGA'],
		paperColor: 'blue',
		pinColor: 'silver',
		rotation: 'rot-p-2',
		isRead: false,
		createdAt: 'Há 1 dia'
	},
	{
		id: 'ig-matrizenergia-curso',
		title: '☀️ Minicurso de Dimensionamento Solar & Mercado Livre de Energia',
		category: 'Empresas Juniores',
		organizer: 'Matriz Engenharia de Energia',
		description: 'Domine como projetar sistemas fotovoltaicos conectados à rede (on-grid), cálculo de pay-back financeiro e as novidades regulatórias da ANEEL. Inscrições com desconto para calouros da UnB no link da bio!',
		expiresAt: 'Expira em 5 dias',
		linkUrl: 'https://www.instagram.com/matrizenergia/',
		instagramHandle: '@matrizenergia',
		instagramUrl: 'https://www.instagram.com/matrizenergia/',
		likesCount: 226,
		verifiedBadge: true,
		sourceType: 'instagram',
		tags: ['#MatrizEnergia', '#EnergiaSolar', '#Eficiencia', '#EnergiaFGA'],
		paperColor: 'green',
		pinColor: 'emerald',
		rotation: 'rot-n-1',
		isRead: false,
		createdAt: 'Há 2 dias'
	},
	{
		id: 'ig-mecajun-cad',
		title: '🏎️ Desafio CAD 3D & Simulação Veicular com SolidWorks',
		category: 'Empresas Juniores',
		organizer: 'Mecajun Mecatrônica & Auto',
		description: 'A Mecajun convida estudantes das engenharias Automotiva e Mecatrônica para a Maratona de Modelagem 3D. Prática intensiva com suspensão, trem de força e simulação estática com bancada de testes.',
		expiresAt: 'Expira em 3 dias',
		linkUrl: 'https://www.instagram.com/mecajun/',
		instagramHandle: '@mecajun',
		instagramUrl: 'https://www.instagram.com/mecajun/',
		likesCount: 352,
		verifiedBadge: true,
		sourceType: 'instagram',
		tags: ['#Mecajun', '#EngAutomotiva', '#SolidWorks', '#Mecatronica'],
		paperColor: 'kraft',
		pinColor: 'red',
		rotation: 'rot-p-1',
		isRead: false,
		createdAt: 'Há 2 dias'
	},
	{
		id: 'ig-cjr-hackathon',
		title: '💻 Hackathon UnB: 48h de Código, Mentoria e R$ 10.000 em Prêmios',
		category: 'Empresas Juniores',
		organizer: 'CJR Empresa Júnior',
		description: 'A maior maratona de desenvolvimento estudantil do DF está de volta! Monte seu squad com alunos da FGA e Darcy Ribeiro para construir soluções digitais de alto impacto. Vagas presenciais no CIC/UnB.',
		expiresAt: 'Expira em 48h',
		linkUrl: 'https://www.instagram.com/cjr.unb/',
		instagramHandle: '@cjr.unb',
		instagramUrl: 'https://www.instagram.com/cjr.unb/',
		likesCount: 541,
		verifiedBadge: true,
		sourceType: 'instagram',
		tags: ['#CJR', '#HackathonUnB', '#DevCommunity', '#Inovacao'],
		paperColor: 'white',
		pinColor: 'blue',
		rotation: 'rot-n-2',
		isRead: false,
		createdAt: 'Há 3 dias'
	},
	{
		id: 'ig-concentrodf-premio',
		title: '🌟 Prêmio Concentro 2026: EJs da UnB FGA Lideram Impacto no DF',
		category: 'Empresas Juniores',
		organizer: 'Concentro DF (Federação)',
		description: 'Parabenizamos as Empresas Juniores da FGA e de toda a UnB pelos projetos de excelência entregues à sociedade brasiliense. Acompanhe a transmissão da cerimônia de premiação ao vivo pelo YouTube da federação!',
		expiresAt: 'Destaque da Semana',
		linkUrl: 'https://www.instagram.com/concentrodf/',
		instagramHandle: '@concentrodf',
		instagramUrl: 'https://www.instagram.com/concentrodf/',
		likesCount: 712,
		verifiedBadge: true,
		sourceType: 'instagram',
		tags: ['#ConcentroDF', '#MEJ', '#OrgulhoDeSerMEJ', '#ImpactoUnB'],
		paperColor: 'yellow',
		pinColor: 'gold',
		rotation: 'rot-p-2',
		isRead: false,
		createdAt: 'Há 4 dias'
	},

	// ==========================================
	// 🏛️ DECANATOS DA UNB (DAC / DEG / DEX / DPI / RU)
	// ==========================================
	{
		id: 'ig-dac-dds-assistencia',
		title: '📢 Edital de Assistência Estudantil 2026/2: Auxílio Alimentação & Moradia',
		category: 'Decanatos',
		organizer: 'DDS / DAC UnB',
		description: 'A Diretoria de Desenvolvimento Social do Decanato de Assuntos Comunitários (DAC) convoca estudantes para inscrição nos programas de Auxílio Socioeconômico, Moradia e Isenção de 100% no Restaurante Universitário. Envio de comprovantes pelo SIGAA.',
		expiresAt: 'Prazo SIGAA: 28/Set',
		linkUrl: 'https://www.instagram.com/dds.dac.unb/',
		instagramHandle: '@dds.dac.unb',
		instagramUrl: 'https://www.instagram.com/dds.dac.unb/',
		likesCount: 895,
		verifiedBadge: true,
		sourceType: 'instagram',
		tags: ['#DACUnB', '#DDS', '#AssistenciaEstudantil', '#AuxilioPermanencia'],
		paperColor: 'white',
		pinColor: 'red',
		rotation: 'rot-n-1',
		isRead: false,
		createdAt: 'Há 4h'
	},
	{
		id: 'ig-dex-semuni',
		title: '🎪 26ª Semana Universitária UnB (SEMUNI): Programação no Campus Gama',
		category: 'Decanatos',
		organizer: 'Decanato de Extensão (DEX)',
		description: 'Mais de 40 oficinas gratuitas, mostras de protótipos de engenharia e debates sobre tecnologia e sociedade acontecendo simultaneamente no UAC e Galpão da FGA. Emissão instantânea de créditos de extensão no SIGAA!',
		expiresAt: 'Até 25/Set',
		linkUrl: 'https://www.instagram.com/extensaounb/',
		instagramHandle: '@extensaounb',
		instagramUrl: 'https://www.instagram.com/extensaounb/',
		likesCount: 1180,
		verifiedBadge: true,
		sourceType: 'instagram',
		tags: ['#DEXUnB', '#Semuni2026', '#ExtensaoUnB', '#CreditosUnB'],
		paperColor: 'yellow',
		pinColor: 'gold',
		rotation: 'rot-p-1',
		isRead: false,
		createdAt: 'Há 6h'
	},
	{
		id: 'ig-dpi-pibic',
		title: '🔬 Chamada Pública de Bolsas PIBIC & PIBITI 2026/2027 (CNPq / FAPDF)',
		category: 'Decanatos',
		organizer: 'Decanato de Pesquisa (DPI)',
		description: 'Submissão de propostas de Iniciação Científica e Tecnológica aberta para docentes e discentes da UnB. Foco prioritário em Mobilidade Inteligente, Energias Renováveis, Microeletrônica e Robótica. Veja o edital no portal do DPI.',
		expiresAt: 'Expira em 4 dias',
		linkUrl: 'https://www.instagram.com/dpi.unb/',
		instagramHandle: '@dpi.unb',
		instagramUrl: 'https://www.instagram.com/dpi.unb/',
		likesCount: 652,
		verifiedBadge: true,
		sourceType: 'instagram',
		tags: ['#DPIUnB', '#PIBIC', '#PIBITI', '#InovacaoUnB'],
		paperColor: 'white',
		pinColor: 'red',
		rotation: 'rot-p-2',
		isRead: false,
		createdAt: 'Há 1 dia'
	},
	{
		id: 'ig-ru-dac-pix',
		title: '🍽️ Comunicado Oficial: Recarga do Cartão via PIX e Horários no RU FGA',
		category: 'Decanatos',
		organizer: 'Diretoria do RU / DAC',
		description: 'Recarregue sua carteirinha do RU via QR Code PIX instantâneo pelo portal do estudante sem pegar fila de guichê! O RU do Campus Gama opera com horário ampliado nos períodos de avaliação (Almoço: 11h15 - 14h00 | Jantar: 17h30 - 20h00).',
		expiresAt: 'Vigência Imediata',
		linkUrl: 'https://www.instagram.com/ru.unb_oficial/',
		instagramHandle: '@ru.unb_oficial',
		instagramUrl: 'https://www.instagram.com/ru.unb_oficial/',
		likesCount: 1260,
		verifiedBadge: true,
		sourceType: 'instagram',
		tags: ['#RUUnB', '#RUFGA', '#CardapioRU', '#PIXnoRU'],
		paperColor: 'yellow',
		pinColor: 'emerald',
		rotation: 'rot-n-2',
		isRead: false,
		createdAt: 'Há 1 dia'
	},
	{
		id: 'ig-deg-unb-calendario',
		title: '🎓 Alerta de Matrícula: Prazo Final para Ajustes e Trancamento no SIGAA',
		category: 'Decanatos',
		organizer: 'DEG / SAA Oficial',
		description: 'O Decanato de Ensino de Graduação (DEG) alerta todos os alunos regulares sobre o encerramento do prazo de solicitação de trancamento de matrícula justificado e ajustes finais de horário. Não perca a data limite.',
		expiresAt: 'Sexta-feira 23h59',
		linkUrl: 'https://www.instagram.com/unb_oficial/',
		instagramHandle: '@unb_oficial',
		instagramUrl: 'https://www.instagram.com/unb_oficial/',
		likesCount: 1590,
		verifiedBadge: true,
		sourceType: 'instagram',
		tags: ['#DEGUnB', '#UnBOficial', '#SIGAA', '#CalendarioAcademico'],
		paperColor: 'white',
		pinColor: 'purple',
		rotation: 'rot-p-1',
		isRead: false,
		createdAt: 'Há 3 dias'
	},
	{
		id: 'ig-dasu-dac-saude',
		title: '🌱 Plantão de Acolhimento Psicológico & Rodas de Escuta da DASU',
		category: 'Decanatos',
		organizer: 'DASU / DAC UnB',
		description: 'A Diretoria de Atenção à Saúde da Comunidade Universitária oferece suporte psicológico individual e rodas de conversa sobre estresse acadêmico. Agendamentos confidenciais abertos via SIGAA para alunos de todos os campi.',
		expiresAt: 'Plantão Semanal',
		linkUrl: 'https://www.instagram.com/dasu_unb/',
		instagramHandle: '@dasu_unb',
		instagramUrl: 'https://www.instagram.com/dasu_unb/',
		likesCount: 483,
		verifiedBadge: true,
		sourceType: 'instagram',
		tags: ['#DASU', '#DAC', '#SaudeMental', '#CuidadoUnB'],
		paperColor: 'pink',
		pinColor: 'purple',
		rotation: 'rot-n-1',
		isRead: false,
		createdAt: 'Há 4 dias'
	},

	// ==========================================
	// 📌 EVENTOS & EXTENSÃO COMUNITÁRIA (MURAL)
	// ==========================================
	{
		id: 'n3-git',
		title: 'Oficina Prática de Git & GitHub para Calouros da Engenharia',
		category: 'Extensão',
		organizer: 'Coletivo Software Livre FGA',
		description: 'Aprenda versionamento na prática com comandos essenciais, branches e pull requests para não passar sufoco em APC e Orientação a Objetos. No Lab 3 do UAC.',
		expiresAt: 'Expira em 24h',
		linkUrl: 'https://t.me/fga_git',
		tags: ['Workshops', 'Calouros', 'Git', 'Software'],
		paperColor: 'kraft',
		pinColor: 'blue',
		rotation: 'rot-p-2',
		isRead: false,
		createdAt: 'Há 1 dia'
	},
	{
		id: 'n4-cig',
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
	},
	{
		id: 'ig-engrena-aerodesign',
		title: '✈️ Processo Seletivo Engrena AeroDesign: Projetando Aeronaves de Competição',
		category: 'Empresas Juniores',
		organizer: 'Engrena AeroDesign FGA',
		description: 'Venha fazer parte da equipe de competição aerodesign da UnB! Vagas abertas nos setores de Aerodinâmica & CFD, Estruturas Compósitas, Cargas & Aeroelasticidade, Estabilidade & Controle e Elétrica/Telemetria. Treinamento prático no Hangar da FGA.',
		expiresAt: 'Inscrições até 30/Set',
		linkUrl: 'https://www.instagram.com/engrena_aerodesign/',
		instagramHandle: '@engrena_aerodesign',
		instagramUrl: 'https://www.instagram.com/engrena_aerodesign/',
		likesCount: 467,
		verifiedBadge: true,
		sourceType: 'instagram',
		tags: ['#EngrenaAeroDesign', '#Aeroespacial', '#SAEBrasil', '#EngenhariaFGA'],
		paperColor: 'white',
		pinColor: 'blue',
		rotation: 'rot-p-1',
		isRead: false,
		createdAt: 'Há 5h'
	},
	{
		id: 'ig-piratas-baja',
		title: '🚜 Recrutamento Piratas do Asfalto Baja SAE: Engenharia Off-Road na FGA',
		category: 'Empresas Juniores',
		organizer: 'Piratas do Asfalto Baja FGA',
		description: 'Quer projetar, soldar, usinar e pilotar um veículo off-road de alta performance na competição nacional? A equipe Baja SAE da FGA abre vagas para Powertrain, Chassi Tubular, Suspensão & Direção e Freios.',
		expiresAt: 'Expira em 5 dias',
		linkUrl: 'https://www.instagram.com/piratasdoasfalto/',
		instagramHandle: '@piratasdoasfalto',
		instagramUrl: 'https://www.instagram.com/piratasdoasfalto/',
		likesCount: 528,
		verifiedBadge: true,
		sourceType: 'instagram',
		tags: ['#BajaSAE', '#AutomotivaFGA', '#PiratasDoAsfalto', '#Mecanica'],
		paperColor: 'kraft',
		pinColor: 'gold',
		rotation: 'rot-n-2',
		isRead: false,
		createdAt: 'Há 7h'
	},
	{
		id: 'ig-matriz-consultoria',
		title: '⚡ Consultoria em Eficiência Energética Industrial: Vagas Trainee Matriz',
		category: 'Empresas Juniores',
		organizer: 'Matriz Engenharia de Energia',
		description: 'Projetos reais de redução de consumo energético, laudos técnicos e energia solar para indústrias e comércios no DF. Capacitação inclusa em normas da ANEEL e medições de campo.',
		expiresAt: 'Expira em 3 dias',
		linkUrl: 'https://www.instagram.com/matriz_fga/',
		instagramHandle: '@matriz_fga',
		instagramUrl: 'https://www.instagram.com/matriz_fga/',
		likesCount: 312,
		verifiedBadge: true,
		sourceType: 'instagram',
		tags: ['#MatrizFGA', '#EnergiaRenovavel', '#Consultoria', '#Sustentabilidade'],
		paperColor: 'green',
		pinColor: 'emerald',
		rotation: 'rot-p-2',
		isRead: false,
		createdAt: 'Há 12h'
	},
	{
		id: 'ig-dpi-startups',
		title: '💡 Edital UnB Inovação & Startups 2026: Aporte Financeiro para Projetos',
		category: 'Decanatos',
		organizer: 'DPI / CDT UnB',
		description: 'Chamada para ideias de base tecnológica nascidas na UnB. Mentorias com aceleradoras, bolsas para pesquisadores discentes e aporte semente de até R$ 20.000 para validação de protótipos de engenharia no campus Gama.',
		expiresAt: 'Inscrições abertas',
		linkUrl: 'https://www.instagram.com/dpi.unb/',
		instagramHandle: '@dpi.unb',
		instagramUrl: 'https://www.instagram.com/dpi.unb/',
		likesCount: 745,
		verifiedBadge: true,
		sourceType: 'instagram',
		tags: ['#DPIUnB', '#CDTUnB', '#Startups', '#Empreendedorismo'],
		paperColor: 'yellow',
		pinColor: 'red',
		rotation: 'rot-n-1',
		isRead: false,
		createdAt: 'Há 14h'
	},
	{
		id: 'ig-deg-monitoria-remunerada',
		title: '📚 Programa de Monitoria Remunerada: Cálculo 1, APC e Física 1 na FGA',
		category: 'Decanatos',
		organizer: 'DEG / Coordenação FGA',
		description: 'Inscrições abertas para monitores remunerados e voluntários do Departamento de Engenharia. Bolsa mensal de R$ 700 + créditos de módulo livre. Inscrição direto pelo portal SIGAA/Ensino/Monitoria.',
		expiresAt: 'Prazo: 02/Out',
		linkUrl: 'https://www.instagram.com/unb_oficial/',
		instagramHandle: '@unb_oficial',
		instagramUrl: 'https://www.instagram.com/unb_oficial/',
		likesCount: 1340,
		verifiedBadge: true,
		sourceType: 'instagram',
		tags: ['#DEGUnB', '#MonitoriaUnB', '#Calculo1', '#BolsaMonitoria'],
		paperColor: 'white',
		pinColor: 'gold',
		rotation: 'rot-p-1',
		isRead: false,
		createdAt: 'Há 1 dia'
	},
	{
		id: 'ig-dpg-posgraduacao',
		title: '🔬 Processo Seletivo Mestrado & Doutorado em Sistemas Mecatrônicos FGA',
		category: 'Decanatos',
		organizer: 'Decanato de Pós-Graduação (DPG)',
		description: 'Linhas de pesquisa em Robótica Móvel, Veículos Autônomos, Bioengenharia e Sistemas de Controle Avançado no campus do Gama. Bolsas CAPES e CNPq disponíveis para dedicação exclusiva.',
		expiresAt: 'Edital no SIGAA',
		linkUrl: 'https://www.instagram.com/unb_oficial/',
		instagramHandle: '@unb_oficial',
		instagramUrl: 'https://www.instagram.com/unb_oficial/',
		likesCount: 420,
		verifiedBadge: true,
		sourceType: 'instagram',
		tags: ['#DPGUnB', '#MestradoFGA', '#Mecatronica', '#PesquisaAvancada'],
		paperColor: 'blue',
		pinColor: 'silver',
		rotation: 'rot-n-2',
		isRead: false,
		createdAt: 'Há 2 dias'
	},
	{
		id: 'ig-bce-treinamento',
		title: '📖 Biblioteca Central: Treinamento em Bases IEEE Xplore & Escrita de TCC',
		category: 'Decanatos',
		organizer: 'BCE / Decanatos UnB',
		description: 'Workshop online gratuito ensinando busca bibliográfica avançada na IEEE Xplore, ScienceDirect, exportação de referências BibTeX para LaTeX e normas da ABNT. Emissão de certificado de 4h.',
		expiresAt: 'Quinta-feira 14h',
		linkUrl: 'https://www.instagram.com/unb_oficial/',
		instagramHandle: '@unb_oficial',
		instagramUrl: 'https://www.instagram.com/unb_oficial/',
		likesCount: 615,
		verifiedBadge: true,
		sourceType: 'instagram',
		tags: ['#BCEUnB', '#IEEEXplore', '#TCC', '#NormalizacaoABNT'],
		paperColor: 'yellow',
		pinColor: 'purple',
		rotation: 'rot-p-2',
		isRead: false,
		createdAt: 'Há 2 dias'
	},
	{
		id: 'ig-fga-espacomaker',
		title: '🛠️ Agendamento de Impressoras 3D & Cortadora a Laser no LabMaker FGA',
		category: 'Extensão',
		organizer: 'Comissão LabMaker FGA',
		description: 'O laboratório de prototipagem rápida abriu agenda para corte a laser em MDF/Acrílico e filamento PLA para projetos de disciplinas (PI1, PI2, TCC) e empresas juniores. Traga seu arquivo .dxf ou .stl!',
		expiresAt: 'Funcionamento: 08h - 18h',
		linkUrl: 'https://www.instagram.com/unb_oficial/',
		instagramHandle: '@unb_oficial',
		instagramUrl: 'https://www.instagram.com/unb_oficial/',
		likesCount: 890,
		verifiedBadge: true,
		sourceType: 'instagram',
		tags: ['#LabMakerFGA', '#Impressao3D', '#Prototipagem', '#MakersUnB'],
		paperColor: 'kraft',
		pinColor: 'blue',
		rotation: 'rot-n-1',
		isRead: false,
		createdAt: 'Há 3 dias'
	},
	{
		id: 'ig-del-dac-esportes',
		title: '🏆 Seletivas Universitárias UnB: Basquete, Handebol e Judô (JUBs 2026)',
		category: 'Decanatos',
		organizer: 'DEL / DAC UnB',
		description: 'A Diretoria de Esporte e Lazer convoca atletas universitários para as seletivas das equipes representativas da UnB nos Jogos Universitários Brasileiros. Treinos no Centro Olímpico da UnB com transporte gratuito saindo da FGA.',
		expiresAt: 'Seletivas neste Sábado',
		linkUrl: 'https://www.instagram.com/dds.dac.unb/',
		instagramHandle: '@dds.dac.unb',
		instagramUrl: 'https://www.instagram.com/dds.dac.unb/',
		likesCount: 512,
		verifiedBadge: true,
		sourceType: 'instagram',
		tags: ['#DELUnB', '#JUBs2026', '#EsporteUniversitario', '#OrgulhoUnB'],
		paperColor: 'pink',
		pinColor: 'emerald',
		rotation: 'rot-p-1',
		isRead: false,
		createdAt: 'Há 3 dias'
	},
	{
		id: 'ig-dacom-fga-integracao',
		title: '👾 Semana de Integração da Engenharia de Software & GameJam FGA',
		category: 'Eventos',
		organizer: 'DACOM FGA',
		description: 'Participe do torneio de programação competitiva e da GameJam anual da FGA no UAC. Palestras com ex-alunos que atuam no Google, Nubank e iFood sobre transição de carreira e estágio tech.',
		expiresAt: 'Próxima Quarta',
		linkUrl: 'https://www.instagram.com/unb_oficial/',
		instagramHandle: '@unb_oficial',
		instagramUrl: 'https://www.instagram.com/unb_oficial/',
		likesCount: 684,
		verifiedBadge: true,
		sourceType: 'instagram',
		tags: ['#DACOM', '#SoftwareFGA', '#GameJam', '#TechUnB'],
		paperColor: 'yellow',
		pinColor: 'purple',
		rotation: 'rot-n-2',
		isRead: false,
		createdAt: 'Há 4 dias'
	}
];

function createGameStore() {
	// Carregar do localStorage caso exista no browser
	const storedUser = typeof window !== 'undefined' ? localStorage.getItem('hubfga_user') : null;
	const initialUser: UserProfile = storedUser ? JSON.parse(storedUser) : INITIAL_PROFILE;

	const storedQuests = typeof window !== 'undefined' ? localStorage.getItem('hubfga_quests') : null;
	const initialQuests: Quest[] = storedQuests ? JSON.parse(storedQuests) : INITIAL_QUESTS;

	function getInitialCaravanas(): CaravanaPost[] {
		if (typeof window === 'undefined') return INITIAL_CARAVANAS;
		const stored = localStorage.getItem('hubfga_caravanas_v2') || localStorage.getItem('hubfga_caravanas');
		if (!stored) return INITIAL_CARAVANAS;
		try {
			const parsed: CaravanaPost[] = JSON.parse(stored);
			const existingMap = new Map(parsed.map((c) => [c.id, c]));
			const merged = INITIAL_CARAVANAS.map((defaultPost) => {
				const existing = existingMap.get(defaultPost.id);
				return existing ? { ...defaultPost, ...existing } : defaultPost;
			});
			const custom = parsed.filter((p) => !INITIAL_CARAVANAS.some((d) => d.id === p.id));
			return [...merged, ...custom];
		} catch {
			return INITIAL_CARAVANAS;
		}
	}

	const initialCaravanas = getInitialCaravanas();

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

	function getInitialRu(): RuReport {
		if (typeof window === 'undefined') return INITIAL_RU_DATA;
		const stored = localStorage.getItem('hubfga_ru');
		if (!stored) return INITIAL_RU_DATA;
		try {
			const parsed: RuReport = JSON.parse(stored);
			return {
				...INITIAL_RU_DATA,
				...parsed,
				communityVotes: parsed.communityVotes ?? INITIAL_RU_DATA.communityVotes,
				recentReports: parsed.recentReports?.length ? parsed.recentReports : INITIAL_RU_DATA.recentReports,
				currentStatus: parsed.currentStatus ?? INITIAL_RU_DATA.currentStatus,
				estimatedWaitMinutes: parsed.estimatedWaitMinutes ?? INITIAL_RU_DATA.estimatedWaitMinutes,
				userLastVotedStatus: parsed.userLastVotedStatus
			};
		} catch {
			return INITIAL_RU_DATA;
		}
	}

	const initialRu = getInitialRu();

	function getInitialNotices(): NoticePost[] {
		if (typeof window === 'undefined') return INITIAL_NOTICES;
		const stored = localStorage.getItem('hubfga_notices_v3') || localStorage.getItem('hubfga_notices_v2') || localStorage.getItem('hubfga_notices');
		if (!stored) return INITIAL_NOTICES;
		try {
			const parsed: NoticePost[] = JSON.parse(stored);
			const existingMap = new Map(parsed.map((n) => [n.id, n]));
			// Garante que todas as postagens oficiais de EJs e Decanatos do INITIAL_NOTICES estejam presentes
			const merged = INITIAL_NOTICES.map((defaultNotice) => {
				const existing = existingMap.get(defaultNotice.id);
				return existing ? { ...defaultNotice, isRead: existing.isRead ?? defaultNotice.isRead } : defaultNotice;
			});
			// Preserva posts adicionais criados pelo usuário
			const customUserPosts = parsed.filter((p) => !INITIAL_NOTICES.some((d) => d.id === p.id));
			return [...merged, ...customUserPosts];
		} catch {
			return INITIAL_NOTICES;
		}
	}

	const initialNotices = getInitialNotices();

	const user = writable<UserProfile>(initialUser);
	const quests = writable<Quest[]>(initialQuests);
	const caravanas = writable<CaravanaPost[]>(initialCaravanas);
	const buses = writable<BusReport[]>(initialBuses);
	const ru = writable<RuReport>(initialRu);
	const notices = writable<NoticePost[]>(initialNotices);
	const toasts = writable<ToastNotification[]>([]);

	// Sincronização automática para localStorage
	if (typeof window !== 'undefined') {
		user.subscribe((val) => localStorage.setItem('hubfga_user', JSON.stringify(val)));
		quests.subscribe((val) => localStorage.setItem('hubfga_quests', JSON.stringify(val)));
		caravanas.subscribe((val) => {
			localStorage.setItem('hubfga_caravanas_v2', JSON.stringify(val));
			localStorage.setItem('hubfga_caravanas', JSON.stringify(val));
		});
		buses.subscribe((val) => localStorage.setItem('hubfga_buses', JSON.stringify(val)));
		ru.subscribe((val) => localStorage.setItem('hubfga_ru', JSON.stringify(val)));
		notices.subscribe((val) => {
			localStorage.setItem('hubfga_notices_v3', JSON.stringify(val));
			localStorage.setItem('hubfga_notices_v2', JSON.stringify(val));
			localStorage.setItem('hubfga_notices', JSON.stringify(val));
		});
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

	function checkQuestProgress(category: 'caravana' | 'bus' | 'notice' | 'ru') {
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

		const xpReward = newPost.type === 'caravana' ? 60 : newPost.type === 'squad' ? 45 : newPost.type === 'denuncia' ? 50 : 30;
		const karmaReward = newPost.type === 'caravana' ? 5 : newPost.type === 'denuncia' ? 5 : 4;
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

	function reportRuQueue(status: RuQueueStatus, comment?: string) {
		const currentUser = get(user);
		if (currentUser.soundEnabled) playStampSound();

		const waitTimes: Record<RuQueueStatus, number> = {
			vazia: 4,
			moderada: 12,
			grande: 25,
			lotada: 42
		};

		const statusLabels: Record<RuQueueStatus, string> = {
			vazia: 'Vazia (<5 min)',
			moderada: 'Moderada (10-15 min)',
			grande: 'Grande (20-30 min)',
			lotada: 'Quilométrica (35+ min)'
		};

		ru.update((current) => {
			const newVotes = { ...current.communityVotes };
			newVotes[status] = (newVotes[status] || 0) + 1;

			const newReport: RuQueueVoteReport = {
				id: 'ru-' + Date.now(),
				status,
				timestamp: 'Agora mesmo',
				studentName: currentUser.name.split(' ')[0],
				studentCourse: currentUser.course.replace('Engenharia de ', '').replace('Engenharia ', ''),
				comment: comment?.trim() || undefined,
				likes: 0
			};

			const newReports = [newReport, ...current.recentReports.slice(0, 9)];

			return {
				...current,
				currentStatus: status,
				estimatedWaitMinutes: waitTimes[status],
				communityVotes: newVotes,
				recentReports: newReports,
				lastUpdated: 'Agora mesmo por ' + currentUser.name.split(' ')[0],
				userLastVotedStatus: status
			};
		});

		const xpReward = comment?.trim() ? 25 : 20;
		const karmaReward = 2;
		addXp(xpReward, karmaReward, `Reportou status da fila do RU: ${statusLabels[status]}`);
		checkQuestProgress('ru');
	}

	function likeRuReport(reportId: string) {
		const currentUser = get(user);
		if (currentUser.soundEnabled) playStampSound();

		ru.update((current) => {
			return {
				...current,
				recentReports: current.recentReports.map((rep) => {
					if (rep.id === reportId) {
						return { ...rep, likes: (rep.likes || 0) + 1 };
					}
					return rep;
				})
			};
		});
	}

	function syncInstagramFeeds() {
		const currentUser = get(user);
		if (currentUser.soundEnabled) {
			playStampSound();
			playXpSound();
		}

		notices.update((current) => {
			const currentMap = new Map(current.map((n) => [n.id, n]));
			const updated = INITIAL_NOTICES.map((n) => {
				const existing = currentMap.get(n.id);
				return existing ? { ...n, isRead: existing.isRead } : n;
			});
			const custom = current.filter((p) => !INITIAL_NOTICES.some((d) => d.id === p.id));
			return [...updated, ...custom];
		});

		addXp(15, 2, 'Sincronizou avisos oficiais dos Instagrams da UnB e EJs');
		triggerToast({
			title: '📸 Murais do Instagram Sincronizados!',
			message: 'Avisos atualizados diretamente das contas @orcestragamificacao, @dds.dac.unb, @extensaounb, @dpi.unb, @eletronjun e mais.',
			xpAmount: 15,
			karmaAmount: 2,
			type: 'xp'
		});
	}

	function resetToDefaults() {
		user.set(INITIAL_PROFILE);
		quests.set(INITIAL_QUESTS);
		caravanas.set(INITIAL_CARAVANAS);
		buses.set(INITIAL_BUS_LINES);
		ru.set(INITIAL_RU_DATA);
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

	function updateProfile(updates: Partial<UserProfile>) {
		user.update((u) => {
			const updated = { ...u, ...updates };
			if (updates.xp !== undefined) {
				const info = getLevelInfo(updates.xp);
				updated.level = info.level;
				updated.title = info.title;
			}
			return updated;
		});
		const currentUser = get(user);
		if (currentUser.soundEnabled) playStampSound();
	}

	function supportDenuncia(postId: string) {
		const currentUser = get(user);
		if (currentUser.soundEnabled) {
			playStampSound();
			playXpSound();
		}

		caravanas.update((posts) =>
			posts.map((p) => {
				if (p.id === postId) {
					const supported = !p.userSupported;
					const count = (p.supportedCount || 0) + (supported ? 1 : -1);
					return {
						...p,
						userSupported: supported,
						supportedCount: Math.max(0, count)
					};
				}
				return p;
			})
		);

		addXp(20, 3, 'Confirmou denúncia comunitária na FGA (+20 XP)');
		triggerToast({
			title: '🪳 Denúncia Apoiada!',
			message: 'Sua confirmação foi somada ao reporte comunitário da FGA.',
			xpAmount: 20,
			karmaAmount: 3,
			type: 'xp'
		});
	}

	return {
		user,
		quests,
		caravanas,
		buses,
		ru,
		notices,
		toasts,
		addXp,
		updateProfile,
		toggleSound,
		joinCaravana,
		voteBusLine,
		reportRuQueue,
		likeRuReport,
		markNoticeRead,
		createPost,
		createNotice,
		supportDenuncia,
		syncInstagramFeeds,
		dismissToast,
		resetToDefaults
	};
}

export const gameStore = createGameStore();
