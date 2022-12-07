<template>
  <v-container class="page-blank" fill-height>
    <v-row>
      <v-col>
        <v-card class="pa-3 page-blank__card" tile>
          <v-card-title>
            <h1 class="primary--text display-1 page-blank_title">
              VM-SIGHT - Create User
            </h1>
          </v-card-title>
          <v-card-text>
            <v-form
              ref="form"
              class="my-10"
              lazy-validation>
              <v-text-field
                append-icon="mdi-account"
                autocomplete="off"
                name="login"
                type="text"
                label="Username"
                placeholder="Username"
                required
                outlined
                v-model="username"
              />

              <v-text-field
                append-icon="mdi-lock"
                autocomplete="off"
                name="password"
                type="password"
                label="Password"
                placeholder="Password"

                required
                outlined
                v-model="password"
              />
              <v-text-field
                append-icon="mdi-lock"
                autocomplete="off"
                name="repeatPassword"
                type="password"
                label="Repeat Password"
                placeholder="Repeat Password"
                required
                outlined
                v-model="passwordRepeat"
              />
              <v-icon :style="{color: password.length >= 8 ? 'green':'red'}">fa-check</v-icon>
              The password must be at least 8 characters long
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn large tile
                   :disabled="password !== passwordRepeat || password.length < 8"
                   color="primary" @click="createUser" :loading="loading">
              Create User
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { setToken } from '@/utils/auth';
import authService from '@/services/auth.service';

@Component
export default class InitAdminView extends Vue {
  valid = false;
  loading = false;
  username = 'admin';
  password = '';
  passwordRepeat = ''

  async createUser () {
    try {
      await authService.initAdmin(this.username, this.password);
      authService.login(this.username, this.password).then(() => {
        return this.$router.push('/init/endpoint');
      });
    } catch (err) {
      //
    }
  }
}
</script>

<style lang="sass" scoped>
.page-blank__card
  max-width: 600px
  margin: 0 auto
</style>
