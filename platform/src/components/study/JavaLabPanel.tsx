import { useState } from 'react';
import { executeJavaSubset } from '@/components/study/javaSubsetRunner';
import type { Chapter } from '@/content/schema';
import type { ProgressState } from '@/progress/schema';

interface JavaLabPanelProps {
  chapter: Chapter;
  progress: ProgressState;
  onUpdate: (updater: (progress: ProgressState) => ProgressState) => void;
  onMessage: (message: string) => void;
}

const snippets = {
  hello: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}',
  variables: 'int price = 40;\nint quantity = 3;\nSystem.out.println("Total: " + price + " x " + quantity);',
  loop: 'for (int i = 1; i <= 5; i++) {\n    System.out.println("Iteration " + i);\n}'
};

export function JavaLabPanel({ chapter, progress, onUpdate, onMessage }: JavaLabPanelProps) {
  const fallback = chapter.blocks.find(block => block.type === 'code')?.source ?? snippets.hello;
  const code = progress.labs[chapter.id] ?? fallback;
  const [consoleText, setConsoleText] = useState('Pronto. O console didático aparecerá aqui.');
  const [consoleError, setConsoleError] = useState(false);
  const setCode = (value: string) => onUpdate(current => ({ ...current, labs: { ...current.labs, [chapter.id]: value } }));
  const run = () => {
    try {
      setConsoleText(executeJavaSubset(code));
      setConsoleError(false);
    } catch (error) {
      setConsoleText(`Runner didático: ${error instanceof Error ? error.message : 'falha desconhecida'}\n\nBaixe o .java para compilar recursos completos com o JDK.`);
      setConsoleError(true);
    }
  };
  const download = () => {
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(new Blob([code], { type: 'text/x-java-source' }));
    anchor.download = 'Main.java';
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  };
  return <>
    <div className="hub-heading"><div><p className="hub-kicker">Laboratório offline</p><h2>Java Lab</h2><p>Rascunhe, salve e execute fundamentos sem sair do capítulo.</p></div><span className="autosave-status">Rascunho salvo</span></div>
    <div className="lab-toolbar"><select aria-label="Exemplo do Java Lab" defaultValue="chapter" onChange={event => { const value = event.target.value as keyof typeof snippets | 'chapter'; setCode(value === 'chapter' ? fallback : snippets[value]); }}><option value="chapter">Código deste capítulo</option><option value="hello">Hello World</option><option value="variables">Variáveis</option><option value="loop">Laço for</option></select><button type="button" className="primary-button" onClick={run}>▶ Executar</button><button type="button" className="secondary-button" onClick={() => { if (!navigator.clipboard) { onMessage('A área de transferência está indisponível neste contexto.'); return; } void navigator.clipboard.writeText(code).then(() => onMessage('Código copiado.')).catch(() => onMessage('O navegador bloqueou a cópia.')); }}>Copiar</button><button type="button" className="secondary-button" onClick={download}>Baixar .java</button></div>
    <textarea aria-label="Código Java" className="lab-editor" value={code} onChange={event => setCode(event.target.value)} onKeyDown={event => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); run(); } }} spellCheck={false} />
    <pre className={`lab-console ${consoleError ? 'error' : ''}`} aria-live="polite">{consoleText}</pre>
    <p className="support-note">O runner local cobre saída, variáveis, concatenação e <code>for</code> simples. Classes, Collections, Streams, threads, Maven e Spring exigem uma JVM real.</p>
  </>;
}
