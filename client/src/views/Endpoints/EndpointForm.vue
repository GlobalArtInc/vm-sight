<template>
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
          </v-col>
          <template v-if="form.type === 1">
            <v-col :cols="12">

            </v-col>
          </template>
        </v-row>
      </v-form>
    </v-card-text>
    <v-divider class="mt-5"></v-divider>
    <v-card-actions>
      <v-spacer/>
      <v-btn :loaidng="loading" tile color="primary" @click="handleSubmitForm">
        {{ !this.userId ? this.__('create') : this.__('update') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {getEndpoint} from '@/api/endpoints/api'
import {createUser, updateUser} from "@/api/users/users";

export default {
  props: {
    userId: [Number, String]
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
        ca: "",
        cert: "",
        key: ""
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
      type: 0
    },
    formHasErrors: false
  }),
  computed: {
    formTitle() {
      return !this.userId ? this.__('endpointsCreate') : this.__('endpointsEdit')
    }
  },
  watch: {
    userId: {
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
        this.form.type = data.Type
        this.loading = false
      })
    },
    handleSubmitForm() {
      if (this.$refs.form.validate()) {
        if (this.userId) {
          if (this.formModel.password && this.formModel.password !== this.formModel.repeatPassword)
            return window._VMA.$emit('SHOW_SNACKBAR', {
              text: "Passwords don't compare",
              color: 'error'
            })
          this.loading = true
          this.updateUser(this.userId)
        } else {
          if (this.formModel.password !== this.formModel.repeatPassword)
            return window._VMA.$emit('SHOW_SNACKBAR', {
              text: "Passwords don't compare",
              color: 'error'
            })
          this.loading = true
          this.createUser()
        }
      }
    },
    updateUser() {
      const role = this.formModel.admin ? 1 : 0

      updateUser(this.userId, {
        Username: this.formModel.username,
        Password: this.formModel.password,
        Role: role
      }).then(() => {
        this.loading = false
        window._VMA.$emit('SHOW_SNACKBAR', {
          text: this.__('user.updated'),
          color: 'success'
        })
        this.$router.push('/users')
      }).catch((err) => {
        window._VMA.$emit('SHOW_SNACKBAR', {
          text: err.response.data.message,
          color: 'error'
        })
        setTimeout(() => this.loading = false, 500)
      })
    },
    createUser() {
      const role = this.formModel.admin ? 1 : 0
      createUser({Username: this.formModel.username, Password: this.formModel.password, Role: role}).then(() => {
        this.loading = false
        window._VMA.$emit('SHOW_SNACKBAR', {
          text: this.__('user.created'),
          color: 'success'
        })
        this.$router.push('/users')
      }).catch((err) => {
        window._VMA.$emit('SHOW_SNACKBAR', {
          text: err.response.data.message,
          color: 'error'
        })
        setTimeout(() => this.loading = false, 500)
      })
    }
  }
}
</script>