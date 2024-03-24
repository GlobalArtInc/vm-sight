<script setup lang="ts">
import { faMicrochip, faMemory, faThList, faCubes, faCopy, faHdd, faSitemap } from '@fortawesome/free-solid-svg-icons';

const { endpoint } = defineProps(['endpoint']);
const icon = { faMicrochip, faMemory, faThList, faCubes, faCopy, faHdd, faSitemap };
</script>

<template>
  <v-col :cols="12" :md="6" :xs="12">
      <docker-dashboard-widget :icon="icon.faThList" :count="endpoint.serviceInfo.StackCount || 0" name="Stacks" :href="`/endpoints/${endpoint.id}/docker/stacks`"/>
    </v-col>
    <v-col :cols="12" :md="6" :xs="12">
      <docker-dashboard-widget :icon="icon.faCubes" :count="endpoint.serviceInfo.Containers || 0" name="Containers" :href="`/endpoints/${endpoint.id}/docker/containers`"/>
    </v-col>
    <v-col :cols="12" :md="6" :xs="12">
      <docker-dashboard-widget :icon="icon.faCopy" :count="endpoint.serviceInfo.Images || 0" name="Images" :href="`/endpoints/${endpoint.id}/docker/images`"/>
    </v-col>
    <v-col :cols="12" :md="6" :xs="12">
      <docker-dashboard-widget :icon="icon.faHdd" :count="endpoint.serviceInfo.VolumeCount || 0" name="Volumes" :href="`/endpoints/${endpoint.id}/docker/volumes`"/>
    </v-col>
    <v-col :cols="12" :md="6" :xs="12">
      <!-- <Widget :icon="icon.faSitemap" :count="networks.length" name="Networks" :href="`/${endpointId}/docker/networks`"/> -->
    </v-col>
</template>

<style>
.widget {
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
  box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
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
  display: block
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