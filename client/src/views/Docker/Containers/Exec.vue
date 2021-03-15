<template>
  <v-row>
    <v-col :cols="12">
      <v-card>
        <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
          <i class="fa fa-terminal"></i>
          <span class="font-weight-medium pl-1" style="color: #333">Actions</span>
        </v-card-subtitle>
        <v-divider/>
        <v-card-text>
          <v-text-field v-model="formModel.cmd" outlined dense label="Command" />
          <v-text-field v-model="formModel.user" outlined dense label="User" />
          <v-btn color="primary" @click="onConnect">Connect</v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import {startExec} from "@/api/endpoints/docker";

export default {
  props: {
    id:{type: String},
    hash:{type: String}
  },
  data: () => ({
    formModel: {
      cmd: "bash",
      user: "root"
    }
  }),
  created() {
    this.$store.dispatch('app/getEndpoint', this.id).then(() => {
      //
    }).catch(() => {
      this.$router.push('/')
    })
  },
  methods: {
    onConnect() {
      startExec(this.id, this.hash, {
        AttachStderr: true,
        AttachStdin: true,
        AttachStdout: true,
        Cmd: [this.formModel.cmd],
        Tty: true,
        User: this.formModel.user,
        id: this.hash
      })
    }
  }
}
</script>
