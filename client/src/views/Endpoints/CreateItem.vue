<template>
  <div class="page-endpoint__item">
    <v-container class="main-container">
      <v-row>
        <v-col>
          <v-card :loading="loading" tile>
            <v-card-title>{{ formTitle }}</v-card-title>
            <v-divider/>
            <v-card-text>
              <p class="font-weight-bold">
                Environment Type
                <v-divider/>
              </p>
              <v-radio-group v-model="formModel.type">
                <v-radio disabled :ripple="false" :value="10" :label="this.__('types.agent')"></v-radio>
                <v-radio :ripple="false" :value="1" :label="this.__('types.docker')"></v-radio>
                <v-radio disabled :ripple="false" :value="4" :label="this.__('types.kubernetos')"></v-radio>
              </v-radio-group>
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
              </div>
              <p class="font-weight-bold">
                Environment details
                <v-divider/>
              </p>

              <v-form ref="form" v-model="valid">
                <v-row v-if="formModel.type === 1 || formModel.type === 2">
                  <v-col :cols="12">
                    <v-text-field
                        dense
                        outlined
                        :label="__('name')"
                        :placeholder="form.name.placeholder"
                        v-model="formModel.name"
                        required
                    />
                    <v-switch style="margin: 0" v-model="form.docker.type" value="socket"
                              label="Connect via socket "></v-switch>
                    <template v-if="formModel.type === 1 || formModel.type === 2">
                      <template v-if="formModel.type === 1">
                        <v-text-field
                            dense
                            outlined
                            v-if="!form.docker.type"
                            :label="__('endpoints.url')"
                            :placeholder="form.url.placeholder"
                            v-model="formModel.url"
                            required
                        />
                      </template>
                      <template v-else-if="formModel.type === 2">

                      </template>
                    </template>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-divider class="mt-5"></v-divider>
            <v-card-actions>
              <v-btn :loading="loading" tile color="primary" @click="handleSubmitForm">
                <v-icon>fa fa-plus</v-icon>
                <span class="space-left">
                  {{ this.__('create_endpoint') }}
                </span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import {createEndpoint} from "@/api/endpoints/api";

export default {
  props: {
    id: [String]
  },
  data: () => ({
    valid: false,
    loading: false,
    formModel: {
      type: 1,
      name: "",
      url: ""
    },
    form: {
      docker: {
        type: ''
      },
      type: {
        placeholder: ""
      },
      name: {
        placeholder: ""
      },
      url: {
        placeholder: ""
      }
    }
  }),
  methods: {
    handleSubmitForm() {
      this.onSubmit()
      // if (this.$refs.form.validate()) {
      //   this.onSubmit()
      // }
    },
    onSubmit() {
      this.loading = true
      if (this.formModel.type === 1 || this.form.docker.type === 'socket') {
        createEndpoint(this.formModel, this.form.docker.type).then(() => {
          this.$router.push('/endpoints')
          setTimeout(() => {
            this.loading = false
          }, 500)
          window._VMA.$emit('SHOW_SNACKBAR', {
            text: 'Endpoint was created',
            color: 'success'
          })
        }).catch((err) => {
          setTimeout(() => {
            this.loading = false
          }, 500)
          window._VMA.$emit('SHOW_SNACKBAR', {
            text: this.__(err.response.data.message),
            color: 'error'
          })
        })
      } else if (this.formModel.type === 1) {
        createEndpoint(this.formModel).then(() => {
          this.$router.push('/endpoints')
          setTimeout(() => {
            this.loading = false
          }, 500)
          window._VMA.$emit('SHOW_SNACKBAR', {
            text: 'Endpoint was created',
            color: 'success'
          })
        }).catch((err) => {
          setTimeout(() => {
            this.loading = false
          }, 500)
          window._VMA.$emit('SHOW_SNACKBAR', {
            text: err.response.data.message,
            color: 'error'
          })
        })
      }
    }
  },
  computed: {
    formTitle() {
      return this.__('endpointsCreate')
    },
  }
}
</script>
