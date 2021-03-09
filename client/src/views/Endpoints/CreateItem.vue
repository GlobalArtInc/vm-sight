<template>
  <div class="page-endpoint__item">
    <v-container class="main-container">
      <v-row>
        <v-col>
          <v-card :loading="loading" tile>
            <v-card-title>{{ formTitle }}</v-card-title>
            <v-divider/>
            <v-card-text>
              <v-form ref="form" v-model="valid">
                <v-row>
                  <v-col :cols="12">
                    <v-text-field
                        outlined
                        :label="__('name')"
                        :placeholder="form.name.placeholder"
                        v-model="formModel.name"
                        required
                        :append-icon="'mdi-name'"
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  props: {
    id: [String]
  },
  data: () => ({
    valid: false,
    loading: false,
    formModel: {
      name: ""
    },
    form: {
      name: {
        placeholder: ""
      }
    }
  }),
  computed: {
    formTitle() {
      return this.__('endpointsCreate')
    }
  }
}
</script>