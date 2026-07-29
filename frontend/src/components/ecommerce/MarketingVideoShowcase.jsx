import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Shield, Zap, Sparkles, Send, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

/**
 * MarketingVideoShowcase — Premium Video Marketing Showcase & High-Performance Streaming Player
 * Features:
 * - Chunked HTML5 Byte-Range Video Streaming (Accept-Ranges: bytes)
 * - Autoplay on scroll with IntersectionObserver (muted)
 * - Custom Glassmorphic Cinema Controls (Play/Pause, Seek, Mute, Fullscreen)
 * - Dynamic Feature Highlight Badges overlaid at key marketing timestamps
 * - Direct OEM Inquiry CTA overlay
 */
export default function MarketingVideoShowcase({ onInquireClick }) {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [showControls, setShowControls] = useState(true);

  // Video source — Local high-speed CDN stream path
  const videoSource = "/videos/groundera_marketing_hero.mp4";

  // Auto-play when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current) {
            videoRef.current.play().then(() => {
              setIsPlaying(true);
            }).catch(() => {
              // Browser autoplay policy prevented playback
              setIsPlaying(false);
            });
          } else if (!entry.isIntersecting && videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.4 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    if (dur > 0) {
      setProgress((current / dur) * 100);
      setCurrentTime(formatTime(current));
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(formatTime(videoRef.current.duration));
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const seekPosition = (e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = seekPosition;
    setProgress(e.target.value);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  return (
    <section className="py-16 bg-[#050507] text-[#F8FAFC] relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#F27E24]/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F27E24]/10 border border-[#F27E24]/30 text-[#F27E24] text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Industrial Performance in Action</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-heading tracking-tight">
            See GroundEra <span className="gradient-text-orange">Absorb 99.4%</span> Vibration
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-medium">
            Watch our high-density elastomer technology eliminate washer walking, absorb high-frequency spin acoustic noise, and provide 800 LB load support in real-time.
          </p>
        </div>

        {/* Video Player Container */}
        <div
          ref={containerRef}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => isPlaying && setShowControls(false)}
          className="relative aspect-video max-w-5xl mx-auto bg-[#0C0C12] rounded-3xl border border-white/10 overflow-hidden shadow-[0_0_50px_rgba(242,126,36,0.15)] group orange-glow-border"
        >
          {/* HTML5 Video Element with Chunked Streaming Support */}
          <video
            ref={videoRef}
            src={videoSource}
            playsInline
            muted={isMuted}
            loop
            preload="metadata"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onClick={togglePlay}
            className="w-full h-full object-cover cursor-pointer"
          />

          {/* Floating Marketing Feature Badges */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap gap-2 pointer-events-none">
            <span className="px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg">
              <Shield className="w-3.5 h-3.5 text-[#F27E24]" />
              800 LB Load Rating
            </span>
            <span className="px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg">
              <Zap className="w-3.5 h-3.5 text-[#F27E24]" />
              99.4% Dampening
            </span>
          </div>

          {/* Direct CTA Overlay (Top Right) */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
            <Button
              onClick={() => onInquireClick ? onInquireClick() : navigate('/product/66a87f12bc09a123456789ab')}
              className="gradient-btn-orange font-black text-xs h-9 px-4 rounded-xl gap-2 shadow-xl hover:scale-105 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Get Sample Quote</span>
            </Button>
          </div>

          {/* Center Big Play Button (When Paused) */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[#F27E24] text-white flex items-center justify-center shadow-[0_0_40px_rgba(242,126,36,0.8)] hover:scale-110 active:scale-95 transition-all cursor-pointer z-20"
              aria-label="Play Video"
            >
              <Play className="w-8 h-8 fill-white translate-x-0.5" />
            </button>
          )}

          {/* Custom Glassmorphic Controls Bar */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-sm transition-opacity duration-300 space-y-2 ${
              showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Seek Bar */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-300 w-10 text-right">{currentTime}</span>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="flex-1 h-1.5 bg-white/20 hover:bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#F27E24]"
              />
              <span className="text-xs font-mono text-slate-400 w-10">{duration}</span>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-[#F27E24] transition-colors cursor-pointer"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                </button>

                <button
                  onClick={toggleMute}
                  className="text-white hover:text-[#F27E24] transition-colors cursor-pointer"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5" />}
                </button>

                <span className="hidden sm:inline-block text-xs font-semibold text-slate-300 border-l border-white/20 pl-4">
                  GroundEra™ High-Damping Elastomer Demo
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-[#F27E24] transition-colors cursor-pointer"
                  aria-label="Fullscreen"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Key Takeaways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 max-w-5xl mx-auto">
          <div className="p-5 rounded-2xl bg-[#0C0C12] border border-white/10 space-y-2">
            <h4 className="text-white font-bold text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F27E24]" />
              Honeycomb Matrix Traction
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Precision molded anti-slip grooves create vacuum suction on tile, hardwood, and concrete surfaces.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0C0C12] border border-white/10 space-y-2">
            <h4 className="text-white font-bold text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F27E24]" />
              Stackable Leveling Heights
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Adjust height easily with stackable interlocking modules to balance uneven floors without wobbling.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0C0C12] border border-white/10 space-y-2">
            <h4 className="text-white font-bold text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F27E24]" />
              Universal Fit Compatibility
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Designed for standard washing machines, dryers, heavy commercial treadmills, and HVAC compressors.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
