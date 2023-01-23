# StoryBlok Integration

This integration connects to Shopware to check if the SEO URL exists in the instance. If it doesn't exist, it will fall back to Storyblok or return a 404 error if the SEO URL also doesn't exist in Storyblok.


Do not use this for production. In production, you should create an advanced caching layer that will cache the result so you don't have to make two API calls on every route switch.

### Files to look
`/pages/[...all].vue]`
`/components/ResolveStoryBlokContent.vue`
