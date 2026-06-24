import { useEffect, useRef, useCallback } from 'react';

const ASSETS_PATH = "/sounds/";

export function useGameSounds(soundEnabled: boolean, musicEnabled: boolean) {
    const musicRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!musicRef.current) {
            musicRef.current = new Audio(ASSETS_PATH + "game_music.mp3");
            musicRef.current.loop = true;
        }

        if (musicEnabled) {
            musicRef.current.play().catch(e => console.warn("Audio play blocked", e));
        } else {
            musicRef.current.pause();
        }

        return () => {
            if (musicRef.current) {
                musicRef.current.pause();
            }
        };
    }, [musicEnabled]);

    const playSound = useCallback((src: string) => {
        if (soundEnabled) {
            const audio = new Audio(src);
            audio.play().catch(e => console.warn("Audio play blocked", e));
        }
    }, [soundEnabled]);

    const cellNumFillSound = useCallback(() => playSound(ASSETS_PATH + "cell_num_fill.mp3"), [playSound]);
    const cellNumWrongSound = useCallback(() => playSound(ASSETS_PATH + "cell_num_wrong_fill.mp3"), [playSound]);
    const buttonClick = useCallback(() => playSound(ASSETS_PATH + "button_click.mp3"), [playSound]);
    const gameBonous = useCallback(() => playSound(ASSETS_PATH + "game_bonus.mp3"), [playSound]);
    const gameLoss = useCallback(() => playSound(ASSETS_PATH + "game_loss.mp3"), [playSound]);
    const gameWin = useCallback(() => playSound(ASSETS_PATH + "game_win.mp3"), [playSound]);

    return {
        cellNumFillSound,
        cellNumWrongSound,
        buttonClick,
        gameBonous,
        gameLoss,
        gameWin
    };
}
