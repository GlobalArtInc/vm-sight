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
                        :rules="nameRules"
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
                            :rules="urlRules"
                            required
                        />
                        <v-switch label="TLS" v-model="formModel.tls.active"/>
                        <template v-if="formModel.tls.active">
                          <v-file-input
                              dense
                              :prepend-icon="form.tls.ca === true ? 'fa-check':'fa-times'"
                              v-model="formModel.tls.ca" label="TLS CA certificate" style="width: 25%" outlined
                              chips class="col-3"/>
                          <v-file-input
                              dense
                              :prepend-icon="form.tls.cert === true ? 'fa-check':'fa-times'"
                              v-model="formModel.tls.cert" label="TLS certificate" style="width: 25%" outlined
                              chips class="col-3"/>
                          <v-file-input
                              dense
                              :prepend-icon="form.tls.key === true ? 'fa-check':'fa-times'"
                              v-model="formModel.tls.key" label="TLS Key" style="width: 25%" outlined chips
                              class="col-3"/>
                        </template>

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
// eslint-disable-next-line no-unused-vars
import {uploadCA, uploadCert, uploadKey} from "@/api/endpoints/upload";

export default {
  props: {
    id: [String]
  },
  data: () => ({
    valid: false,
    loading: false,
    nameRules: [
      v => !!v || "Field is required",
      v => (v && v.length > 4) || 'Name must be less than 4 characters',
    ],
    urlRules: [
      v => !!v || "Field is required",
    ],
    formModel: {
      type: 1,
      name: "",
      url: "",
      tls: {
        active: false,
        ca: null,
        cert: null,
        key: null
      }
    },
    form: {
      docker: {
        type: ''
      },
      tls: {
        ca: false,
        cert: false,
        key: false
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
      if (this.$refs.form.validate()) {
        this.loading = true
        if (this.formModel.type === 1 && this.form.docker.type === 'socket') {
          console.log(1)
          createEndpoint(this.formModel, this.form.docker.type).then(() => {
            this.$router.push('/endpoints')
            setTimeout(() => {
              this.loading = false
            }, 500)
            this.$toast("Endpoint was created", {
              type: 'success'
            });
          }).catch((err) => {
            setTimeout(() => {
              this.loading = false
            }, 500)
            this.$toast(err.response.data.message, {
              type: 'error'
            });
          })
        } else if (this.formModel.type === 1) {
          console.log(2)
          createEndpoint(this.formModel).then(() => {
            this.$router.push('/endpoints')
            setTimeout(() => {
              this.loading = false
            }, 500)
            this.$toast("Endpoint was created", {
              type: 'success'
            });
          }).catch((err) => {
            setTimeout(() => {
              this.loading = false
            }, 500)
            this.$toast(err.response.data.message, {
              type: 'error'
            });
          })
        }
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
