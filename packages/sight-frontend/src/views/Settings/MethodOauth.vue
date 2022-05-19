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
        <v-text-field dense v-model="settings.OAuthSettings.ClientID" label="Client ID" outlined />
        <v-text-field dense v-model="settings.OAuthSettings.ClientSecret" label="Client Secret" outlined />
        <v-text-field dense v-model="settings.OAuthSettings.AuthorizationURI" label="Authorization URL" outlined />
        <v-text-field dense v-model="settings.OAuthSettings.AccessTokenURI" label="Access token URL" outlined />
        <v-text-field dense v-model="settings.OAuthSettings.ResourceURI" label="Resource URL" outlined />
        <v-text-field dense v-model="settings.OAuthSettings.RedirectURI" label="Redirect URL" outlined />
        <v-text-field dense v-model="settings.OAuthSettings.LogoutURI" label="Logout URL" outlined />
        <v-text-field dense v-model="settings.OAuthSettings.UserIdentifier" label="User identifier" outlined />
        <v-text-field dense v-model="settings.OAuthSettings.Scopes" label="Scopes" outlined />
      </v-form>
    </template>
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