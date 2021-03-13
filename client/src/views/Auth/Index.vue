<template>
  <v-container class="page-login" fill-height>
    <v-row>
      <v-col>
        <v-card class="pa-3 page-login__card" tile>
          <v-card-title>
            <h1 class="primary--text display-1 page-login_title">
              VM-SIGHT
            </h1>
          </v-card-title>
          <v-card-text>
            <v-form
                ref="form"
                class="my-10"
                lazy-validation
                v-model="formValid"
            >
              <v-text-field
                  append-icon="mdi-email"
                  autocomplete="off"
                  name="login"
                  type="text"
                  label="Username"
                  placeholder="Username"
                  required
                  outlined
                  :rules="formRule.username"
                  v-model="formModel.username"
              />
              <v-text-field
                  append-icon="mdi-lock"
                  autocomplete="off"
                  name="password"
                  type="password"
                  :rules="formRule.password"
                  label="Password"
                  placeholder="Password"
                  required
                  outlined
                  v-model="formModel.password"
                  v-on:keyup.enter="login"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn large tile color="primary" @click="login" :loading="loading">
              Login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {check} from "@/api/users/admin";
import {auth} from "@/api/auth";
import {setToken} from "@/utils/auth";

export default {
  name: 'PageLogin',
  data() {
    return {
      loading: false,
      formValid: false,
      formModel: {
        username: null,
        password: null
      },
      formRule: {
        username: [(v) => !!v || "Username not specified"],
        password: [(v) => !!v || "Password not specified"]
      }
    }
  },
  computed: {
    prefix() {
      return ''
    }
  },
  created() {
    check().then(() => {

    }).catch(() => {
      this.$router.push('/init/admin')
    })
  },
  methods: {
    login() {
      if (this.$refs.form.validate()) {
        this.loading = true
        auth(this.formModel.username, this.formModel.password).then((response) => {
          const {jwt} = response
          setToken(jwt)
          this.$store.dispatch('user/getInfo').then(() => {
            this.$router.push("/home").catch(() => {
            });
          })
        }).catch((err) => {
          console.log(err)
          window._VMA.$emit('SHOW_SNACKBAR', {
            text: err.response.data.message,
            color: 'error'
          })
        }).finally(() => {
          setTimeout(() => {
            this.loading = false
          }, 750)
        })
      }
    },
    handleSocialLogin() {
    }
  }
}
</script>

<style lang="sass" scoped>
.page-blank__card
  max-width: 600px
  margin: 0 auto
</style>
