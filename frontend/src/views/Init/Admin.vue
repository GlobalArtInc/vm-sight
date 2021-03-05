<template>
  <v-card>
    <v-card-title>Create User</v-card-title>
    <v-form
        ref="form"
        v-model="valid"
        lazy-validation>
      <v-card-text>

        <v-text-field
            v-model="username"
            color="primary"
            :counter="25"
            label="Name"
            filled
            required/>

        <v-text-field
            v-model="password"
            type="password"
            color="primary"
            label="Password"
            filled
            required/>

        <v-text-field
            v-model="passwordRepeat"
            type="password"
            color="primary"
            label="Repeat Password"
            filled
            required/>

        <p style="text-align: left">
          <v-icon :style="{color: password.length >= 8 ? 'green':'red'}">fa-check</v-icon>
          The password must be at least 8 characters long
          <br>
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn
            :disabled="password !== passwordRepeat || password.length < 8"
            color="success"
            class="mr-4"
            @click="createUser">
          Create user
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import {check, init} from '@/api/users/admin'
import {auth} from "@/api/auth";
import {setToken} from "@/utils/auth";

export default {
  data: () => ({
    valid: true,
    username: 'admin',
    password: "",
    passwordRepeat: ""
  }),
  methods: {
    createUser() {
      init(this.username, this.password).then(() => {
        auth(this.username, this.password).then((response) => {
          const jwt = response.jwt;
          setToken(jwt)
          this.$router.push('/init/endpoint')
        })
      })
    }
  },
  created() {
    check().then(() => {
      this.$router.push('/')
    }).catch(() => {

    })
  }
}

</script>