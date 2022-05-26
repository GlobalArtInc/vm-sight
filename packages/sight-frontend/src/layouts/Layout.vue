<template>
  <v-app class="app">
    <app-drawer class="app--drawer" ref="drawer" />
    <app-toolbar class="app--toolbar" @sidebar="drawer = true" @side-icon-click="handleDrawerVisiable" />
    <v-navigation-drawer
      class="setting-drawer"
      temporary
      right
      v-model="drawer"
      fixed
    >
      <template v-slot:prepend>
        <v-list-item two-line>

          <v-list-item-avatar>
            <img src="https://www.gravatar.com/avatar/asddw">
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ user.username }}</v-list-item-title>
            <v-list-item-subtitle>Logged In</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-divider></v-divider>
      <v-list>
        <v-list-group
          :key="language.title"
          v-model="language.active"
          :prepend-icon="language.action"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-avatar>
              <v-img :src="`/flags/${user.locale}.png`"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="language.title"></v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            v-for="item in language.items"
            :key="item.key"
            @disabled="user.locale !== item.key"
            @click="changeLanguage(item.key)"
          >
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
      <v-list class="pa-0">
        <v-list-item
          v-for="(item, index) in profileMenus"
          :to="!item.href ? { name: item.name } : null"
          :href="item.href"
          @click="item.click"
          :disabled="item.disabled"
          :target="item.target"
          rel="noopener"
          :key="index">
          <v-list-item-action v-if="item.icon">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main style="background: #f3f3f3">
      <!-- Page Wrapper -->
      <div class="page-wrapper"><router-view /></div>
      <!-- App Footer -->
    </v-main>
    <!-- Go to top -->
    <app-fab />
  </v-app>
</template>

<script>
import AppDrawer from '@/components/AppDrawer'
import AppToolbar from '@/components/AppToolbar'
import AppFab from '@/components/AppFab'
import { mapGetters } from "vuex";
import { changeLanguage } from "@/api/api";

export default {
  name: 'LayoutDefault',
  components: {
    AppDrawer,
    AppToolbar,
    AppFab
  },

  data() {
    return {
      drawer: false,
      showDrawer: true,
      language: {
        title: this.__("labels.language"),
        active: false,
        items: [
          {key: "en", title: "English"},
          {key: "ru", title: "Русский"},
          {key: "uk", title: "Украинский"},
        ]
      },
      profileMenus: [
        {
          icon: "mdi-power",
          href: "#",
          title: this.__("logout"),
          click: this.handleLogout
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    async changeLanguage(language) {
      try {
        await changeLanguage(language);
        await this.$store.dispatch('user/getInfo');
        this.$vuetify.lang.current = language;
      } catch (err) {
        //
      } finally {
        this.language.active = false;
        this.drawer = false;
      }
    },
    handleLogout() {
      if (window.confirm("Are you sure to logout?")) {
        this.$store.dispatch("user/logout");
        window._VMA.$emit("SHOW_SNACKBAR", {
          text: "Logout successful",
          color: "success"
        });
        this.$router.push("/auth");
      }
    },
    handleDrawerVisiable() {
      this.$refs.drawer.toggleDrawer()
    }
  }
}
</script>

<style lang="sass" scoped>
.page-wrapper
  min-height: calc(100vh - 112px - 48px)
</style>
