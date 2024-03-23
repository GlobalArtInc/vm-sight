<script setup lang="ts">
definePageMeta({
  layout: 'blank',
})
</script>

<template>
  <v-container class="page-login">
    <v-row>
      <v-col>
        <v-card class="pa-3 page-login__card" tile>
          <v-card-title>
            <h1 class="text-primary display-1 page-login_title">
              VM-SIGHT
            </h1>
          </v-card-title>
          <v-card-text>
            <v-form
              ref="form"
              class="my-10"
              lazy-validation
            >
              <v-text-field
                append-icon="mdi-email"
                autocomplete="off"
                name="login"
                type="text"
                label="Username"
                required
                outlined
              />
              <v-text-field
                append-icon="mdi-lock"
                autocomplete="off"
                name="password"
                type="password"
                label="Password"
                required
                outlined
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn large variant="tonal" color="primary">
              Login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.page-login__card {
  align-items: center;
  justify-content: center;
}
</style>