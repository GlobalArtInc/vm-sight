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
        Single Sign-On
        <v-divider/>
      </div>
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