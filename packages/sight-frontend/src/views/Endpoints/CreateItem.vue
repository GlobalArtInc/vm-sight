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
              {{ formModel }}
              <v-radio-group v-model="formModel.type">
                <v-radio disabled :ripple="false" :value="10" :label="this.__('types.agent')"></v-radio>
                <v-radio :ripple="false" :value="1" v-if="formModel.type === 1" :label="this.__('types.docker')"></v-radio>
                <v-radio :ripple="false" :value="2" v-else-if="formModel.type === 2" :label="this.__('types.docker_socket')"></v-radio>
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
                    <v-switch style="margin: 0" v-model="formModel.type" :true-value="2" :false-value="1"
                              label="Connect via socket "></v-switch>
                    <template v-if="formModel.type === 1 || formModel.type === 2">
                      <template v-if="formModel.type === 1">
                        <v-text-field
                            dense
                            outlined
                            v-if="!form.docker.type"
                            :label="__('endpoints.host')"
                            :placeholder="form.host.placeholder"
                            v-model="formModel.host"
                            :rules="hostRules"
                            required
                        />
                        <v-switch label="TLS" v-model="formModel.tls"/>
                        <template v-if="formModel.tls">
                          <v-file-input
                              dense
                              :prepend-icon="form.tls_ca === true ? 'fa-check':'fa-times'"
                              v-model="formModel.tls_ca" label="TLS CA certificate" style="width: 25%" outlined
                              chips class="col-3"/>
                          <v-file-input
                              dense
                              :prepend-icon="form.tls_cert === true ? 'fa-check':'fa-times'"
                              v-model="formModel.tls_cert" label="TLS certificate" style="width: 25%" outlined
                              chips class="col-3"/>
                          <v-file-input
                              dense
                              :prepend-icon="form.tls_key === true ? 'fa-check':'fa-times'"
                              v-model="formModel.tls_key" label="TLS Key" style="width: 25%" outlined chips
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
    hostRules: [
      v => !!v || "Field is required",
    ],
    formModel: {
      type: 1,
      name: "",
      host: "",
      tls: false,
      tls_ca: false,
      tls_cert: false,
      tls_key: false,
    },
    form: {
      docker: {
        type: ''
      },
      tls: false,
      tls_ca: false,
      tls_cert: false,
      tls_key: false,
      type: {
        placeholder: ""
      },
      name: {
        placeholder: ""
      },
      host: {
        placeholder: ""
      }
    }
  }),
  methods: {
    handleSubmitForm() {
      this.onSubmit()
    },
    async onSubmit() {
      const tempId = Math.random()
      if (this.$refs.form.validate()) {
        this.loading = true
        if (this.formModel.type === 2) {
         try {
           await createEndpoint({...this.formModel, host: "socket"}, "socket")
           await this.$router.push('/endpoints')
           this.$toast("The endpoint has been created", {
             type: 'success'
           });
         } catch (err) {
           this.$toast(err.response.data.message, {
             type: 'error'
           });
         } finally {
           setTimeout(() => {
             this.loading = false
           }, 500)
         }
        } else if (this.formModel.type === 1) {
          if (this.formModel.tls === true) {
            try {
              if (this.formModel.tls_ca) {
                let formData = new FormData();
                formData.append('file', this.formModel.tls_ca);
                await uploadCA(tempId, formData)
              }
              if (this.formModel.tls_cert) {
                let formData = new FormData();
                formData.append('file', this.formModel.tls_cert);
                await uploadCert(tempId, formData)
              }
              if (this.formModel.tls_key) {
                let formData = new FormData();
                formData.append('file', this.formModel.tls_key);
                await uploadKey(tempId, formData)
              }
            } catch (err) {
              this.loading = false
              this.$toast(err.message, {
                type: 'error'
              });
            }
          }
          try {
            await createEndpoint(this.formModel, tempId)
            await this.$router.push('/endpoints')

            this.$toast("The endpoint has been created", {
              type: 'success'
            });
          } catch (err) {
            this.$toast(err.response.data.message, {
              type: 'error'
            });
          } finally {
            setTimeout(() => {
              this.loading = false
            }, 500)
          }
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
