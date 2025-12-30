import { useRef, useState } from 'react';

type FinalPreviewProps = {
  videoPath: string;
  alt?: string;
};

const FinalPreview = ({ videoPath, alt = 'Video preview' }: FinalPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div className="relative group cursor-pointer" onClick={togglePlayPause}>
      <video
        ref={videoRef}
        src={videoPath}
        className="w-full rounded border border-gray-700"
        onEnded={handleVideoEnd}
        aria-label={alt}
      />
      {/* Play/Pause overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-gray-900/80 rounded-full p-4">
          {isPlaying ? (
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export { FinalPreview };
