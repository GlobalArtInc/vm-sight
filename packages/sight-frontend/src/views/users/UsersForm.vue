<template>
  <div class="page-user__item">
    <v-container class="main-container">
      <v-row>
        <v-col>
          <v-card tile>
            <v-card-title>{{ formTitle }}</v-card-title>
            <v-divider/>
            <v-card-text>
              <v-form ref="form" v-model="valid">
                <v-row>
                  <v-col :cols="12">
                    <v-text-field
                      outlined
                      label="Email"
                      :placeholder="form.email.placeholder"
                      v-model="formModel.email"
                      required
                      :append-icon="'mdi-account-check'"
                      :rules="form.email.rules"
                    />
                  </v-col>
                  <v-col :cols="12">
                    <v-text-field
                      outlined
                      label="O2"
                      :placeholder="form.oauth2.placeholder"
                      v-model="formModel.oauth2"
                      required
                      :append-icon="'mdi-account-check'"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col :cols="6">
                    <v-text-field
                      outlined
                      label="Password"
                      type="password"
                      :placeholder="form.password.placeholder"
                      autocomplete="false"
                      readonly onfocus="this.removeAttribute('readonly');"
                      v-model="formModel.password"
                      required
                      :append-icon="'mdi-lock'"
                    />
                  </v-col>
                  <v-col :cols="6">
                    <v-text-field
                      outlined
                      label="Repeat password"
                      type="password"
                      autocomplete="false"
                      readonly
                      onfocus="this.removeAttribute('readonly');"
                      :placeholder="form.password.placeholder"
                      value=""
                      v-model="formModel.repeatPassword"
                      :append-icon="'mdi-lock'"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col :cols="12" style="padding-top: 0;margin-top: 0">
                    <v-switch v-model="formModel.admin" :ripple="false" label="Administrator" />
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-divider class="mt-5"></v-divider>
            <v-card-actions>
              <v-spacer />
              <v-btn :loading="loading" tile color="primary" @click="handleSubmitForm">
                {{ this.userId ? "Update" : "Create" }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { Component, Prop, Vue } from 'vue-property-decorator';
import usersService from '@/services/users.service';

@Component({
  data: () => ({
    loading: false,
    valid: true,
    formModel: {
      email: '',
      password: '',
      repeatPassword: '',
      oauth2: '',
      admin: false
    },
    form: {
      email: {
        label: 'Email',
        placeholder: '',
        rules: [(v) => !!v || 'This field is required']
      },
      password: {
        placeholder: 'xxx',
        rules: [(v) => !!v || 'This field is required']
      },
      oauth2: {
        placeholder: 'OAuth2 Identity'
      }
    }
  }),
  computed: {
    formTitle () {
      return !this.userId ? 'Create a user' : 'Edit a user';
    }
  },
  created () {
    if (this.userId) {
      const user = this.$route.meta.user;
      this.formModel = { email: user.email, admin: user.role === 100 };
    }
  }
})
export default class UsersFormView extends Vue {
  @Prop(String) userId;

  async handleSubmitForm () {
    if (this.formModel.password !== this.formModel.repeatPassword) {
      return this.$toast.error("Passwords don't compare");
    }
    if (this.$refs.form.validate()) {
      this.loading = true;
      try {
        const role = this.formModel.admin ? 100 : 10;
        const userData = { email: this.formModel.email, password: this.formModel.password, role };
        if (this.userId) {
          await usersService.updateUser(this.userId, userData);
          this.$toast.success('User has been updated');
        } else {
          await usersService.createUser(userData);
          this.$toast.success('User has been created');
        }
        await this.$router.push('/users');
      } catch (err) {
        this.$toast.error(err.response.data.message);
      } finally {
        setTimeout(() => {
          this.loading = false;
        }, 500);
      }
    }
  }
}
</script>
