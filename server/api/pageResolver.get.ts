import { createError, defineEventHandler } from 'h3';
import { createStorage } from 'unstorage';
import { useLogger } from '@nuxt/kit';
import { getQuery } from 'h3';
import { hash } from 'ohash';
import { SeoUrl } from '@shopware-pwa/types';
import { QueryValue } from 'ufo';

const logger = useLogger();
const storage = createStorage();

declare type SeoUrlEntity = {
  entity: string;
  total: number;
  aggregations: Array<any>;
  page: number;
  limit: number;
  elements: Array<any>;
  states: Array<any>;
  apiAlias: string;
};

declare type CachedSeoUrlEntity = {
  seoUrlEntity: SeoUrlEntity | SeoUrl | null;
  expire: number;
};

const resolvePath = async (path: string | QueryValue[]) => {
  const data = await fetch(
    `${process.env.SHOPWARE_ENDPOINT}/store-api/seo-url`,
    {
      method: 'POST',
      body: JSON.stringify({
        limit: 1,
        filter: [
          {
            type: 'equals',
            field: 'seoPathInfo',
            value: path,
          },
        ],
      }),
      headers: {
        'Content-Type': 'application/json',
        'sw-access-key': process.env.SHOPWARE_ACCESS_TOKEN ?? '',
      },
    }
  );

  return await data.json();
};

export default defineEventHandler(async (event) => {
  const { path, refresh } = getQuery(event);
  if (!path) {
    throw createError({
      status: 400,
      statusText: 'Missing path GET parameter',
    });
  }

  const cacheKey = `resolver/${hash(path)}`;

  if (refresh) {
    if (process.env.DEV) logger.warn('Cache refresh', cacheKey);
    await storage.removeItem(cacheKey);
  }

  const cacheEntry: CachedSeoUrlEntity | null = (await storage.getItem(
    cacheKey
  )) as CachedSeoUrlEntity;
  if (cacheEntry) {
    if (process.env.DEV) logger.success('Cache hit', cacheKey);
    if (cacheEntry.expire > Date.now()) {
      return cacheEntry?.seoUrlEntity;
    } else {
      if (process.env.DEV) logger.warn('Cache expired', cacheKey);
    }
  }

  let seoUrl = null;

  seoUrl = await resolvePath(path);
  const headers = event.node.res.getHeaders();
  headers.etag = headers.Etag || headers.etag || `W${cacheKey}`;
  headers['last-modified'] =
    headers['Last-Modified'] ||
    headers['last-modified'] ||
    new Date().toUTCString();

  const cachedSeoUrl = {
    seoUrlEntity: seoUrl,
    // cache seo-url for 1 hour  (3600000 ms)
    expire: Date.now() + 1000 * 60 * 60,
  };
  storage.setItem(cacheKey, cachedSeoUrl);

  if (process.env.DEV) logger.warn('Cache miss', cacheKey);

  return seoUrl;
});
