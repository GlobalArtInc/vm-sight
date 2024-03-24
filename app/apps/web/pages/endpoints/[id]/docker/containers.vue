<script setup lang="ts">
definePageMeta({
  layout: 'docker',
});

const {id} = useRoute().params;

const containers = await $fetch(`/api/protected/endpoint/${id}/exec`, {
  method: 'POST',
  body: {
    func: 'containers',
    action: 'list',
  }
})

</script>

<template>Containers</template>
