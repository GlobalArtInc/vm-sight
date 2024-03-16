<template>
  <div class="page-user__item">
    <v-container class="main-container">
      <v-row>
        <v-col>
          <v-card tile>
            <v-card-title>{{ formTitle }}</v-card-title>
            <v-divider/>
            <v-card-text>
              <template v-if="!this.endpointId">
                <p class="font-weight-bold">
                  Environment Type
                  <v-divider/>
                </p>
                <v-radio-group v-model="formModel.type">
                  <v-radio disabled :ripple="false" :value="10" label="Agent"></v-radio>
                  <v-radio :ripple="false" :value="1" label="Docker"></v-radio>
                  <v-radio disabled :ripple="false" :value="4" label="K8S"></v-radio>
                </v-radio-group>
              </template>
              <div>
                <div class="font-weight-bold">
                  Important notice
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
                <template>
                  <p class="font-weight-bold">
                    Environment details
                    <v-divider/>
                  </p>
                  <v-form ref="form" v-model="valid">
                    <v-row v-if="formModel.type === 1 || formModel.type === 2">
                      <v-col :cols="12">
                        <v-text-field dense outlined label="Name" v-model="formModel.name" required/>
                        <v-text-field dense outlined label="Host" v-model="formModel.host"
                                      :disabled="this.formModel.type === 2"
                                      required/>
                        <v-text-field dense outlined label="Public URL" v-model="formModel.publicUrl"/>
                      </v-col>
                    </v-row>
                  </v-form>
                </template>
              </div>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn :loading="loading" tile color="primary" @click="handleSubmitForm">
                <template v-if="this.endpointId">
                  <span class="space-left">
                    Update
                  </span>
                </template>
                <template v-else>
                  <font-awesome-icon :icon="icon.faPlus" />
                  <span class="space-left">
                  Create
                </span>
                </template>
              </v-btn>

            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator';
import { faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import endpointsService from '@/services/endpoints.service';

@Component({
  data () {
    return {
      formTitle: '',
      valid: true,
      loading: false,
      icon: { faPlus, faSave },
      formModel: {
        type: 1,
        name: '',
        host: '',
        publicUrl: '',
        tls: 0,
        tlsCa: 0,
        tlsCert: 0,
        tlsKey: 0
      }
    };
  },
  created () {
    this.formTitle = this.endpointId ? 'Update an endpoint' : 'Create an endpoint';
    if (this.endpointId) {
      const endpoint = this.$route.meta.endpoint;
      this.formModel = {
        type: endpoint.type,
        name: endpoint.name,
        host: endpoint.host,
        publicUrl: endpoint.public_url
      };
    } else {
      this.formModel.type = 1;
    }
  }
})
export default class EndpointsFormView extends Vue {
  @Prop(String) endpointId;

  async handleSubmitForm () {
    this.loading = true;
    let endpointData;
    if (this.$refs.form.validate()) {
      if (this.endpointId) {
        endpointData = {
          name: this.formModel.name,
          host: this.formModel.host,
          // eslint-disable-next-line @typescript-eslint/camelcase
          public_url: this.formModel.publicUrl
        };
        endpointsService.updateEndpoint(this.endpointId, endpointData).then(() => {
          this.$toast.success('Endpoint has been updated');
          this.$router.push('/endpoints');
        }).catch((err) => {
          this.$toast.error(err.response.data.message ?? 'An error occurred');
          setTimeout(() => {
            this.loading = false;
          }, 500);
        });
      } else {
        endpointData = {
          tempId: Math.random(),
          type: this.formModel.type,
          name: this.formModel.name,
          host: this.formModel.type === 2 ? 'socket' : this.formModel.host
        };
        endpointsService.createEndpoint(endpointData).then(() => {
          this.$toast.success('Endpoint has been created');
          this.$router.push('/endpoints');
        }).catch((err) => {
          this.$toast.error(err.response.data.message ?? 'An error occurred');
          setTimeout(() => {
            this.loading = false;
          }, 500);
        });
      }
    }
  }
}
</script>
