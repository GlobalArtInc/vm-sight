<template>
  <v-app>
    <v-navigation-drawer app style="background: #30426a">
      <v-list-item dark>
        <v-list-item-content>
          <v-list-item-title class="title">
            VM-SIGHT
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list nav>
        <v-list-item dark link to="/home">
          <v-list-item-icon>
            <v-icon>fa-home</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="primary">
      <!-- -->
      <v-spacer />
      <v-menu
          bottom
          min-width="200px"
          rounded
          offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn
              icon
              x-large
              v-on="on"
              style="margin-left: 0.5em"
          >
            <v-avatar>
              <v-avatar
                  color="primary"
                  size="56">
                {{ user.username.substring(0, 1).toUpperCase() }}
              </v-avatar>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list-item-content class="justify-center">
            <div class="mx-auto text-center">
              <v-avatar>
                <v-avatar
                    color="primary"
                    size="56">
                  {{ user.username.substring(0, 1).toUpperCase() }}
                </v-avatar>
              </v-avatar>
              <h3>{{ user.username }}</h3>
              <p class="caption mt-1">
                {{ user.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn
                  depressed
                  rounded
                  text
              >
                Выйти
              </v-btn>
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>

      <!-- Provides the application the proper gutter -->
      <v-container fluid>

        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  computed: {
    ...mapGetters(['user'])
  }
}
</script>