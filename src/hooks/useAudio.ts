// useAudio.ts
import { useCallback, useEffect, useRef } from 'react';

interface AudioHook {
    play: () => void;
}

const useAudio = (audioFile: string): AudioHook => {
    const audio = useRef<HTMLAudioElement | undefined>(
        typeof Audio !== "undefined" ? new Audio(audioFile) : undefined
    );

    useEffect(() => {
        audio?.current?.load();
        return () => {
            // Pause and reset audio
            if (audio.current) {
                audio.current.pause();
                audio.current.currentTime = 0;

                // Unload audio
                audio.current.src = '';
            }
        };
    }, []);

    const play = useCallback(() => {
        audio?.current?.play();
    }, [audio]);

    return { play };
};

export default useAudio;
