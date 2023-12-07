// useAudio.ts
import { useCallback, useEffect } from 'react';

interface AudioHook {
    play: () => void;
}

const useAudio = (audioFile: string): AudioHook => {
    const audio = new Audio(audioFile);

    useEffect(() => {
        audio.load();
        return () => {
            // Pause and reset audio
            audio.pause();
            audio.currentTime = 0;

            // Unload audio
            audio.src = '';
        };
    }, []);

    const play = useCallback(() => {
        audio.play();
    }, []);

    return { play };
};

export default useAudio;
