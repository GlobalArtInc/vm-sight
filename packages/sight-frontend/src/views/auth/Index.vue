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
import { Component, Vue } from 'vue-property-decorator';
import authService from '@/services/auth.service';
import { setToken } from '@/utils/auth';

@Component({
  data: () => ({
    loading: false,
    formValid: false,
    formModel: {
      username: null,
      password: null
    },
    formRule: {
      username: [(v) => !!v || 'Username not specified'],
      password: [(v) => !!v || 'Password not specified']
    }
  })
})
export default class AuthIndexView extends Vue {
  async login () {
    this.loading = true;
    try {
      const { jwt } = await authService.login(this.formModel.username, this.formModel.password);
      this.$toast('Login successful', {
        type: 'success',
        position: 'top-center'
      });
      setToken(jwt);
      return this.$router.push('/dashboard');
    } catch (err) {
      this.$toast.error('Login error', {
        position: 'top-center'
      });
      setTimeout(() => {
        this.loading = false;
      }, 500);
    }
  }
}
</script>
