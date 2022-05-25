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
                v-model="formValid">
              <v-text-field
                  append-icon="mdi-email"
                  autocomplete="off"
                  name="login"
                  type="text"
                  label="Username"
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
                  required
                  outlined
                  v-model="formModel.password"
                  v-on:keyup.enter="login"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <template v-if="$store.getters.settings.AuthenticationMethod === 3">
              <v-btn large tile :href="$store.getters.settings.OAuthLoginURI" color="primary" style="margin: 0 auto">
                Login via OAuth
              </v-btn>
            </template>
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
import {auth, oauth} from "@/api/auth";
import {setToken} from "@/utils/auth";
import {mapGetters} from "vuex";
import {getGets} from "../../utils/global";

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
    ...mapGetters(['settings']),
    prefix() {
      return ''
    }
  },
  async created() {
    try {
      await check()
      const {code} = getGets()
      if (code) {
        oauth(code).then((response) => {
          const {jwt} = response
          setToken(jwt)
          this.$store.dispatch('user/getInfo').then(() => {
            window.location.href = '/'
          })
        }).catch(() => {
          window._VMA.$emit('SHOW_SNACKBAR', {
            text: "Login Error",
            color: 'error'
          })
        })
      }
    } catch (err) {
      await this.$router.push('/init/admin')
    }
  },
  methods: {
    async login() {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          const response = await auth(this.formModel.username, this.formModel.password)
          if (response) {
            const {jwt} = response
            setToken(jwt)
            await this.$store.dispatch('user/getInfo');
            await this.$router.push("/home");
            await this.$toast("Login successful", {
              type: 'success'
            });
          } else {
            window._VMA.$emit('SHOW_SNACKBAR', {
              text: "Login Error",
              color: 'error'
            })
          }
        } catch (err) {
          window._VMA.$emit('SHOW_SNACKBAR', {
            text: "Login Error",
            color: 'error'
          })
        } finally {
          setTimeout(() => {
            this.loading = false
          }, 750)
        }
      }
    },
    handleSocialLogin() {
    }
  }
}
</script>

<style lang="sass" scoped>
.page-login__card
  max-width: 600px
  margin: 0 auto
</style>
