import { StrictMode } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';
import { loadCourse } from '@/content/course';
import '@/styles.css';

const rootElement = document.getElementById('root');

if (!rootElement) throw new Error('Elemento raiz do java4br não encontrado.');

let application;
try {
  const course = await loadCourse();
  application = <App course={course} />;
} catch (error) {
  const message = error instanceof Error ? error.message : 'Falha ao carregar o curso.';
  application = <main className="grid min-h-screen place-items-center p-6 text-center"><div><h1 className="font-display text-3xl font-black">Conteúdo indisponível</h1><p>{message}</p><button type="button" className="primary-button mt-4" onClick={() => window.location.reload()}>Tentar novamente</button></div></main>;
}

const root = createRoot(rootElement);
flushSync(() => {
  root.render(<StrictMode>{application}</StrictMode>);
});

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      // A aplicação continua funcional online se o navegador bloquear o cache offline.
    });
  });
}
