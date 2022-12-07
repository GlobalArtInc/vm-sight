<template>
  <v-container class="page-blank" style="margin-top: 100px">
    <v-row>
      <v-col :cols="12">
        <v-card class="page-blank__card" tile>
          <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
            <i class="fa fa-hdd"></i>
            <span class="font-weight-medium pl-1" style="color: #333">
            Create first endpoint
          </span>
          </v-card-subtitle>

          <v-card-text>
            <v-row>
              <v-col :cols="12">
                <v-radio-group v-model="formModel.type">
                  <v-radio disabled :ripple="false" :value="10" label="Agent"></v-radio>
                  <v-radio :ripple="false" :value="1" label="Docker (Local)"></v-radio>
                  <v-radio disabled :ripple="false" :value="4" label="Kubernetes"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col :cols="12">
                <div>
                  <div class="font-weight-bold">
                    Information
                    <v-divider/>
                  </div>
                  <p style="margin-top:1em;margin-bottom: 1em;" class="text-muted small">
                    You can connect SIGHT to a Docker environment via socket or via TCP. You can find more information
                    about how to expose the Docker API over TCP
                    <a href="https://docs.docker.com/engine/security/https/"> in the Docker documentation</a>.
                  </p>
                  <p style="margin-top:1em;margin-bottom: 1em;" class="text-muted small">
                    When using the socket, ensure that you have started the SIGHT container with the following Docker flag
                    <span class="code"> -v "/var/run/docker.sock:/var/run/docker.sock" </span>
                    (on Linux) or
                    <span class="code"> -v \.\pipe\docker_engine:\.\pipe\docker_engine </span>
                    (on Windows).
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="onCreateDocker">
              <v-icon small class="space-right">fa-bolt</v-icon>
              Connect
            </v-btn>
            <v-btn color="primary" @click="toSkip">
              <v-icon small class="space-right">fa-share</v-icon>
              Skip
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import endpointsService from '@/services/endpoints.service';

@Component
export default class InitEndpointView extends Vue {
  formModel = {
    type: 1
  }

  onCreateDocker () {
    endpointsService.createEndpoint({
      tempId: Math.random(),
      type: 2,
      name: 'Docker (local)',
      host: 'socket'
    }).then(() => {
      this.$router.push('/dashboard');
    }).catch((err) => {
      this.$toast(err, {
        type: 'error'
      });
    });
  }

  toSkip () {
    return this.$router.push('/dashboard');
  }
}
</script>
