<template>
  <div class="page-endpoint__item">
    <v-container class="main-container">
      <v-row>
        <v-col>
          <v-card :loading="loading" tile>
            <v-card-title>{{ formTitle }}</v-card-title>
            <v-divider/>
            <v-card-text>
              <v-form ref="form" v-model="valid">
                <v-row>
                  <v-col :cols="12">
                    <v-text-field
                        outlined
                        :label="__('name')"
                        :placeholder="form.name.placeholder"
                        v-model="formModel.name"
                        required
                        :append-icon="'mdi-name'"
                    />
                    <v-text-field
                        outlined
                        :label="__('endpoints.url')"
                        :placeholder="form.url.placeholder"
                        v-model="formModel.url"
                        required
                        :disabled="form.type === 2"
                        :append-icon="'mdi-name'"
                    />
                    <template v-if="form.type === 1">
                      <v-switch label="TLS" v-model="formModel.tls.active"/>
                      <template v-if="formModel.tls.active">
                        <v-file-input
                            :prepend-icon="form.tls.ca === true ? 'fa-check':'fa-times'"
                            v-model="formModel.tls.ca" label="TLS CA certificate" style="width: 25%"
                            outlined
                            chips class="col-3"/>
                        <v-file-input
                            :prepend-icon="form.tls.cert === true ? 'fa-check':'fa-times'"
                            v-model="formModel.tls.cert" label="TLS certificate" style="width: 25%" outlined
                                      chips class="col-3"/>
                        <v-file-input
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
              <v-spacer/>
              <v-btn :loaidng="loading" tile color="primary" @click="handleSubmitForm">
                {{ this.__('update') }}
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
    handleSubmitForm() {
      if (this.$refs.form.validate()) {
        this.onSubmit()
      }
    },
    onSubmit() {
      if (this.form.type === 1) {
        updateEndpoint(this.id, this.formModel).then(() => {
          window._VMA.$emit('SHOW_SNACKBAR', {
            text: 'Endpoint was updated',
            color: 'success'
          })
          this.$router.push('/endpoints')
        }).catch((err) => {
          window._VMA.$emit('SHOW_SNACKBAR', {
            text: err.response.data.message,
            color: 'error'
          })
        })
      }  else if (this.form.type === 2) {
        updateEndpoint(this.id, {name: this.formModel.name}).then(() => {
          window._VMA.$emit('SHOW_SNACKBAR', {
            text: 'Endpoint was updated',
            color: 'success'
          })
          this.$router.push('/endpoints')
        })
      }
    }
  }
}
</script>
