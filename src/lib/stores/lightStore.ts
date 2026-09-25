import { writable } from 'svelte/store';

export interface LightState {
	// Posição normalizada da luz (-1 a +1)
	nx: number;
	ny: number;
}

function createLightStore() {
	// Luz padrão suave no canto superior-esquerdo
	const { subscribe, set, update } = writable<LightState>({
		nx: -0.35,
		ny: -0.45
	});

	let isListening = false;
	let lastScrollY = 0;

	function initListener() {
		if (typeof window === 'undefined' || isListening) return;
		isListening = true;

		// 1. Desktop: Rastreamento em tempo real do mouse
		window.addEventListener('pointermove', (e) => {
			const nx = (e.clientX / window.innerWidth) * 2 - 1;
			const ny = (e.clientY / window.innerHeight) * 2 - 1;
			set({ nx, ny });
		}, { passive: true });

		// 2. Mobile / Touch: Rastreamento do toque
		window.addEventListener('touchmove', (e) => {
			if (e.touches.length > 0) {
				const touch = e.touches[0];
				const nx = (touch.clientX / window.innerWidth) * 2 - 1;
				const ny = (touch.clientY / window.innerHeight) * 2 - 1;
				set({ nx, ny });
			}
		}, { passive: true });

		// 3. Mobile Scroll: Reação sutil ao rolar a página
		window.addEventListener('scroll', () => {
			const currentY = window.scrollY;
			const delta = currentY - lastScrollY;
			lastScrollY = currentY;

			// Movimento elástico leve no eixo Y com o scroll
			const scrollInfluence = Math.max(-0.6, Math.min(0.2, -0.45 + (delta * 0.015)));
			update(state => ({
				nx: state.nx * 0.95 - 0.05,
				ny: scrollInfluence
			}));
		}, { passive: true });
	}

	return {
		subscribe,
		initListener
	};
}

export const lightStore = createLightStore();
