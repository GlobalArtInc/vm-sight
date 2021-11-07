<template>
  <v-container class="main-container">
    <v-row>
      <v-col>
        <v-card tile>
          <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
            <i class="fa fa-users"></i>
            <span class="font-weight-medium pl-1" style="color: #333">Authentication</span>
          </v-card-subtitle>
          <v-divider/>
          <v-card-text>
            <v-select v-model="settings.UserSessionTimeout"
                      label="Session lifetime"
                      :items="sessionLifetimes"
                      outlined/>

            <v-radio-group v-model="settings.AuthenticationMethod" row label="Authentication Method">
              <v-radio :ripple="false" :value="1" label="Internal"></v-radio>
              <v-radio :ripple="false" :value="2" label="LDAP"></v-radio>
              <v-radio :ripple="false" :value="3" label="OAuth"></v-radio>
            </v-radio-group>

            <MethodOauth v-if="settings.AuthenticationMethod === 3" :settings="settings" />
          </v-card-text>
          <v-divider/>
          <v-card-actions>
            <v-btn color="primary" tile @click="onUpdate" :loading="submitLoading">Save Changes</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {fetchSettings, updateSettings} from "../../api/settings";
import MethodOauth from "./MethodOauth";

export default {
  components: {MethodOauth},
  data: () => ({
    sessionLifetimes: [
      {value: '1h', text: '1 hour'},
      {value: '4h', text: '4 hours'},
      {value: '8h', text: '8 hours'},
      {value: '24h', text: '24 hours'},
      {value: '1w', text: '1 week'},
      {value: '1m', text: '1 month'},
      {value: '6m', text: '6 months'},
      {value: '1y', text: '1 year'}
    ],
    authenticationMethods: [
      {value: 1, text: 'Internal'},
      {value: 2, text: 'LDAP'},
      {value: 3, text: 'OAuth'}
    ],
    settings: {},
    submitLoading: false
  }),
  methods: {
    async onUpdate() {
      this.submitLoading = true
      try {
        await updateSettings(this.settings)
        this.$toast("Settings has been saved.", {
          type: 'success'
        });
      } catch (err) {
        this.$toast(err, {
          type: 'error'
        });
      } finally {
        setTimeout(() => {
          this.submitLoading = false
        }, 1000)
      }
    }
  },
  async created() {
    this.settings = await fetchSettings()
  }
}
</script>