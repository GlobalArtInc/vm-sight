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

              <div class="boxselector_wrapper">
                <div>
                  <input type="radio" v-model="formModel.type" id="docker_endpoint"
                         :checked="formModel.type === 2 || formModel.type === 1" value="1">
                  <label for="docker_endpoint">
                    <div class="boxselector_header">
                      <i class="fab fa-docker" aria-hidden="true" style="margin-right: 2px;"></i>
                      Docker
                    </div>
                    <p>Directly connect to the Docker API</p>
                  </label>
                </div>
              </div>
              <p class="font-weight-bold">
                Environment details
                <v-divider/>
              </p>

              <v-form ref="form" v-model="valid">
                <v-row v-if="formModel.type === 1 || formModel.type === 2">
                  <v-col :cols="12">
                    <v-text-field
                        outlined
                        :label="__('name')"
                        :placeholder="form.name.placeholder"
                        v-model="formModel.name"
                        required
                    />
                    <v-switch v-model="form.docker.type" value="socket" label="Connect via socket "></v-switch>
                    <template v-if="formModel.type === 1 || formModel.type === 2">
                      <template v-if="formModel.type === 1">
                        <v-text-field
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
              <v-spacer/>
              <v-btn :loaidng="loading" :disabled="loading" tile color="primary" @click="handleSubmitForm">
                {{ this.__('create') }}
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
