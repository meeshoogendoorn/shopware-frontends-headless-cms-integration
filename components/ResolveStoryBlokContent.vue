<script setup lang="ts">
import { resolveComponent } from 'vue';
import { pascalCase } from 'scule';

const NOT_FOUND_COMPONENT = 'errors/RoutingNotFound';

const route = useRoute();

const loadStory = async () => {
  let story = null;
  try {
    story = await useAsyncStoryblok(route.path, {
      version: 'public',
    });
  } catch (e) {
    story = ref(null);
  }
  return story;
};

const story = await loadStory();

function render() {
  if (story.value) {
    return h(
      'div',
      h(resolveComponent('StoryblokComponent'), { blok: story.value.content })
    );
  } else {
    // if story not found show 404 page
    return h('div', h(resolveComponent(pascalCase(NOT_FOUND_COMPONENT))));
  }
}
</script>
<template>
  <render />
</template>
