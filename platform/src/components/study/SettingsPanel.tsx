import { useEffect, useState, type RefObject } from 'react';
import type { PwaState } from '@/pwa/usePwa';
import type { ProgressState } from '@/progress/schema';

interface SettingsPanelProps {
  progress: ProgressState;
  pwa: PwaState;
  importRef: RefObject<HTMLInputElement | null>;
  onUpdate: (updater: (progress: ProgressState) => ProgressState) => void;
  onExport: () => void;
  onImport: (file?: File) => Promise<void>;
  onReset: () => void;
  onMessage: (message: string) => void;
}

export function SettingsPanel({ progress, pwa, importRef, onUpdate, onExport, onImport, onReset, onMessage }: SettingsPanelProps) {
  const [storage, setStorage] = useState('Calculando uso local...');
  useEffect(() => {
    const bytes = new Blob([JSON.stringify(progress)]).size;
    navigator.storage?.estimate().then(estimate => {
      const total = estimate.usage ? ` · uso total do site ${(estimate.usage / 1024 / 1024).toFixed(1)} MB` : '';
      setStorage(`Dados de estudo ${(bytes / 1024).toFixed(1)} KB${total}.`);
    }).catch(() => setStorage(`Dados de estudo ${(bytes / 1024).toFixed(1)} KB.`));
  }, [progress]);
  const systemContrast = typeof window.matchMedia === 'function' && (window.matchMedia('(prefers-color-scheme: dark)').matches || window.matchMedia('(prefers-contrast: more)').matches || window.matchMedia('(forced-colors: active)').matches);
  return <>
    <div className="hub-heading"><div><p className="hub-kicker">Personalização e dados</p><h2>Preferências</h2><p>Tema, leitura, instalação, backup e privacidade.</p></div></div>
    <div className="setting-row"><div><strong>Tema de leitura</strong><small>{progress.settings.theme === 'system' ? `Seguindo o sistema: ${systemContrast ? 'alto contraste' : 'branco'}.` : 'Escolha Sistema para acompanhar automaticamente o dispositivo.'}</small></div><div className="segmented" role="group" aria-label="Tema de leitura">{([['system', 'Sistema'], ['white', 'Branco'], ['contrast', 'Alto contraste']] as const).map(([theme, label]) => <button type="button" key={theme} aria-pressed={progress.settings.theme === theme} onClick={() => onUpdate(current => ({ ...current, settings: { ...current.settings, theme } }))}>{label}</button>)}</div></div>
    <div className="setting-row"><div><strong>Tamanho do texto</strong><small>Ajusta conteúdo, menus e painéis.</small></div><div className="segmented" role="group" aria-label="Tamanho do texto">{[0.9, 1, 1.12, 1.24].map((size, index) => <button type="button" key={size} aria-pressed={progress.settings.fontScale === size} onClick={() => onUpdate(current => ({ ...current, settings: { ...current.settings, fontScale: size } }))}>{['A−', 'A', 'A+', 'A++'][index]}</button>)}</div></div>
    <div className="setting-row"><div><strong>Modo foco</strong><small>Oculta a trilha lateral e centraliza a leitura.</small></div><button type="button" className="secondary-button" aria-pressed={progress.settings.focusMode} onClick={() => onUpdate(current => ({ ...current, settings: { ...current.settings, focusMode: !current.settings.focusMode } }))}>{progress.settings.focusMode ? 'Desativar' : 'Ativar'}</button></div>
    <div className="setting-row"><div><strong>Modo revisão rápida</strong><small>Destaca exercícios, quizzes, alertas e inglês do capítulo.</small></div><button type="button" className="secondary-button" aria-pressed={progress.settings.reviewMode} onClick={() => onUpdate(current => ({ ...current, settings: { ...current.settings, reviewMode: !current.settings.reviewMode } }))}>{progress.settings.reviewMode ? 'Desativar' : 'Ativar'}</button></div>
    <div className="setting-row"><div><strong>Reduzir movimentos</strong><small>Remove animações e rolagens suaves.</small></div><button type="button" className="secondary-button" aria-pressed={progress.settings.reducedMotion} onClick={() => onUpdate(current => ({ ...current, settings: { ...current.settings, reducedMotion: !current.settings.reducedMotion } }))}>{progress.settings.reducedMotion ? 'Desativar' : 'Ativar'}</button></div>
    <div className="setting-row"><div><strong>Curso offline e instalável</strong><small>{pwa.status} Estado atual: {pwa.online ? 'online' : 'offline'}.</small></div><div className="setting-actions"><button type="button" className="primary-button" disabled={pwa.installed} onClick={() => void pwa.install().then(onMessage)}>{pwa.installed ? 'App instalado' : pwa.installAvailable ? 'Instalar app' : 'Como instalar'}</button><button type="button" className="secondary-button" onClick={() => void pwa.refreshOffline().then(onMessage).catch(error => onMessage(error instanceof Error ? error.message : 'Falha ao atualizar cache.'))}>Atualizar cache</button></div></div>
    <div className="setting-row"><div><strong>Backup do seu estudo</strong><small>Inclui progresso, respostas, notas, inglês, revisões, domínio, erros, diagnósticos, rascunhos e preferências.</small></div><div className="setting-actions"><button type="button" className="secondary-button" onClick={onExport}>Exportar JSON</button><button type="button" className="secondary-button" onClick={() => importRef.current?.click()}>Importar backup</button><input ref={importRef} type="file" accept="application/json,.json" className="sr-only" onChange={event => void onImport(event.target.files?.[0])} /></div></div>
    <div className="setting-row"><div><strong>Recomeçar do zero</strong><small>Apaga os dados locais; o conteúdo offline permanece.</small></div><button type="button" className="danger-button" onClick={onReset}>Apagar meus dados</button></div>
    <p className="support-note">{storage}</p>
  </>;
}
