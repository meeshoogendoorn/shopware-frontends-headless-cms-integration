# Caching layer seoUrl

By utilizing the cache layer/API route that I created in the server directory, resolving SEO URLs will be faster, taking around 20 milliseconds depending on server performance. I set the cache expiration time to 1 hour, but this can be modified in the server handler file."

### Files to look
`/server/api/pageResolver.get.ts`
`/pages/[...all].vue]`
