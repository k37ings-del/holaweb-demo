import { useEffect, useRef, useState, useCallback } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
}

const YouTubePlayer = ({ videoId, title = "Video" }: YouTubePlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const initPlayer = useCallback(() => {
    if (!containerRef.current || playerRef.current) return;

    const playerDiv = document.createElement("div");
    playerDiv.id = `yt-player-${videoId}`;
    containerRef.current.appendChild(playerDiv);

    playerRef.current = new window.YT.Player(playerDiv.id, {
      videoId,
      playerVars: {
        rel: 0,
        showinfo: 0,
        modestbranding: 1,
        iv_load_policy: 3,
        controls: 1,
        fs: 1,
        playsinline: 1,
      },
      events: {
        onReady: () => setIsReady(true),
        onStateChange: (event: any) => {
          setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
        },
      },
    });
  }, [videoId]);

  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const existingScript = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      );
      if (!existingScript) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        initPlayer();
      };
    }

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [initPlayer]);

  const handleOverlayClick = () => {
    if (!playerRef.current || !isReady) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full [&>div]:w-full [&>div]:h-full [&>iframe]:w-full [&>iframe]:h-full" />
      {/* Overlay hides YouTube suggestions when paused */}
      {!isPlaying && isReady && (
        <div
          onClick={handleOverlayClick}
          className="absolute inset-0 z-10 cursor-pointer bg-transparent"
          aria-label={`Play ${title}`}
        />
      )}
    </div>
  );
};

export default YouTubePlayer;
