<template>
  <v-app-bar color="primary" dark app>
    <v-app-bar-nav-icon @click="handleDrawerToggle"/>
    {{ getTitle }}
    <v-spacer/>
    <v-toolbar-items>
      <v-menu offset-y origin="center center" transition="scale-transition">
        <template v-slot:activator="{ on }">
          <v-btn icon large text slot="activator" v-on="on">
            <v-avatar size="30px">
              <img src="https://www.gravatar.com/avatar/asddw"/>
            </v-avatar>
          </v-btn>
        </template>
        <v-list class="pa-0">
          <v-list-item
              v-for="(item, index) in profileMenus"
              :to="!item.href ? { name: item.name } : null"
              :href="item.href"
              @click="item.click"
              :disabled="item.disabled"
              :target="item.target"
              rel="noopener"
              :key="index"
          >
            <v-list-item-action v-if="item.icon">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar-items>
    <v-toolbar tag="div" dense slot="extension" color="white" light>
      <v-icon>mdi-home</v-icon>
      <v-breadcrumbs :items="breadcrumbs" class="pa-3"/>
      <v-spacer></v-spacer>
      <!-- <v-btn icon small color="black">
         <v-icon v-text="'mdi-arrow-left'" @click="handleGoBack" />
       </v-btn> -->
    </v-toolbar>
  </v-app-bar>
</template>
<script>

import {mapGetters} from 'vuex'

export default {
  name: 'AppToolbar',
  data() {
    return {
      profileMenus: [
        {
          icon: 'mdi-power',
          href: '#',
          title: 'Logout',
          click: this.handleLogut
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['getAvatar', 'getUsername']),
    toolbarColor() {
      return this.$vuetify.options.extra.mainNav
    },
    getTitle() {
      return this.$route.meta.title ? this.$vuetify.lang.t('$vuetify.menu.' + this.$route.meta.title) : this.$route.path;
    },
    availableLanguages() {
      const {locales} = this.$vuetify.lang
      return Object.keys(locales).map((lang) => {
        return {
          text: locales[lang].label,
          value: lang
        }
      })
    },
    localeText() {
      const find = this.availableLanguages.find(
          (item) => item.value === this.$vuetify.lang.current
      )
      return find.text
    },
    breadcrumbs() {
      const {matched} = this.$route
      return matched.filter(route => !route.meta.hiddenInMenu).map((route, index) => {

        const text = this.$vuetify.lang.t('$vuetify.menu.' + route.meta.title) ? this.$vuetify.lang.t('$vuetify.menu.' + route.meta.title) : ""
        let to;
        if (route.meta.type === 'endpointDocker') {
          const url = this.$route.fullPath.split('/')
          to =
              index === matched.length - 1
                  ? this.$route.path.replace(':id', url[1]).replace(':hash', url[4])
                  : route.path.replace(':id', url[1]).replace(':hash', url[4]) || route.redirect
        } else {
          to =
              index === matched.length - 1
                  ? this.$route.path
                  : route.path || route.redirect
        }
        return {
          text: text,
          to: to,
          exact: true,
          disabled: false
        }
      })
    }
  },
  methods: {
    handleDrawerToggle() {
      this.$emit('side-icon-click')
    },
    handleFullScreen() {

    },
    handleLogut() {
      if (window.confirm('Are you sure to logout?')) {
        this.$store.dispatch('user/logout')
        window._VMA.$emit('SHOW_SNACKBAR', {
          text: 'Logout successfull',
          color: 'success'
        })
        this.$router.push('/auth')
      }
    },
    handleChangeLocale({value}) {
      this.$vuetify.lang.current = value
    },
    handleSetting() {
    },
    handleProfile() {
    },
    handleGoBack() {
      this.$router.go(-1)
    }
  },
  created() {
  }
}
</script>

<style lang="sass" scoped></style>
