<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card tile>
          <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
            <i class="fa fa-cogs"></i>
            <span class="font-weight-medium pl-1" style="color: #333">Settings</span>
          </v-card-subtitle>
          <v-divider/>
          <v-card-text>
            <v-text-field v-model="settings.SnapshotInterval" label="Snapshot interval" outlined/>
            <v-switch
                v-model="settings.LogoURL"
                inset :ripple="false"
                label="Use custom logo"/>
            <v-switch
                v-model="settings.EnableTelemetry"
                inset :ripple="false"
                label="Allow the collection of anonymous statistics"/>
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

export default {
  data: () => ({
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
        this.$toast(err.message, {
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