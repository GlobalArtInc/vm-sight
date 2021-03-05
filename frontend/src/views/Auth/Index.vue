<template>
  <v-card>
    <v-card-title>
      Login
    </v-card-title>
    <v-form>
      <v-card-text>

        <v-text-field
            v-model="username"
            color="primary"
            label="Username"
            filled
            required/>

        <v-text-field
            v-model="password"
            type="password"
            color="primary"
            label="Password"
            filled
            required/>

        <v-btn type="submit" color="success" @click="onLogin">
          Login
        </v-btn>
      </v-card-text>
    </v-form>
  </v-card>
</template>

<script>
import {check} from '@/api/users/admin'
import {auth} from "@/api/auth";
import {setToken} from "@/utils/auth";

export default {
  data: () => ({
    username: "",
    password: ""
  }),
  methods: {
    async onLogin(e) {
      e.preventDefault()
      auth(this.username, this.password).then((response) => {
        const {jwt} = response
        setToken(jwt)
        this.$router.push('/home')
      })
    }
  },
  created() {
    check().then(() => {

    }).catch(() => {
      this.$router.push('/init/admin')
    })
  }
}

</script>