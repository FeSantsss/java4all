import { fireEvent, render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { App } from '@/app/App';
import { assembleCourse, type GeneratedCourseData } from '@/content/course';
import generatedCourse from '@/content/generated-course.json';

const course = assembleCourse(generatedCourse as GeneratedCourseData);

describe('application accessibility', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
    window.localStorage?.clear();
    window.scrollTo = vi.fn();
  });

  it('has no automatically detectable accessibility violations', async () => {
    const { container } = render(<App course={course} />);
    await screen.findByRole('heading', { level: 1, name: 'Introdução & ambiente' });

    const result = await axe.run(container, {
      rules: {
        // jsdom has no layout engine, so contrast is covered by the CSS token audit.
        'color-contrast': { enabled: false }
      }
    });

    expect(result.violations).toEqual([]);
  });

  it('keeps the open study hub free of detectable accessibility violations', async () => {
    const { container } = render(<App course={course} />);
    await screen.findByRole('heading', { level: 1, name: 'Introdução & ambiente' });
    fireEvent.click(screen.getByRole('button', { name: 'Central de estudos' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Domínio e erros' }));
    const result = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(result.violations).toEqual([]);
  });
});
