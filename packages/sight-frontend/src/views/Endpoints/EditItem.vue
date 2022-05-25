<template>
  <div class="page-endpoint__item">
    <v-container class="main-container">
      <v-row>
        <v-col>
          <v-card :loading="loading" tile>
            <v-card-title>{{ formTitle }}</v-card-title>
            <v-divider/>
            <v-card-text v-if="form.type === 1 || form.type === 2">
              <v-form ref="form" v-model="valid">
                <v-row>
                  <v-col :cols="12">
                    <v-text-field
                        dense
                        outlined
                        :label="__('name')"
                        :placeholder="form.name.placeholder"
                        v-model="formModel.name"
                        :rules="nameRules"
                        required
                        :append-icon="'mdi-name'"
                    />
                    <v-text-field
                        dense
                        outlined
                        :label="__('endpoints.host')"
                        :placeholder="form.host.placeholder"
                        v-model="formModel.host"
                        required
                        :disabled="form.type === 2"
                        :append-icon="'mdi-name'"
                        :rules="hostRules"
                    />
                    <v-text-field
                        dense
                        outlined
                        :label="__('endpoints.public_url')"
                        :placeholder="form.public_url.placeholder"
                        v-model="formModel.public_url"
                        required
                        :append-icon="'mdi-name'"
                    />
                    <template v-if="form.type === 1">
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
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-divider class="mt-5"></v-divider>
            <v-card-actions>
              <v-btn :loading="loading" tile color="primary" @click="handleSubmitForm">
                {{ this.__('update_endpoint') }}
              </v-btn>
              <v-btn tile color="error" @click="handleCancel">
                {{ this.__('cancel') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<style>
.v-input__prepend-outer .fa-check {
  color: green;
}

.v-input__prepend-outer .fa-times {
  color: red;
}
</style>
<script>
import {getEndpoint, updateEndpoint} from '@/api/endpoints/api'
// eslint-disable-next-line no-unused-vars
import {uploadCA, uploadCert, uploadKey} from "@/api/endpoints/upload";

export default {
  props: {
    id: [String]
  },
  data: () => ({
    genders: ['male', 'female', 'other'],
    valid: true,
    loading: false,
    nameRules: [
      v => !!v || 'Field is required',
      v => (v && v.length > 4) || 'Name must be less than 4 characters',
    ],
    hostRules: [
      v => !!v || "Field is required",
    ],
    // publicUrlRules: [
    //   v => !!v || "Field is required",
    // ],
    formModel: {
      name: "",
      host: "",
      public_url: "",
      tls: false,
      tls_ca: false,
      tls_cert: false,
      tls_key: false,
    },
    form: {
      name: {
        label: "Name",
        placeholder: ''
      },
      host: {
        label: "Host"
      },
      public_url: {
        placeholder: ""
      },
      type: 0,
      tls: false,
      tls_ca: false,
      tls_cert: false,
      tls_key: false,
    },
    formHasErrors: false
  }),
  computed: {
    formTitle() {
      return this.__('endpointsEdit')
    }
  },
  watch: {
    id: {
      handler(id) {
        if (id) {
          this.getItemById(id)
        }
      },
      immediate: true
    }
  },
  methods: {
    getItemById(id) {
      this.loading = true
      getEndpoint(id).then(data => {
        this.formModel.name = data.name;
        this.formModel.public_url = data.public_url;
        this.formModel.host = data.host
        this.formModel.tls = data.tls === 1

        this.form.tls = {
          ca: data.tls_ca === 1,
          cert: data.tls_cert === 1,
          key: data.tls_ey === 1
        }
        this.form.type = data.type
        this.loading = false
      })
    },
    async handleSubmitForm() {
      if (this.$refs.form.validate()) {
        this.loading = true
        if (this.formModel.tls === true) {
          try {
            if (this.formModel.tls_ca) {
              let formData = new FormData();
              formData.append('file', this.formModel.tls_ca);
              await uploadCA(this.id, formData)
            }
            if (this.formModel.tls_cert) {
              let formData = new FormData();
              formData.append('file', this.formModel.tls_cert);
              await uploadCert(this.id, formData)
            }
            if (this.formModel.tls_key) {
              let formData = new FormData();
              formData.append('file', this.formModel.tls_key);
              await uploadKey(this.id, formData)
            }
          } catch (err) {
            this.loading = false
            this.$toast(err.message, {
              type: 'error'
            });
          }
        }
        await this.onSubmit()
      }
    },
    handleCancel() {
      this.$router.push('/endpoints')
    },
    async onSubmit() {
      if (this.form.type === 1) {
        if (this.formModel.tls === true) {
          try {
            await updateEndpoint(this.id, this.formModel)
            window._VMA.$emit('SHOW_SNACKBAR', {
              text: 'The endpoint has been saved',
              color: 'success'
            })
            await this.$router.push('/endpoints')
          } catch (err) {
            window._VMA.$emit('SHOW_SNACKBAR', {
              text: err.response.data.message,
              color: 'error'
            })
          } finally {
            this.loading = false
          }

        } else {
          try {
            await updateEndpoint(this.id, this.formModel)
            window._VMA.$emit('SHOW_SNACKBAR', {
              text: 'The endpoint has been saved',
              color: 'success'
            })
            await this.$router.push('/endpoints')
          } catch (err) {
            window._VMA.$emit('SHOW_SNACKBAR', {
              text: err.response.data.message,
              color: 'error'
            })
          } finally {
            this.loading = false
          }
        }
      } else if (this.form.type === 2) {
        try {
          await updateEndpoint(this.id, {
            name: this.formModel.name,
            host: "socket",
            public_url: this.formModel.public_url,
            tls: false,
            tls_ca: false,
            tls_cert: false,
            tls_key: false,
          })
          window._VMA.$emit('SHOW_SNACKBAR', {
            text: 'The endpoint has been saved',
            color: 'success'
          })
          await this.$router.push('/endpoints')
        } catch (err) {
          window._VMA.$emit('SHOW_SNACKBAR', {
            text: err.response.data.message,
            color: 'error'
          })
        } finally {
          this.loading = false
        }
      } else {
        this.loading = false
      }
    }
  }
}
</script>
