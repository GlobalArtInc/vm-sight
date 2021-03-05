<template>
  <div>
    <HelloWorld/>
  </div>
</template>

<script>
import {motd} from "@/api/api";
import HelloWorld from '../components/HelloWorld.vue'

export default {
  components: {
    HelloWorld
  },
  created() {
    motd()
  }
}
</script>