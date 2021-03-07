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
                :label="__('user.username')"
                :placeholder="form.username.placeholder"
                v-model="formModel.username"
                required
                :append-icon="'mdi-account-check'"
                :rules="form.username.rules"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="6">
            <v-text-field
                outlined
                :label="__('user.password')"
                type="password"
                :placeholder="form.password.placeholder"
                value=""
                v-model="formModel.password"
                required
                :append-icon="'mdi-account-check'"
            />
          </v-col>
          <v-col :cols="6">
            <v-text-field
                outlined
                :label="__('user.repeatPassword')"
                type="password"
                :placeholder="form.password.placeholder"
                value=""
                v-model="formModel.repeatPassword"
                :append-icon="'mdi-account-check'"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="12" style="padding-top: 0;margin-top: 0">
            <v-switch v-model="formModel.admin" :ripple="false" :label="__('user.administrator')"/>
          </v-col>
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
import {fetchUser, createUser, updateUser} from "@/api/users/users";

export default {
  props: {
    userId: [Number, String]
  },
  data: () => ({
    genders: ['male', 'female', 'other'],
    valid: true,
    loading: false,
    formModel: {
      username: "",
      password: "",
      repeatPassword: "",
      admin: false
    },
    form: {
      username: {
        label: 'Username',
        placeholder: '',
        rules: [(v) => !!v || 'This field is required']
      },
      password: {
        placeholder: 'xxx',
        rules: [(v) => !!v || 'This field is required']
      },
      email: {
        label: 'Email',
        placeholder: 'wangqiangshen@gmail.com',
        rules: [
          (v) => !!v || 'This field is required'
        ]
      },
      phone: {
        label: 'phone',
        placeholder: '18682157492',
        rules: [(v) => !!v || 'This field is required']
      },
      firstname: {
        label: 'Firstname',
        placeholder: 'Firstname',
        rules: [(v) => !!v || 'This field is required']
      },
      lastname: {
        label: 'Lastname',
        placeholder: 'Lastname',
        rules: [(v) => !!v || 'This field is required']
      },
      gender: {
        label: 'Gender',
        placeholder: 'gender',
        rules: [(v) => !!v || 'This field is required']
      }
    },
    formHasErrors: false
  }),
  computed: {
    formTitle() {
      return !this.userId ? this.__('usersCreate') : this.__('usersEdit')
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
      fetchUser(id).then((user) => {
        this.formModel = {
          username: user.username,
          admin: user.role === 1
        }
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