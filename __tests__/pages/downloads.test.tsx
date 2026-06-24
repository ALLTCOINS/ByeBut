import { render } from '@testing-library/react';
import DownloadsPage from '@/app/(marketing)/downloads/page';

describe('Downloads Page', () => {
  it('should render without crashing', () => {
    render(<DownloadsPage />);
  });

  it('should have download cards for all platforms', () => {
    const { container } = render(<DownloadsPage />);
    expect(container.textContent).toContain('Windows');
    expect(container.textContent).toContain('macOS');
    expect(container.textContent).toContain('Linux');
  });

  it('should have silent installation section', () => {
    const { container } = render(<DownloadsPage />);
    expect(container.textContent).toContain('Instalación silenciosa');
  });

  it('should have hash verification section', () => {
    const { container } = render(<DownloadsPage />);
    expect(container.textContent).toContain('Verificación de integridad');
  });
});
