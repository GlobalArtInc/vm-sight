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
            <font-awesome-icon :icon="icon" />
          </i>
        </div>
        <div class="title ng-binding ng-scope">{{ count }}</div>
        <div class="comment ng-binding ng-scope">{{ name }}</div>
      </div>
    </div>
  </NuxtLink>
</template>

<style>
.widget {
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  background: #fff;
  border: 1px solid #e9e9e9;
  border-radius: 2px;
  height: 105px;
}

.widget .widget-body {
  padding: 20px;
}

.widget .widget-icon {
  background: #30426a;
  width: 65px;
  height: 65px;
  border-radius: 50%;
  text-align: center;
  vertical-align: middle;
  margin-right: 15px;
}

.widget .widget-content .title {
  font-size: 28px;
  display: block;
}

.blue {
  background: #2361ae !important;
}

.pull-left {
  float: left !important;
}

.widget .widget-content .title {
  font-size: 28px;
  display: block;
}

.widget .widget-icon i {
  line-height: 66px;
  color: #fff;
  font-size: 30px;
}
</style>
