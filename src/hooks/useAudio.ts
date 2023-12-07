// useAudio.ts
import { useEffect, useRef } from 'react';

interface AudioHook {
    play: () => void;
}

const useAudio = (audioFile: string): AudioHook => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Initialize audio only on the client side
            audioRef.current = new Audio(audioFile);
            audioRef.current.load();
        }

        // Cleanup function
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current.src = '';
            }

            // Additional cleanup if needed
        };
    }, [audioFile]); // Include audioFile as a dependency if it changes

    const play = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

    return { play };
};

export default useAudio;
