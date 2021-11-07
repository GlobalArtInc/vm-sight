<template>
  <div>
    <template>
      <div class="font-weight-bold">
        Single Sign-On
        <v-divider/>
      </div>
      <v-switch label="Use SSO" inset :ripple="false" v-model="settings.OAuthSettings.SSO"/>
    </template>

    <template>
      <div class="font-weight-bold">
        OAuth Configuration
        <v-divider />
      </div>
      <v-form style="margin-top: 2em">
        <v-text-field label="Client ID" v-model="settings.OAuthSettings.ClientID" outlined />
        <v-text-field label="Client Secret" outlined />
      </v-form>
    </template>
    {{ settings }}
  </div>
</template>

<script>
export default {
  props: {
    settings: {type: Object}
  },
  data: () => ({
    o2: ""
  })
}
</script>