import { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2, RefreshCw } from 'lucide-react';

export default function App() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const frame = iframeRef.current;
    if (!frame) return;

    const handleLoad = () => {
      setLoaded(true);
      try {
        frame.contentWindow?.focus();
      } catch {
        // cross-origin safe
      }
    };

    frame.addEventListener('load', handleLoad);

    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => {
      frame.removeEventListener('load', handleLoad);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const reloadGame = () => {
    if (iframeRef.current) {
      setLoaded(false);
      iframeRef.current.src = '/assets/aistudio/la_cabana_v1.0.0_ebb9e5c2.html?t=' + Date.now();
    }
  };

  return (
    <main className="fixed inset-0 w-screen h-screen overflow-hidden bg-black select-none font-mono">
      {/* Top subtle floating utilities */}
      <div className="absolute top-2 right-2 z-50 flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity pointer-events-auto">
        <button
          onClick={reloadGame}
          title="Reiniciar juego"
          className="p-1.5 rounded-md bg-black/60 border border-white/20 text-neutral-300 hover:text-white hover:bg-black/90 transition-colors shadow-lg cursor-pointer"
        >
          <RefreshCw size={15} />
        </button>
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          className="p-1.5 rounded-md bg-black/60 border border-white/20 text-neutral-300 hover:text-white hover:bg-black/90 transition-colors shadow-lg cursor-pointer"
        >
          {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>
      </div>

      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-amber-500 z-40 pointer-events-none">
          <div className="text-xl font-bold tracking-widest animate-pulse mb-2">PINAR HUECO</div>
          <div className="text-xs text-neutral-400">Cargando La Cabaña...</div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src="/assets/aistudio/la_cabana_v1.0.0_ebb9e5c2.html"
        title="La Cabaña - Horror"
        className="w-full h-full border-0 block"
        allow="pointer-lock; fullscreen; autoplay; camera; microphone; accelerometer; gyroscope"
      />
    </main>
  );
}

