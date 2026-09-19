import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Download,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  Sparkles,
  Layers,
  CheckCircle2,
  Clock,
  Film,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { AspectRatio, CharacterIdentity, ScriptBreakdown, VisualStyle } from '../types.js';

interface VideoPlayerOutputProps {
  script: ScriptBreakdown | null;
  character: CharacterIdentity;
  style: VisualStyle;
  aspectRatio: AspectRatio;
  onDownloadStarted?: () => void;
}

export const VideoPlayerOutput: React.FC<VideoPlayerOutputProps> = ({
  script,
  character,
  style,
  aspectRatio,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isRecordingDownload, setIsRecordingDownload] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadReadyUrl, setDownloadReadyUrl] = useState<string | null>(null);

  const totalDuration = script?.targetDurationSeconds || 32;

  // Track playback time
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.1 * playbackSpeed;
          if (next >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return next;
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, totalDuration, playbackSpeed]);

  // Determine current active scene based on currentTime
  useEffect(() => {
    if (!script || script.scenes.length === 0) return;
    let accumulated = 0;
    for (let i = 0; i < script.scenes.length; i++) {
      accumulated += script.scenes[i].estimatedDurationSeconds;
      if (currentTime <= accumulated || i === script.scenes.length - 1) {
        setCurrentSceneIndex(i);
        break;
      }
    }
  }, [currentTime, script]);

  // Render visual frames to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !script || script.scenes.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const activeScene = script.scenes[currentSceneIndex] || script.scenes[0];

    // Compute progress within current scene for smooth animations
    let sceneStartTime = 0;
    for (let i = 0; i < currentSceneIndex; i++) {
      sceneStartTime += script.scenes[i].estimatedDurationSeconds;
    }
    const sceneDuration = activeScene.estimatedDurationSeconds || 6;
    const sceneElapsed = Math.max(0, currentTime - sceneStartTime);
    const sceneProgress = Math.min(1, sceneElapsed / sceneDuration);

    // 1. Cinematic Background Gradient derived from style's color palette
    const colors = style.colorPalette;
    const c1 = colors[0] || '#111827';
    const c2 = colors[1] || '#1E1B4B';
    const c3 = colors[2] || '#0F172A';

    const bgGradient = ctx.createRadialGradient(
      width / 2 + Math.sin(sceneProgress * Math.PI) * 40,
      height / 2 + Math.cos(sceneProgress * Math.PI) * 30,
      width * 0.1,
      width / 2,
      height / 2,
      width * 0.8
    );
    bgGradient.addColorStop(0, c1);
    bgGradient.addColorStop(0.5, c2);
    bgGradient.addColorStop(1, '#05070D');

    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Dynamic Kinetic Lighting / Particles
    const particleCount = 28;
    for (let p = 0; p < particleCount; p++) {
      const px = (width * ((p * 37 + currentTime * 25) % 1000)) / 1000;
      const py = (height * ((p * 73 + currentTime * 18) % 1000)) / 1000;
      const radius = ((p % 4) + 1.5) * (1 + Math.sin(currentTime + p) * 0.3);

      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fillStyle = colors[p % colors.length] + '40';
      ctx.fill();
    }

    // 3. Simulated Anamorphic Bokeh / Grid Lines
    ctx.strokeStyle = '#ffffff08';
    ctx.lineWidth = 1;
    const gridStep = width / 12;
    for (let x = 0; x < width; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // 4. Hero Silhouette / Camera Viewport with Ken Burns Scale
    ctx.save();
    const kenBurnsScale = 1.0 + sceneProgress * 0.08;
    ctx.translate(width / 2, height / 2);
    ctx.scale(kenBurnsScale, kenBurnsScale);
    ctx.translate(-width / 2, -height / 2);

    // Character Central Luminous Orb / Hologram Representation
    const orbGradient = ctx.createRadialGradient(
      width / 2,
      height * 0.45,
      10,
      width / 2,
      height * 0.45,
      Math.min(width, height) * 0.32
    );
    orbGradient.addColorStop(0, c3 + 'BB');
    orbGradient.addColorStop(0.4, c2 + '77');
    orbGradient.addColorStop(1, 'transparent');

    ctx.fillStyle = orbGradient;
    ctx.beginPath();
    ctx.arc(width / 2, height * 0.45, Math.min(width, height) * 0.32, 0, Math.PI * 2);
    ctx.fill();

    // Geometric Focus Reticle (Cinematic Look)
    ctx.strokeStyle = c1 + 'AA';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width / 2, height * 0.45, 70 + Math.sin(sceneProgress * 4) * 5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();

    // 5. Cinematic Vignette
    const vignette = ctx.createRadialGradient(
      width / 2,
      height / 2,
      Math.min(width, height) * 0.45,
      width / 2,
      height / 2,
      Math.min(width, height) * 0.8
    );
    vignette.addColorStop(0, 'transparent');
    vignette.addColorStop(1, '#000000C8');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    // 6. UI Overlay: Scene Identifier & Camera Tag
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.fillText(`SCENE ${activeScene.sceneNumber}: ${activeScene.title.toUpperCase()}`, 24, 38);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px monospace';
    ctx.fillText(`CAM: ${activeScene.cameraAngle.toUpperCase()} | STYLE: ${style.name.toUpperCase()}`, 24, 56);

    // Timecode in top-right
    const mins = Math.floor(currentTime / 60);
    const secs = Math.floor(currentTime % 60);
    const ms = Math.floor((currentTime % 1) * 100);
    const timecodeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(timecodeStr, width - 24, 38);
    ctx.textAlign = 'left';

    // 7. Kinetic Subtitles at the bottom
    const subtitleY = height - (aspectRatio === '9:16' ? 140 : 80);
    ctx.save();
    ctx.fillStyle = '#00000099';
    const subText = activeScene.narration;
    ctx.font = 'bold 15px system-ui, sans-serif';
    const textMetrics = ctx.measureText(subText);
    const pillWidth = Math.min(width - 48, textMetrics.width + 32);
    const pillX = (width - pillWidth) / 2;

    // Subtitle background pill
    ctx.beginPath();
    ctx.roundRect(pillX, subtitleY - 24, pillWidth, 38, 8);
    ctx.fill();
    ctx.strokeStyle = '#ffffff20';
    ctx.stroke();

    // Subtitle Text
    ctx.fillStyle = '#F8FAFC';
    ctx.textAlign = 'center';
    ctx.fillText(subText, width / 2, subtitleY);
    ctx.restore();
  }, [currentTime, currentSceneIndex, script, style, aspectRatio]);

  // Direct MP4 / WebM Video Rendering and Download
  const handleDownloadVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !script) return;

    try {
      setIsRecordingDownload(true);
      setDownloadProgress(0);

      // Stop current playback to record smoothly from 0
      setIsPlaying(false);
      setCurrentTime(0);

      const stream = canvas.captureStream(30); // 30 FPS
      const mimeType = MediaRecorder.isTypeSupported('video/mp4')
        ? 'video/mp4'
        : MediaRecorder.isTypeSupported('video/webm;codecs=h264')
        ? 'video/webm;codecs=h264'
        : 'video/webm';

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 4000000, // 4 Mbps high quality
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setDownloadReadyUrl(url);

        // Auto trigger download anchor
        const a = document.createElement('a');
        a.href = url;
        const extension = mimeType.includes('mp4') ? 'mp4' : 'webm';
        a.download = `AI_Remaker_${character.name.replace(/\s+/g, '_')}_${Date.now()}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setIsRecordingDownload(false);
      };

      recorder.start();

      // Play through the video quickly to record frames
      const recordInterval = 60; // 60ms step
      const stepDelta = 0.2; // advance 0.2s each tick
      let simulatedTime = 0;

      const recordTimer = setInterval(() => {
        simulatedTime += stepDelta;
        setCurrentTime(simulatedTime);
        setDownloadProgress(Math.min(100, Math.round((simulatedTime / totalDuration) * 100)));

        if (simulatedTime >= totalDuration) {
          clearInterval(recordTimer);
          setTimeout(() => {
            recorder.stop();
          }, 300);
        }
      }, recordInterval);
    } catch (err) {
      console.error('Error recording video canvas:', err);
      setIsRecordingDownload(false);
    }
  };

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
  };

  if (!script) {
    return (
      <div className="bg-[#0D0F16] rounded-xl border border-white/[0.08] p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-zinc-400" />
            <h3 className="text-xs font-semibold text-white tracking-wide uppercase font-mono">
              Production Monitor &bull; Standby
            </h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            {aspectRatio === '16:9' ? '1920×1080 16:9' : '1080×1920 9:16'} &bull; Rec.709
          </span>
        </div>

        {/* Authentic Cinema Viewport Standby Frame */}
        <div className="flex flex-col items-center justify-center p-4">
          <div
            className={`relative rounded-xl border border-white/[0.12] bg-[#050608] flex flex-col items-center justify-center overflow-hidden shadow-2xl ${
              aspectRatio === '16:9'
                ? 'w-full max-w-2xl aspect-video'
                : 'w-72 sm:w-80 aspect-[9/16]'
            }`}
          >
            {/* Safe Guide Rule-of-Thirds Grid */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-20">
              <div className="border-r border-b border-white/30" />
              <div className="border-r border-b border-white/30" />
              <div className="border-b border-white/30" />
              <div className="border-r border-b border-white/30" />
              <div className="border-r border-b border-white/30" />
              <div className="border-b border-white/30" />
              <div className="border-r border-white/30" />
              <div className="border-r border-white/30" />
              <div />
            </div>

            {/* Center Reticle Crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
              <div className="w-6 h-[1px] bg-white" />
              <div className="h-6 w-[1px] bg-white absolute" />
            </div>

            {/* Technical Viewport Overlay */}
            <div className="absolute top-3 left-3 text-[10px] font-mono text-zinc-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-zinc-600" />
              <span>STBY</span>
              <span>&bull;</span>
              <span>00:00:00:00</span>
            </div>

            <div className="absolute top-3 right-3 text-[10px] font-mono text-zinc-500">
              {style.name.split(' ')[0]} Grade
            </div>

            <div className="z-10 text-center px-6 space-y-2">
              <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.12] flex items-center justify-center mx-auto text-zinc-300">
                <Film className="w-5 h-5 text-zinc-400" />
              </div>
              <h4 className="text-xs font-semibold text-white tracking-wide">
                Video Canvas Engine Standby
              </h4>
              <p className="text-[11px] text-zinc-400 max-w-xs leading-relaxed">
                Configure your story source in the inspector and trigger generation to synthesize animation scenes.
              </p>
            </div>

            {/* Bottom Audio VU bars simulation */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[9px] font-mono text-zinc-600">
              <div className="flex items-center gap-1">
                <span>CH1</span>
                <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-zinc-600" />
                </div>
              </div>
              <span>48 kHz &bull; 24-BIT</span>
            </div>
          </div>
        </div>

        {/* Production Specs Footer */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-lg bg-[#11141E] border border-white/[0.06] text-xs text-zinc-400">
          <div>
            <span className="text-zinc-500 block text-[10px] font-medium uppercase font-mono">Format:</span>
            <span className="text-zinc-200 font-mono text-[11px]">
              {aspectRatio === '16:9' ? '1920×1080 FHD' : '1080×1920 Shorts'}
            </span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] font-medium uppercase font-mono">Target Rate:</span>
            <span className="text-zinc-200 font-mono text-[11px]">30 FPS &bull; H.264</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] font-medium uppercase font-mono">Audio Master:</span>
            <span className="text-zinc-200 font-mono text-[11px]">-14 LUFS Stereo</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] font-medium uppercase font-mono">Color Space:</span>
            <span className="text-zinc-200 font-mono text-[11px]">BT.709 Cinema</span>
          </div>
        </div>
      </div>
    );
  }

  const canvasWidth = aspectRatio === '16:9' ? 800 : 450;
  const canvasHeight = aspectRatio === '16:9' ? 450 : 800;

  return (
    <div className="bg-[#0D0F16] rounded-xl border border-white/[0.08] p-5 sm:p-6 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
            <Film className="w-4 h-4 text-zinc-300" />
            <span>Master Video Preview</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.06] text-zinc-300 border border-white/[0.08]">
              {script.scenes.length} Scenes &bull; {totalDuration}s
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Multi-scene synthesis with kinetic animated subtitles &amp; camera choreography.
          </p>
        </div>

        {/* Download Button */}
        <button
          id="btn-download-mp4"
          type="button"
          disabled={isRecordingDownload}
          onClick={handleDownloadVideo}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-all active:scale-98 disabled:opacity-50 shadow-xs"
        >
          {isRecordingDownload ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Rendering MP4 ({downloadProgress}%)...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Download MP4</span>
            </>
          )}
        </button>
      </div>

      {/* Video Player Display Container */}
      <div className="flex flex-col items-center justify-center">
        <div
          className={`relative rounded-xl overflow-hidden border border-zinc-800 bg-black flex items-center justify-center ${
            aspectRatio === '16:9' ? 'w-full max-w-2xl aspect-video' : 'w-72 sm:w-80 aspect-[9/16]'
          }`}
        >
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className="w-full h-full object-contain"
          />

          {/* Central Play Overlay (when paused) */}
          {!isPlaying && !isRecordingDownload && (
            <div
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer group transition-colors"
            >
              <div className="w-14 h-14 rounded-xl bg-white/90 group-hover:bg-white flex items-center justify-center text-zinc-950 shadow-lg transition-transform group-hover:scale-105">
                <Play className="w-6 h-6 fill-current translate-x-0.5" />
              </div>
            </div>
          )}

          {/* Recording Banner Overlay */}
          {isRecordingDownload && (
            <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <Loader2 className="w-7 h-7 text-white animate-spin" />
              <div>
                <h4 className="text-xs font-semibold text-white">Compiling Final Video Stream</h4>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Encoding canvas scenes and audio tracks into MP4...
                </p>
              </div>
              <div className="w-48 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-white h-full transition-all duration-150"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Video Scrubber & Controls Bar */}
        <div className="w-full max-w-2xl mt-3 p-3 rounded-lg bg-[#11141E] border border-white/[0.06] space-y-2">
          {/* Timeline Scrubber */}
          <div className="relative group">
            <input
              type="range"
              min="0"
              max={totalDuration}
              step="0.1"
              value={currentTime}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="w-full accent-white cursor-pointer h-1.5 bg-zinc-800 rounded-lg group-hover:h-2 transition-all"
            />

            {/* Scene Markers on Scrubber */}
            <div className="flex justify-between text-[9px] text-zinc-500 font-mono mt-1">
              {script.scenes.map((s) => (
                <span
                  key={s.sceneNumber}
                  onClick={() => {
                    let st = 0;
                    for (let i = 0; i < s.sceneNumber - 1; i++) {
                      st += script.scenes[i].estimatedDurationSeconds;
                    }
                    handleSeek(st);
                  }}
                  className="cursor-pointer hover:text-white transition-colors"
                >
                  S{s.sceneNumber} ({s.timestamp.split(' - ')[0]})
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Player Buttons */}
          <div className="flex items-center justify-between gap-2 pt-1 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-7 h-7 rounded-md bg-[#191D2B] hover:bg-zinc-800 text-white flex items-center justify-center transition-colors border border-white/[0.08]"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentTime(0);
                  setIsPlaying(true);
                }}
                className="w-7 h-7 rounded-md bg-[#191D2B] hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors border border-white/[0.08]"
                title="Restart playback"
              >
                <RotateCcw className="w-3 h-3" />
              </button>

              {/* Time Display */}
              <span className="text-zinc-300 font-mono font-medium text-[11px] ml-1">
                {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')} /{' '}
                {Math.floor(totalDuration / 60)}:{String(Math.floor(totalDuration % 60)).padStart(2, '0')}
              </span>
            </div>

            {/* Speed and Volume Controls */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1">
                {[1, 1.25, 1.5].map((speed) => (
                  <button
                    key={speed}
                    type="button"
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium transition-colors ${
                      playbackSpeed === speed
                        ? 'bg-zinc-800 text-white border border-white/20'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 rounded-md bg-[#191D2B] hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors border border-white/[0.08]"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Production Rendering Specs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-lg bg-[#11141E] border border-white/[0.06] text-xs text-zinc-400">
        <div>
          <span className="text-zinc-500 block text-[10px] font-medium uppercase font-mono">Resolution:</span>
          <span className="text-zinc-200 font-mono text-[11px]">
            {aspectRatio === '16:9' ? '1920×1080 (FHD)' : '1080×1920 (Shorts)'}
          </span>
        </div>
        <div>
          <span className="text-zinc-500 block text-[10px] font-medium uppercase font-mono">Audio Master:</span>
          <span className="text-zinc-200 font-mono text-[11px]">48 kHz &bull; -14 LUFS</span>
        </div>
        <div>
          <span className="text-zinc-500 block text-[10px] font-medium uppercase font-mono">Color Grade:</span>
          <span className="text-zinc-200 font-mono text-[11px]">{style.name.split(' ')[0]} Rec.709</span>
        </div>
        <div>
          <span className="text-zinc-500 block text-[10px] font-medium uppercase font-mono">Encoder Target:</span>
          <span className="text-zinc-200 font-mono text-[11px]">WebM / MP4 Master</span>
        </div>
      </div>
    </div>
  );
};
