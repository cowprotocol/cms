/**
 * solver-network service
 */

import fetch from 'node-fetch';

export default {
  async search(params) {
    const { q } = params;
    const meiliUrl = 'http://meilisearch:7700/indexes/solver-network/search';
    const response = await fetch(meiliUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q }),
    });

    if (!response.ok) {
      throw new Error(`Meilisearch error: ${response.statusText}`);
    }

    return await response.json();
  },
};
