<template>
  <v-row>
    <v-col :cols="12">
      <v-card>
        <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
          <i class="fa fa-terminal"></i>
          <span class="font-weight-medium pl-1" style="color: #333">Attach</span>
        </v-card-subtitle>
        <v-divider/>
        <v-card-text>
          <v-btn color="primary" v-if="status === 'detached'" @click="onAttach">Attach</v-btn>
          <v-btn color="primary" v-else-if="status === 'attached'" @click="onDetach">Detach</v-btn>
          <v-btn color="primary" v-else disabled>Attaching...</v-btn>
        </v-card-text>
      </v-card>
      <div style="width: 50%;margin:0 auto">
        <br/>
        <div :style="`${status==='attached'?'display:block':'display:none'}`" class="hideScroll" id="terminal" ></div>
        <!--  <xterm-vue/> -->
      </div>
    </v-col>
  </v-row>
</template>

<script>
import {Terminal} from 'xterm';

export default {
  props: {
    id: {
      type: String
    },
    hash: {
      type: String
    }
  },
  data: () => ({
    status: "",
    ws: "",
    terminal: ""
  }),
  methods: {
    onAttach() {
      this.status = ''
      this.ws = new WebSocket(`ws://${location.host}/api/ws/attach?endpointId=${this.id}&id=${this.hash}`)
      this.ws.onopen = () => {
        this.status = 'attached'
      }
      this.ws.onmessage = (message) => {
        this.terminal.writeln(message.data)
      }
      this.ws.onclose = () => {
        this.status = 'detached'
      }
    },
    onDetach() {
      this.ws.close()
      this.terminal.clear()
      this.status = 'detached'
    }
  },
  mounted() {
    this.terminal = new Terminal();
    this.terminal.open(document.getElementById('terminal'));
  },
  created() {
    this.onAttach()
  }
}

</script>
