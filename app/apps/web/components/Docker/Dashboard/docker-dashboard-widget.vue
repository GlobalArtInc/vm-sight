<script setup lang="ts">
const { icon, count, href, name } = defineProps(['icon', 'count', 'name', 'href']);
</script>

<template>
  <NuxtLink :to="href">
    <div class="widget">
    <div class="widget-body">
      <div class="loading">
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
      </div>
      <div class="widget-icon blue pull-left ng-scope">
        <i>
          <font-awesome-icon :icon="icon"/>
        </i>
      </div>
      <div class="title ng-binding ng-scope">{{ count }}</div>
      <div class="comment ng-binding ng-scope">{{ name }}</div>
    </div>
  </div>
    
  </NuxtLink>
</template>
