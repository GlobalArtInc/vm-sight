<template>
  <div class="page-endpoint__item">
    <v-container class="main-container">
      <v-row>
        <v-col>
          <v-card tile>
            <v-progress-linear indeterminate color="primary" v-if="!isLoading" absolute top/>
            <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
              <i class="fa fa-database"></i>
              <span class="font-weight-medium pl-1" style="color: #333">DockerHub</span>
            </v-card-subtitle>
            <v-divider/>
            <v-card-text>
              <v-form ref="form" v-model="valid">
                <v-switch v-model="formModel.Authentication" label="Authentication" :ripple="false"/>
                <template v-if="formModel.Authentication">
                  <v-text-field dense v-model="formModel.Username" outlined label="Username"/>
                  <v-text-field dense v-model="formModel.Password" outlined label="Password" type="password"/>
                </template>
              </v-form>
            </v-card-text>
            <v-card-actions v-if="isLoading">
              <v-btn :disabled="!formModel.Username||!formModel.Password" v-if="formModel.Authentication" @click="onSubmit" color="primary">
                Update
              </v-btn>
              <v-btn v-else @click="onSubmit" color="primary">
                Update
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import {dockerHub, dockerHubUpdate} from "@/api/api";

export default {
  data: () => ({
    isLoading: false,
    valid: false,
    formModel: {
      Authentication: false,
      Username: "",
      Password: ""
    },
    form: {
      username: {
        rules: [(v) => !!v || "Username not specified"]
      },
      password: {
        rules: [(v) => !!v || "Username not specified"]
      }
    }
  }),
  methods: {
    onSubmit() {
      dockerHubUpdate({
        Authentication: this.formModel.Authentication === true ? 1:0,
        Username: this.formModel.Username,
        Password: this.formModel.Password,
      }).then(() => {
        this.$toast(this.__('dockerhub_assigned'), {
          type: 'success'
        });
      }).catch(() => {
        this.$toast(this.__('incorrect_credentials'), {
          type: 'error'
        });
      })
    }
  },
  created() {
    dockerHub().then((data) => {
      this.isLoading = true
      this.formModel.Authentication = data.Authentication
      this.formModel.Username = data.Username
    }).catch(() => {
      this.isLoading = true
    })
  }
}
</script>
