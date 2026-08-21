import { useEffect, useRef, useState } from 'react';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export interface PwaState {
  online: boolean;
  installed: boolean;
  installAvailable: boolean;
  status: string;
  install: () => Promise<string>;
  refreshOffline: () => Promise<string>;
}

function standalone() {
  return (typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches)
    || ('standalone' in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true);
}

export function usePwa(): PwaState {
  const promptRef = useRef<InstallPromptEvent | null>(null);
  const [online, setOnline] = useState(navigator.onLine);
  const [installed, setInstalled] = useState(standalone);
  const [installAvailable, setInstallAvailable] = useState(false);
  const [status, setStatus] = useState(() => 'serviceWorker' in navigator
    ? 'Verificando o cache offline...'
    : 'Este navegador não oferece Service Worker; o curso ainda funciona enquanto a página permanecer aberta.');

  useEffect(() => {
    const updateConnection = () => setOnline(navigator.onLine);
    const capturePrompt = (event: Event) => {
      event.preventDefault();
      promptRef.current = event as InstallPromptEvent;
      setInstallAvailable(true);
    };
    const markInstalled = () => {
      promptRef.current = null;
      setInstallAvailable(false);
      setInstalled(true);
      setStatus('Aplicativo instalado e disponível pelo sistema.');
    };
    window.addEventListener('online', updateConnection);
    window.addEventListener('offline', updateConnection);
    window.addEventListener('beforeinstallprompt', capturePrompt);
    window.addEventListener('appinstalled', markInstalled);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then(() => setStatus('Curso integral armazenado e pronto para abrir sem internet.'))
        .catch(() => setStatus('O navegador bloqueou a confirmação do cache offline.'));
    }
    return () => {
      window.removeEventListener('online', updateConnection);
      window.removeEventListener('offline', updateConnection);
      window.removeEventListener('beforeinstallprompt', capturePrompt);
      window.removeEventListener('appinstalled', markInstalled);
    };
  }, []);

  const install = async () => {
    if (installed) return 'O java4br já está instalado neste dispositivo.';
    if (!promptRef.current) return 'Use “Instalar aplicativo” no menu do navegador quando a opção estiver disponível.';
    await promptRef.current.prompt();
    const choice = await promptRef.current.userChoice;
    promptRef.current = null;
    setInstallAvailable(false);
    return choice.outcome === 'accepted' ? 'Instalação aceita.' : 'Instalação cancelada; você pode tentar novamente pelo menu do navegador.';
  };

  const refreshOffline = async () => {
    if (!('serviceWorker' in navigator)) return 'Service Worker indisponível neste navegador.';
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) return 'Abra o java4br por HTTPS ou localhost para ativar o cache offline.';
    await registration.update();
    const worker = registration.waiting ?? registration.active ?? registration.installing;
    worker?.postMessage({ type: 'CACHE_COURSE' });
    setStatus('Atualização do conteúdo offline solicitada.');
    return 'Cache offline atualizado com os arquivos atuais do curso.';
  };

  return { online, installed, installAvailable, status, install, refreshOffline };
}
