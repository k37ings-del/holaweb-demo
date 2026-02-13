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
    <div className="relative w-full h-full overflow-hidden">
      <div ref={containerRef} className="w-full h-full [&>div]:w-full [&>div]:h-full [&>iframe]:w-full [&>iframe]:h-full" />
      {/* Overlays hide YouTube suggestion tiles when paused/ended */}
      {!isPlaying && isReady && (
        <>
          {/* Top overlay - covers suggestion tiles that appear on top */}
          <div
            onClick={handleOverlayClick}
            className="absolute top-0 left-0 right-0 h-[60%] z-10 cursor-pointer bg-black/90"
            aria-label={`Play ${title}`}
          />
          {/* Play button in center */}
          <div
            onClick={handleOverlayClick}
            className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg hover:bg-primary transition-colors">
              <svg className="w-7 h-7 text-primary-foreground ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {/* Bottom overlay - covers bottom suggestion area, leaving controls visible */}
          <div
            onClick={handleOverlayClick}
            className="absolute bottom-[48px] left-0 right-0 h-[calc(40%-48px)] z-10 cursor-pointer bg-black/90"
            aria-label={`Resume ${title}`}
          />
        </>
      )}
    </div>
  );
};

export default YouTubePlayer;
