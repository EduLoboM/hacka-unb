// Web Audio API pure synthesizer - zero external files needed

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
	if (typeof window === 'undefined') return null;
	if (!audioCtx) {
		const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
		if (AudioContextClass) {
			audioCtx = new AudioContextClass();
		}
	}
	if (audioCtx && audioCtx.state === 'suspended') {
		audioCtx.resume().catch(() => {});
	}
	return audioCtx;
}

/** Som de alfinete/tachinha sendo espetada na cortiça */
export function playPinSound() {
	const ctx = getAudioContext();
	if (!ctx) return;

	const now = ctx.currentTime;
	// Noise burst for thud
	const bufferSize = ctx.sampleRate * 0.05;
	const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < bufferSize; i++) {
		data[i] = Math.random() * 2 - 1;
	}

	const noise = ctx.createBufferSource();
	noise.buffer = buffer;

	const filter = ctx.createBiquadFilter();
	filter.type = 'lowpass';
	filter.frequency.setValueAtTime(320, now);
	filter.frequency.exponentialRampToValueAtTime(60, now + 0.05);

	const gain = ctx.createGain();
	gain.gain.setValueAtTime(0.3, now);
	gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

	noise.connect(filter);
	filter.connect(gain);
	gain.connect(ctx.destination);

	noise.start(now);
	noise.stop(now + 0.05);
}

/** Som de carimbo de cera sendo pressionado */
export function playStampSound() {
	const ctx = getAudioContext();
	if (!ctx) return;

	const now = ctx.currentTime;
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();

	osc.type = 'triangle';
	osc.frequency.setValueAtTime(180, now);
	osc.frequency.exponentialRampToValueAtTime(45, now + 0.09);

	gain.gain.setValueAtTime(0.25, now);
	gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

	osc.connect(gain);
	gain.connect(ctx.destination);

	osc.start(now);
	osc.stop(now + 0.09);
}

/** Som de ganho de XP (acorde suave e brilhante) */
export function playXpSound() {
	const ctx = getAudioContext();
	if (!ctx) return;

	const now = ctx.currentTime;
	const frequencies = [587.33, 880]; // D5, A5 (tons quentes)

	frequencies.forEach((freq, idx) => {
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = 'sine';
		osc.frequency.setValueAtTime(freq, now + idx * 0.04);

		gain.gain.setValueAtTime(0.12, now + idx * 0.04);
		gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.22);

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start(now + idx * 0.04);
		osc.stop(now + idx * 0.04 + 0.22);
	});
}

/** Fanfarra de Level Up universitário */
export function playLevelUpSound() {
	const ctx = getAudioContext();
	if (!ctx) return;

	const now = ctx.currentTime;
	// Fanfare C5 -> E5 -> G5 -> C6
	const notes = [523.25, 659.25, 783.99, 1046.5];

	notes.forEach((freq, idx) => {
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = 'triangle';
		osc.frequency.setValueAtTime(freq, now + idx * 0.1);

		const start = now + idx * 0.1;
		const dur = idx === notes.length - 1 ? 0.6 : 0.25;

		gain.gain.setValueAtTime(0.2, start);
		gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start(start);
		osc.stop(start + dur);
	});
}
