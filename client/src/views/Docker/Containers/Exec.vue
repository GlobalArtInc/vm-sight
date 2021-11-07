<template>
  <v-row>
    <v-col :cols="12">
      <v-card>
        <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
          <i class="fa fa-terminal"></i>
          <span class="font-weight-medium pl-1" style="color: #333">Console</span>
        </v-card-subtitle>
        <v-divider/>
        <v-card-text>
          <v-select
              label="Command"
              outlined
              dense
              v-model="formModel.cmd"
              :items="itemsCommands"
              item-text="text"
                item-value="command"/>
          <v-text-field v-model="formModel.user" outlined dense label="User"/>
          <v-btn color="primary" @click="onConnect">Connect</v-btn>
        </v-card-text>
      </v-card>
      <div style="width: 50%;margin:0 auto">
        <xterm-vue :title-change="dev" />
      </div>
    </v-col>
  </v-row>
</template>

<script>
import {startExec} from "@/api/endpoints/docker";
import {getToken} from "@/utils/auth";
import {Terminal} from 'xterm';

export default {
  props: {
    id: {type: String},
    hash: {type: String}
  },
  data: () => ({
    itemsCommands: [
      {text: '/bin/ash', command: 'ash'},
      {text: '/bin/bash', command: 'bash'},
      {text: '/bin/sh', command: 'sh'}
    ],
    formModel: {
      cmd: "bash",
      user: "root"
    },
    term: "",
    ws: null
  }),
  mounted () {

  },
  methods: {
    dev() {
      console.log(2)
    },
    runRealTerminal () {
      console.log('webSocket is finished')
    },
    errorRealTerminal () {
      console.log('error')
    },
    closeRealTerminal () {
      console.log('close')
    },
    send() {
      this.ws.send('тест сообщение');
    },
    onConnect() {
      startExec(this.id, this.hash, {
        AttachStderr: true,
        AttachStdin: true,
        AttachStdout: true,
        Cmd: [this.formModel.cmd],
        Tty: true,
        User: this.formModel.user,
        id: this.hash
      }).then((data) => {
        // eslint-disable-next-line no-unused-vars
        let terminalContainer = document.getElementById('terminal')
        this.term = new Terminal({
          cursorBlink: true
        })
        this.term.open(terminalContainer)
        // open websocket
        this.terminalSocket = new WebSocket(`ws://localhost:3600/api/ws/exec?token=${getToken()}&endpoint=${this.hash}&id=${data.Id}`)
        this.terminalSocket.onopen = this.runRealTerminal
        this.terminalSocket.onclose = this.closeRealTerminal
        this.terminalSocket.onerror = this.errorRealTerminal
        this.term._initialized = true
        console.log('mounted is going on')
      })
    }
  }
}
</script>
