import { describe, it, expect } from 'vitest';
import { DiscogsService } from '../../services/discogs.service.js';

describe('DiscogsService', () => {
  it('recherche des albums sur Discogs', async () => {
    // Si pas de token ou test hors ligne, on peut soit skipper soit tester si l'appel fonctionne
    if (!process.env.DISCOGS_TOKEN) {
      console.warn('DISCOGS_TOKEN non défini, test Discogs ignoré');
      return;
    }

    const result = await DiscogsService.search({ query: 'Daft Punk', type: 'release', per_page: 5 });
    expect(result).toBeDefined();
    expect(result.results).toBeInstanceOf(Array);
    expect(result.results.length).toBeGreaterThan(0);
  }, 10000);

  it('récupère une release spécifique sur Discogs', async () => {
    if (!process.env.DISCOGS_TOKEN) {
      console.warn('DISCOGS_TOKEN non défini, test Discogs ignoré');
      return;
    }

    // ID 249504 correspond généralement à Discovery de Daft Punk par exemple
    const release = await DiscogsService.getRelease('249504');
    expect(release).toBeDefined();
    expect(release.id).toBe(249504);
    expect(release.title).toBeDefined();
  }, 10000);
});
