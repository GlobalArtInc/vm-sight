<template>
  <v-row>
    <v-col :cols="12">
      <v-card>
        <v-progress-linear indeterminate color="primary" v-if="!isLoading" absolute top/>
        <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
          <i class="fa fa-tags"></i>
          <span class="font-weight-medium pl-1" style="color: #333">Image Tags</span>
        </v-card-subtitle>
        <v-divider/>
        <v-card-text>
          <v-col :key="tag" :cols="6" v-for="tag in image.RepoTags">
            <v-text-field
                disabled
                :label="tag"
                outlined
                clearable
                type="text"
            >
            </v-text-field>
          </v-col>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col :cols="12">
      <v-card>
        <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
          <i class="fa fa-copy"></i>
          <span class="font-weight-medium pl-1" style="color: #333">Image Details</span>
        </v-card-subtitle>
        <v-divider/>
        <v-card-text>
          {{ image }}
        </v-card-text>
      </v-card>
    </v-col>
    <v-col :cols="12">
      <v-card>
        <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
          <i class="fa fa-copy"></i>
          <span class="font-weight-medium pl-1" style="color: #333">Image Layers</span>
        </v-card-subtitle>
        <v-divider/>
        <v-card-text>
          <v-simple-table dense>
            <thead>
            <tr>
              <th>Order</th>
              <th>Size</th>
              <th>Layer</th>
            </tr>
            </thead>
            <tbody>
            <tr :key="key" v-for="(layer, key) in imageHistory">
              <td style="width: 5%;">{{ key+1 }}</td>
              <td style="width: 10%" class="font-weight-bold">{{ format(layer.Size) }}</td>
              <td style="width: 85%">{{ layer.CreatedBy }}</td>
            </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import {getImageById, getImageHistory} from "../../../api/endpoints/images";
import {formatBytes} from "../../../utils/math";

export default {
  props: {
    id: {type: String},
    imageId: {type: String}
  },
  data: () => ({
    isLoading: false,
    image: {},
    imageHistory: []
  }),
  methods: {
    format(size) {
      return formatBytes(size)
    }
  },
  async created() {
    try {
      this.image = await getImageById(this.id, this.imageId)
      this.imageHistory = await getImageHistory(this.id, this.imageId)
      this.isLoading = true
    } catch (err) {
      this.isLoading = false
    }
  }
}
</script>