<template>
  <div v-if="text">
    <span v-if="state === 'running'">
      <i class="fa fa-heartbeat space-right green-icon"></i>
      Running
    </span>
    <span v-else-if="state === 'paused'">
      <i class="fa fa-heartbeat space-right green-icon"></i>
      Paused
    </span>
    <span v-else>
      <i class="fa fa-heartbeat space-right red-icon"></i>
      Stopped
    </span>
  </div>
  <div v-else>
    <v-chip color="success" v-if="state === 'running'" class="font-weight-bold">
      Running
    </v-chip>
    <v-chip color="orange" v-else-if="state === 'paused'" class="font-weight-bold">
      Paused
    </v-chip>
    <v-chip color="error" v-else class="font-weight-bold">
      Stopped
    </v-chip>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class DockerStateComponent extends Vue {
  @Prop({ default: false }) text!: boolean;
  @Prop() state!: string;
  @Prop() status!: string;
}
</script>
