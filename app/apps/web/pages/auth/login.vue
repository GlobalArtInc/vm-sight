<script setup lang="ts">
import { useToast } from 'vue-toastification';
import { useAuthStore } from '~/stores/auth';
import type { User } from '~/types/user.types';

definePageMeta({
  layout: 'blank',
});
const { setUser } = useAuthStore();
const router = useRouter();
const toast = useToast();

const username = defineModel<string>('username', { required: true });
const password = defineModel<string>('password', { required: true });
const buttonLoading = useState();

async function handleLogin() {
  buttonLoading.value = true;
  try {
    await $fetch('/api/public/auth/login', {
      method: 'POST',
      body: {
        username: username.value || '',
        password: password.value || '',
      },
    });

    const userInfo = await $fetch<User>('/api/protected/user/info');
    setUser(userInfo);
    toast.success('Successfully logged in', {
      timeout: 2000,
    });
    setTimeout(() => {
      router.push('/');
    }, 500);
  } catch (err) {
    toast.error(err.data?.error || '', {
      timeout: 2000,
    });
    setTimeout(() => {
      buttonLoading.value = false;
    }, 500);
  }
}
</script>

<template>
  <v-container class="page-login">
    <v-row>
      <v-col>
        <v-card class="pa-3 page-login__card" tile>
          <v-card-title>
            <h1 class="text-primary display-1 page-login_title">VM-SIGHT</h1>
          </v-card-title>
          <v-form class="my-10" lazy-validation @submit.prevent>
            <v-card-text>
              <v-text-field
                v-model="username"
                append-icon="mdi-email"
                autocomplete="off"
                name="login"
                type="text"
                label="Username"
                required
                outlined
              />
              <v-text-field
                v-model="password"
                append-icon="mdi-lock"
                autocomplete="off"
                name="password"
                type="password"
                label="Password"
                required
                outlined
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn large type="submit" color="primary" :loading="buttonLoading" @click="handleLogin"> Login </v-btn>
            </v-card-actions>
          </v-form>
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
