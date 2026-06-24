import { render } from '@testing-library/react';
import ResourcesPage from '@/app/(marketing)/resources/page';

describe('Resources Page', () => {
  it('should render without crashing', () => {
    render(<ResourcesPage />);
  });

  it('should have links to all resource sections', () => {
    const { container } = render(<ResourcesPage />);
    expect(container.textContent).toContain('Changelog');
    expect(container.textContent).toContain('FAQs');
    expect(container.textContent).toContain('Documentación');
  });
});
