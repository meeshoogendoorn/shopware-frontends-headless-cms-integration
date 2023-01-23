<script lang="ts">
export default {
  name: 'PageResolver',
};
</script>

<script setup lang="ts">
import { Ref, resolveComponent } from 'vue';
import { pascalCase } from 'scule';
import { useNavigationContext } from '@shopware-pwa/composables-next';
import { SeoUrl } from '@shopware-pwa/types';

const NOT_FOUND_COMPONENT = 'errors/RoutingNotFound';
const route = useRoute();

const { data: seoResult } = await useAsyncData(
  'cmsResponse' + route.path,
  async () => {
    const { path } = route;
    const isTechnicalUrl =
      path.startsWith('/navigation/') ||
      path.startsWith('/detail/') ||
      path.startsWith('/landingPage/');

    const normalizedPath = isTechnicalUrl ? path : path.substring(1);
    const response = await fetch(`/api/pageResolver?path=${normalizedPath}`);
    const jsonResult = await response.json();
    return jsonResult?.elements[0];
  }
);

const { routeName, foreignKey } = useNavigationContext(
  seoResult as Ref<SeoUrl>
);

function render() {
  const componentName = routeName.value;
  if (!componentName)
    return h('div', h(resolveComponent(pascalCase(NOT_FOUND_COMPONENT))));

  const componentNameToResolve = pascalCase(componentName as string);
  const cmsPageView = routeName && resolveComponent(componentNameToResolve);
  if (cmsPageView) {
    if (cmsPageView === componentNameToResolve)
      return h('div', {}, 'Problem resolving component: ' + componentName);
    return h('div', h(cmsPageView, { navigationId: foreignKey.value }));
  }
  return h('div', {}, 'Loading...');
}
</script>

<template>
  <render />
</template>
