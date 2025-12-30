import { useState } from 'react';
import { Scene } from '../../../shared/types';

type FinalPreviewProps = {
  scenes: Scene[];
};

const FinalPreview = ({ scenes }: FinalPreviewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  // Get latest completed video from each scene
  const videos = scenes
    .map((scene) => {
      const completedRenders = scene.renders.filter(
        (r) => r.status === 'completed' && r.videoPath
      );
      const latest = completedRenders[completedRenders.length - 1];
      return latest?.videoPath ?? null;
    })
    .filter(Boolean) as string[];

  if (videos.length === 0) return null;

  const handleVideoEnd = () => {
    // Loop back to start after last video
    setCurrentIndex((i) => (i + 1) % videos.length);
  };

  const toggleMute = () => {
    setIsMuted((muted) => !muted);
  };

  return (
    <div className="mt-8 bg-gray-800 rounded-lg overflow-hidden">
      <video
        key={currentIndex}
        src={`file://${videos[currentIndex]}`}
        autoPlay
        muted={isMuted}
        onEnded={handleVideoEnd}
        onClick={toggleMute}
        className="w-full cursor-pointer"
      />
    </div>
  );
};

export { FinalPreview };

