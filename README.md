# StoryBlok Integration

This integration connects to Shopware 6 to check the route name/page type of a slug. If the page is a landing page, it loads CMS blocks from Storyblok. Otherwise, it loads them from the default Shopware 6 headless CMS.

When the path is not in Shopware 6, it always returns a 404 status code. If the path is in Shopware 6 and the page type is `frontend.landing.page`, but the corresponding CMS Content is not found in Storyblok, it also returns a 404 status code."

Do not use this for production. In production, you should create an advanced caching layer that will cache the result so you don't have to make two API calls on every route switch.

### Files to look
`/pages/[...all].vue]`
`/components/ResolveStoryBlokContent.vue`
