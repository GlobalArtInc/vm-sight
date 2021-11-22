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
          <v-btn color="primary" v-if="status === 'detached'" @click="onAttach">Attach to Container</v-btn>
          <v-btn color="primary" v-else-if="status === 'attached'" @click="onDetach">Detach</v-btn>
          <v-btn color="primary" v-else disabled>Attaching...</v-btn>
          <template v-if="status === 'attached'">
            <br />
            <br />
          </template>
          <div :style="`${status==='attached'?'display:block':'display:none'}`" class="hideScroll"
               id="terminal-container"></div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import {Terminal} from 'xterm';
import {FitAddon} from 'xterm-addon-fit';
import {getToken} from "../../../utils/auth";

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
    terminal: new Terminal()
  }),
  beforeDestroy() {
    this.ws.close()
  },
  methods: {
    onAttach() {
      this.status = ''
      this.ws = new WebSocket(`ws://${location.host}/api/websocket/attach?token=${getToken()}&endpointId=${this.id}&id=${this.hash}`)
      //this.ws = new WebSocket(`ws://${location.host}/api/endpoints/${this.id}/docker/${this.hash}/attach?token=${getToken()}`)

      const fitAddon = new FitAddon();
      this.terminal.loadAddon(fitAddon);
      this.ws.onopen = () => {
        this.terminal.onData((data) => {
          fitAddon.fit()
          this.ws.send(data)
        });
        const termWidth = 150, termHeight = 30;
        this.terminal.resize(termWidth, termHeight);
        this.terminal.focus();
        this.terminal.setOption('cursorBlink', true);

        this.status = 'attached'
      }

      this.ws.onmessage = (message) => {
        this.terminal.writeln(message.data)
      }
      this.ws.onclose = () => {
        this.ws.close()
        this.status = 'detached'
      }
      this.ws.onerror = () => {
        this.ws.close()
        this.$toast("Connection error", {
          type: 'error'
        });
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
    const terminal_container = document.getElementById('terminal-container');
    this.terminal.open(terminal_container);
    this.onAttach()
  }
}

</script>
