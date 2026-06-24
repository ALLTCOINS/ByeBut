import changelogData from '@/lib/changelog.json';

describe('Changelog JSON', () => {
  it('should be an array', () => {
    expect(Array.isArray(changelogData)).toBe(true);
  });

  it('should have required fields for each entry', () => {
    changelogData.forEach((entry) => {
      expect(entry).toHaveProperty('version');
      expect(entry).toHaveProperty('date');
      expect(entry).toHaveProperty('type');
      expect(entry).toHaveProperty('title');
      expect(entry).toHaveProperty('description');
      expect(entry).toHaveProperty('changes');
    });
  });

  it('should have valid version format', () => {
    changelogData.forEach((entry) => {
      expect(entry.version).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  it('should have valid date format', () => {
    changelogData.forEach((entry) => {
      expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  it('should have valid type', () => {
    const validTypes = ['feature', 'improvement', 'release', 'fix'];
    changelogData.forEach((entry) => {
      expect(validTypes).toContain(entry.type);
    });
  });

  it('should have changes as array', () => {
    changelogData.forEach((entry) => {
      expect(Array.isArray(entry.changes)).toBe(true);
      expect(entry.changes.length).toBeGreaterThan(0);
    });
  });

  it('should be sorted by date descending', () => {
    for (let i = 0; i < changelogData.length - 1; i++) {
      const date1 = new Date(changelogData[i].date).getTime();
      const date2 = new Date(changelogData[i + 1].date).getTime();
      expect(date1).toBeGreaterThanOrEqual(date2);
    }
  });
});
