<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useToast } from 'vue-toastification';

const { logout } = useAuthStore();
const toast = useToast();
const router = useRouter();

const handleLogout = async () => {
  try {
    await $fetch('/api/public/auth/logout');
    logout();
    toast.success('Logged out successfully');
    router.push('/auth/login');
  } catch (error) {
    toast.error('An error occurred while logging out');
  }
};
</script>

<template>
  <v-app-bar color="primary" dark app>
    <v-app-bar-nav-icon />
    <v-spacer />
    <v-toolbar-items>
      <v-menu>
        <template #activator="{ props }">
          <v-btn icon large text v-bind="props">
            <v-avatar>
              <v-img src="https://www.gravatar.com/avatar/asddw" />
            </v-avatar>
          </v-btn>
        </template>
        <v-list class="pa-0">
          <v-list-item @click="handleLogout">
            <template #prepend>
              <v-icon>mdi-power</v-icon>
            </template>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar-items>
  </v-app-bar>
</template>
