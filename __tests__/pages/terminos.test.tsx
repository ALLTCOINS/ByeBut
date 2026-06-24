import { render } from '@testing-library/react';
import TerminosPage from '@/app/(marketing)/terminos/page';

describe('Terms Page', () => {
  it('should render without crashing', () => {
    render(<TerminosPage />);
  });

  it('should have all required sections', () => {
    const { container } = render(<TerminosPage />);
    expect(container.textContent).toContain('Términos y Condiciones de Uso');
    expect(container.textContent).toContain('1. Introducción');
    expect(container.textContent).toContain('2. Lo que ByeBut NO es');
    expect(container.textContent).toContain('9. Ley Aplicable');
  });

  it('should have legal disclaimer', () => {
    const { container } = render(<TerminosPage />);
    expect(container.textContent).toContain('Aviso Legal');
  });
});
