export type PinColor = 'red' | 'gold' | 'blue' | 'emerald' | 'silver' | 'purple';

export type PostPaperColor = 'yellow' | 'white' | 'kraft' | 'blue' | 'pink' | 'green';

export type EngineeringCourse = 
	| 'Engenharia de Software'
	| 'Engenharia Aeroespacial'
	| 'Engenharia Automotiva'
	| 'Engenharia Eletrônica'
	| 'Engenharia de Energia'
	| 'Engenharias - FGA Geral';

export interface LevelInfo {
	level: number;
	title: string;
	minXp: number;
	maxXp: number;
	badgeIcon: string;
	titleColor: string;
	perk: string;
}

export interface Badge {
	id: string;
	name: string;
	description: string;
	icon: string;
	unlockedAt?: string;
	rarity: 'comum' | 'raro' | 'epico' | 'lendario';
}

export interface Quest {
	id: string;
	title: string;
	description: string;
	xpReward: number;
	karmaReward: number;
	progress: number;
	maxProgress: number;
	isCompleted: boolean;
	icon: string;
	category: 'caravana' | 'bus' | 'notice' | 'ru';
}

export interface UserProfile {
	id: string;
	name: string;
	matricula: string;
	course: EngineeringCourse;
	semester: number;
	xp: number;
	karma: number;
	level: number;
	title: string;
	avatarUrl: string;
	badges: Badge[];
	completedQuestIds: string[];
	soundEnabled: boolean;
}

export interface Attendee {
	id: string;
	name: string;
	avatar: string;
	course: string;
}

export interface SquadRole {
	role: string;
	course: string;
	filled: boolean;
	assignedTo?: string;
}

export type ChamadoType = 'caravana' | 'squad' | 'reporte' | 'denuncia';

export interface CaravanaPost {
	id: string;
	type: ChamadoType;
	title: string;
	description: string;
	location?: string;
	author: {
		name: string;
		course: string;
		karma: number;
		level: number;
		avatar: string;
	};
	departureTime?: string;
	origin?: string;
	destination?: string;
	requiredRoles?: SquadRole[];
	attendees: Attendee[];
	maxCapacity?: number;
	urgency?: 'normal' | 'alta' | 'emergencia';
	supportedCount?: number;
	userSupported?: boolean;
	paperColor: PostPaperColor;
	pinColor: PinColor;
	rotation: string;
	createdAt: string;
	commentsCount: number;
	userJoined?: boolean;
}

export interface BusVoteReport {
	id: string;
	type: 'passou' | 'atrasado' | 'lotado';
	timestamp: string;
	studentName: string;
}

export interface BusReport {
	id: string;
	lineNumber: string;
	lineName: string;
	routeDescription: string;
	destination: string;
	operator: string;
	via: string;
	farePrice: string;
	baseIntervalMinutes: number;
	scheduledTrips: string[];
	studentTip: string;
	recentReports: BusVoteReport[];
	communityScore: {
		passedVotes: number;
		delayedVotes: number;
		crowdedVotes: number;
	};
	pinColor: PinColor;
	paperColor: PostPaperColor;
	rotation: string;
	userLastVotedType?: 'passou' | 'atrasado' | 'lotado';
}

export type NoticeCategory = 'Decanatos' | 'Empresas Juniores' | 'Edital' | 'Extensão' | 'Eventos' | 'Estágio';

export interface NoticePost {
	id: string;
	title: string;
	category: NoticeCategory;
	organizer: string;
	description: string;
	expiresAt: string;
	linkUrl?: string;
	instagramHandle?: string;
	instagramUrl?: string;
	likesCount?: number;
	verifiedBadge?: boolean;
	sourceType?: 'instagram' | 'mural' | 'edital';
	paperColor: PostPaperColor;
	pinColor: PinColor;
	rotation: string;
	isRead?: boolean;
	tags: string[];
	createdAt: string;
}

export interface ToastNotification {
	id: string;
	title: string;
	xpAmount: number;
	karmaAmount?: number;
	type: 'xp' | 'level-up' | 'badge' | 'quest';
	message?: string;
}

export type RuQueueStatus = 'vazia' | 'moderada' | 'grande' | 'lotada';

export interface RuQueueVoteReport {
	id: string;
	status: RuQueueStatus;
	timestamp: string;
	studentName: string;
	studentCourse?: string;
	comment?: string;
	likes?: number;
}

export interface RuMealMenu {
	mainDish: string;
	veganOption: string;
	garnish: string;
	sideDishes: string;
	salad: string;
	dessert: string;
	drink: string;
}

export interface RuDailyMenu {
	dateStr: string;
	lunch: RuMealMenu;
	dinner: RuMealMenu;
}

export interface RuWeekdayMenu {
	dayOfWeek: number; // 1 = Seg, 2 = Ter, 3 = Qua, 4 = Qui, 5 = Sex
	dayName: string;
	lunch: RuMealMenu;
	dinner: RuMealMenu;
}

export interface RuReport {
	id: string;
	name: string;
	campus: string;
	priceStudent: string;
	priceVisitor: string;
	lunchHours: string;
	dinnerHours: string;
	currentStatus: RuQueueStatus;
	estimatedWaitMinutes: number;
	lastUpdated: string;
	communityVotes: {
		vazia: number;
		moderada: number;
		grande: number;
		lotada: number;
	};
	recentReports: RuQueueVoteReport[];
	menu: RuDailyMenu;
	weeklySchedule?: RuWeekdayMenu[];
	userLastVotedStatus?: RuQueueStatus;
	rotation: string;
}

