const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const masterGain = audioCtx.createGain();
masterGain.gain.value = 0; // Start muted to kill the pop
masterGain.connect(audioCtx.destination);

const createOscillator = (type, freq, duration, vol = 0.1) => {
    // Graceful wake-up is managed by init() now
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(masterGain); // Connect to master

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
};

let isUnlocked = false;

export const SoundEngine = {
    init: () => {
        if (isUnlocked) return;

        if (audioCtx.state === 'suspended') {
            audioCtx.resume().then(() => {
                // Only unmute AFTER the resume promise resolves
                // Wait another 50ms just to be paranoid about transients
                setTimeout(() => {
                    masterGain.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.1);
                    isUnlocked = true;
                }, 50);
            });
        } else {
            masterGain.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.1);
            isUnlocked = true;
        }
    },

    playKeystroke: () => {
        // User typing: Light, crisp mechanical switch
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(2000 + Math.random() * 500, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    },

    playEmanation: () => {
        // Oracle Emanation: Soft, melodic data stream (Harmonic Sine Waves)
        const notes = [523.25, 587.33, 659.25, 783.99, 880.00];
        const freq = notes[Math.floor(Math.random() * notes.length)];

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        // Soft Envelope
        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 0.02); // Soft Attack
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1); // Long Release

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
    },

    playEnter: () => {
        createOscillator('square', 600, 0.1, 0.05);
        setTimeout(() => createOscillator('sine', 1200, 0.2, 0.05), 50);
    },

    playDataStream: () => {
        // Bursts of data noise
        let count = 0;
        const interval = setInterval(() => {
            const freq = 2000 + Math.random() * 1000;
            createOscillator('sawtooth', freq, 0.03, 0.01);
            count++;
            if (count > 8) clearInterval(interval);
        }, 40);
    },

    playArtifactSlide: () => {
        // Low frequency hum
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(100, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 1);

        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start();
        osc.stop(audioCtx.currentTime + 1);

        // Accompanied by a high-tech chirp
        setTimeout(() => createOscillator('sine', 1500, 0.1, 0.03), 200);
    }
};
