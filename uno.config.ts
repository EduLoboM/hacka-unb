import { defineConfig, presetUno, presetIcons } from 'unocss';

export default defineConfig({
	presets: [
		presetUno(),
		presetIcons({
			scale: 1.2,
			warn: true
		})
	],
	theme: {
		colors: {
			cork: {
				light: '#d7ab76',
				base: '#c19a6b',
				dark: '#a47c48',
				deep: '#785328'
			},
			postit: {
				yellow: '#fef08a',
				yellowDark: '#fde047',
				blue: '#bfdbfe',
				blueDark: '#93c5fd',
				kraft: '#fed7aa',
				kraftDark: '#fdba74',
				white: '#f8fafc',
				pink: '#fbcfe8',
				green: '#bbf7d0'
			},
			wood: {
				border: '#5c3a21',
				bevel: '#7c4f2e',
				shadow: '#2a170b'
			}
		},
		fontFamily: {
			hand: ['"Caveat"', '"Kalam"', 'cursive'],
			sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
			mono: ['"JetBrains Mono"', 'monospace']
		},
		boxShadow: {
			pin: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
			'pin-deep': '2px 8px 12px rgba(40, 20, 10, 0.5), 0 1px 2px rgba(0, 0, 0, 0.2)',
			postit: '0 10px 25px -5px rgba(58, 30, 10, 0.25), 0 4px 10px -2px rgba(58, 30, 10, 0.15)',
			'postit-hover': '0 16px 32px -6px rgba(58, 30, 10, 0.32), 0 6px 14px -3px rgba(58, 30, 10, 0.2)',
			washi: '0 1px 3px rgba(0, 0, 0, 0.15)',
			corkwell: 'inset 0 6px 20px rgba(42, 23, 11, 0.7), inset 0 0 40px rgba(25, 12, 5, 0.5)'
		}
	},
	shortcuts: {
		// Skeuomorphic Corkboard Surface com Ruído Fractal Orgânico (sem bolinhas repetitivas)
		'cork-texture': 'cork-bg',
		'wood-border': 'border-12 border-[#5c3a21] rounded-2xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-3px_6px_rgba(0,0,0,0.6),0_12px_36px_rgba(0,0,0,0.5)]',
		
		// Washi Tapes
		'washi-tape': 'h-7 px-4 backdrop-blur-[1px] bg-white/70 shadow-washi border-x-2 border-dashed border-black/10 flex items-center justify-center font-bold text-xs uppercase tracking-wider select-none text-stone-700',
		'washi-tape-amber': 'h-7 px-4 backdrop-blur-[1px] bg-amber-200/80 shadow-washi border-x-2 border-dashed border-amber-500/20 flex items-center justify-center font-bold text-xs uppercase tracking-wider select-none text-amber-900',
		'washi-tape-green': 'h-7 px-4 backdrop-blur-[1px] bg-emerald-200/80 shadow-washi border-x-2 border-dashed border-emerald-500/20 flex items-center justify-center font-bold text-xs uppercase tracking-wider select-none text-emerald-900',
		'washi-tape-blue': 'h-7 px-4 backdrop-blur-[1px] bg-sky-200/80 shadow-washi border-x-2 border-dashed border-sky-500/20 flex items-center justify-center font-bold text-xs uppercase tracking-wider select-none text-sky-900',
		'washi-tape-red': 'h-7 px-4 backdrop-blur-[1px] bg-rose-200/85 shadow-washi border-x-2 border-dashed border-rose-500/20 flex items-center justify-center font-bold text-xs uppercase tracking-wider select-none text-rose-900',

		// Post-it Papers
		'post-it-base': 'relative p-5 transition-transform duration-200 ease-out shadow-postit hover:shadow-postit-hover rounded-xs',
		'post-it-yellow': 'post-it-base bg-[#fef9c3] text-stone-800 border-t border-l border-white/60 border-b-2 border-r-2 border-amber-300/40',
		'post-it-white': 'post-it-base bg-[#f8fafc] text-stone-800 border-t border-l border-white/80 border-b-2 border-r-2 border-stone-300/60',
		'post-it-kraft': 'post-it-base bg-[#fed7aa] text-stone-900 border-t border-l border-amber-100/60 border-b-2 border-r-2 border-amber-400/50',
		'post-it-blue': 'post-it-base bg-[#dbeafe] text-stone-900 border-t border-l border-blue-100/60 border-b-2 border-r-2 border-blue-300/50',
		'post-it-pink': 'post-it-base bg-[#fce7f3] text-stone-900 border-t border-l border-pink-100/60 border-b-2 border-r-2 border-pink-300/50',
		'post-it-green': 'post-it-base bg-[#dcfce7] text-stone-900 border-t border-l border-emerald-100/60 border-b-2 border-r-2 border-emerald-300/50',

		// University Rubber Stamps
		'stamp-verified': 'border-2 border-emerald-700/80 text-emerald-800 font-mono text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-sm -rotate-3 select-none inline-block shadow-sm',
		'stamp-alert': 'border-2 border-rose-700/80 text-rose-800 font-mono text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-sm rotate-2 select-none inline-block shadow-sm',
		'stamp-urgent': 'border-2 border-amber-700/80 text-amber-800 font-mono text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-sm -rotate-6 select-none inline-block shadow-sm',
		
		// Wax Seal Badge
		'wax-seal': 'w-10 h-10 rounded-full bg-gradient-to-br from-red-600 via-rose-700 to-amber-900 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_4px_8px_rgba(80,0,0,0.5)] flex items-center justify-center text-amber-200 border-2 border-red-800/60'
	},
	rules: [
		// Dynamic random organic rotations
		['rot-n-2', { transform: 'rotate(-2deg)' }],
		['rot-n-1', { transform: 'rotate(-1deg)' }],
		['rot-p-1', { transform: 'rotate(1deg)' }],
		['rot-p-2', { transform: 'rotate(2deg)' }],
		['rot-n-1-5', { transform: 'rotate(-1.5deg)' }],
		['rot-p-1-5', { transform: 'rotate(1.5deg)' }],
		// Superfície de Cortiça Orgânica e Porosa com Ruído Fractal
		[
			'cork-bg',
			{
				'background-color': '#be8e58',
				'background-image': `radial-gradient(ellipse at 50% 50%, rgba(224, 182, 131, 0.4) 0%, rgba(168, 126, 75, 0.6) 65%, rgba(98, 64, 30, 0.85) 100%), url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='corkNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0.42 0 0 0 0.58  0 0.28 0 0 0.40  0 0 0.14 0 0.22  0 0 0 0.68 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23corkNoise)' opacity='0.85'/%3E%3C/svg%3E")`,
				'background-repeat': 'repeat',
				'background-size': 'auto, 240px 240px'
			}
		],
		// Paper curl pseudo-effect
		['paper-curl', {
			'box-shadow': '0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset'
		}]
	]
});
