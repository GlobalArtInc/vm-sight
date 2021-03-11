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
                        required
                        :append-icon="'mdi-name'"
                    />
                    <v-text-field
                        dense
                        outlined
                        :label="__('endpoints.url')"
                        :placeholder="form.url.placeholder"
                        v-model="formModel.url"
                        required
                        :disabled="form.type === 2"
                        :append-icon="'mdi-name'"
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
                      <v-switch label="TLS" v-model="formModel.tls.active"/>
                      <template v-if="formModel.tls.active">
                        <v-file-input
                            dense
                            @change="uploadCert($event, 'ca')"
                            :prepend-icon="form.tls.ca === true ? 'fa-check':'fa-times'"
                            v-model="formModel.tls.ca" label="TLS CA certificate" style="width: 25%" outlined
                            chips class="col-3"/>
                        <v-file-input
                            dense
                            @change="uploadCert($event, 'cert')"
                            :prepend-icon="form.tls.cert === true ? 'fa-check':'fa-times'"
                            v-model="formModel.tls.cert" label="TLS certificate" style="width: 25%" outlined
                                      chips class="col-3"/>
                        <v-file-input
                            dense
                            @change="uploadCert($event, 'key')"
                            :prepend-icon="form.tls.key === true ? 'fa-check':'fa-times'"
                            v-model="formModel.tls.key" label="TLS Key" style="width: 25%" outlined chips
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
    formModel: {
      name: "",
      url: "",
      public_url: "",
      tls: {
        active: false,
        ca: null,
        cert: null,
        key: null
      }
    },
    form: {
      name: {
        label: "Name",
        placeholder: ''
      },
      url: {
        label: "URL"
      },
      public_url: {
        placeholder: ""
      },
      type: 0,
      tls: {
        ca: false,
        cert: false,
        key: false
      }
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
    // eslint-disable-next-line no-unused-vars
    uploadCert(file, type) {
      //let formData = new FormData();
      //formData.append('file', file);
      //
      //switch (type){
      //  case 'ca':
      //    uploadCA(this.id, formData)
      //    break;
      //}
    },
    getItemById(id) {
      this.loading = true
      getEndpoint(id).then(data => {
        this.formModel.name = data.Name;
        this.formModel.url = data.URL;
        this.formModel.tls.active = data.TLS === 1

        this.form.tls = {
          ca: data.TLS_CA === 1,
          cert: data.TLS_CERT === 1,
          key: data.TLS_KEY === 1
        }
        this.form.type = data.Type
        this.loading = false
      })
    },
    async handleSubmitForm() {
      if (this.$refs.form.validate()) {
        this.loading = true
        if (this.formModel.tls.active === true) {
          if (this.formModel.tls.ca) {
            let formData = new FormData();
            formData.append('file', this.formModel.tls.ca);
            await uploadCA(this.id, formData)
          }
          if (this.formModel.tls.cert) {
            let formData = new FormData();
            formData.append('file', this.formModel.tls.cert);
            await uploadCert(this.id, formData)
          }
          if (this.formModel.tls.key) {
            let formData = new FormData();
            formData.append('file', this.formModel.tls.key);
            await uploadKey(this.id, formData)
          }
        }
        this.onSubmit()
      }
    },
    handleCancel() {
      this.$router.push('/endpoints')
    },
    onSubmit() {
      if (this.form.type === 1) {
        if(this.formModel.tls.active === true) {
          updateEndpoint(this.id, this.formModel).then(() => {
            window._VMA.$emit('SHOW_SNACKBAR', {
              text: 'Endpoint was updated',
              color: 'success'
            })
            this.$router.push('/endpoints')
          }).catch((err) => {
            this.loading = false
            window._VMA.$emit('SHOW_SNACKBAR', {
              text: err.response.data.message,
              color: 'error'
            })
          })
        } else {
          updateEndpoint(this.id, this.formModel).then(() => {
            window._VMA.$emit('SHOW_SNACKBAR', {
              text: 'Endpoint was updated',
              color: 'success'
            })
            this.$router.push('/endpoints')
          }).catch((err) => {
            this.loading = false
            window._VMA.$emit('SHOW_SNACKBAR', {
              text: err.response.data.message,
              color: 'error'
            })
          })
        }
      }  else if (this.form.type === 2) {
        updateEndpoint(this.id, {name: this.formModel.name}).then(() => {
          window._VMA.$emit('SHOW_SNACKBAR', {
            text: 'Endpoint was updated',
            color: 'success'
          })
          this.$router.push('/endpoints')
        })
      } else {
        this.loading = false
      }
    }
  }
}
</script>
