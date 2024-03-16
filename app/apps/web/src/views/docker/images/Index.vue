<template>
  <v-row>
    <v-col :cols="12">
      <v-card>
        <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
          <i class="fa fa-download"></i>
          <span class="font-weight-medium pl-3" style="color: #333">Pull Image</span>
        </v-card-subtitle>
        <v-divider/>
        <v-card-text>
          VM-SIGHT is connected to a node that is part of a Swarm cluster. Some resources located on other nodes in the
          cluster might not be available for management.
        </v-card-text>
      </v-card>
    </v-col>
    <v-col :cols="12" v-if="images">
      <v-card>
        <v-card-subtitle class="font-weight-medium" style="color: #333;background: #f6f6f6">
          <i class="fa fa-clone"></i>
          <span class="font-weight-medium pl-3" style="color: #333">
            Images
          </span>
        </v-card-subtitle>
        <v-divider/>
        <v-card-subtitle>
          dev
        </v-card-subtitle>
        <v-divider/>
        <v-card-text style="padding: 0">
          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="images"
            :items-per-page="-1"
            class="elevation-1"
            item-key="Id"
            show-select>
            <template #item.Id="{item}">
              <router-link :to="`images/`+item.Id">
                {{ item.Id.substring(0, 49) }}...
              </router-link>
            </template>
            <template #item.RepoTags="{item}">
              <v-chip class="font-weight-bold" color="primary" v-if="item.RepoTags === null">
                {{ item.RepoDigests.join('').split('@')[0] }}
              </v-chip>
              <v-chip class="font-weight-bold" color="primary" v-else :key="tag" v-for="tag in item.RepoTags"
                      v-text="tag" rounded/>
            </template>
            <template #item.Size="{item}">
              {{ byteToSize(item.Size) }}
            </template>
            <template #item.Created="{item}">
              {{ item.Created | moment("YYYY-MM-DD HH:mm:ss") }}
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Dockerode from 'dockerode';
import { formatBytes } from '@/utils/math';

@Component
export default class DockerImagesView extends Vue {
  images: Dockerode.ImageInspectInfo[] = [];
  selected: Dockerode.ImageInspectInfo[] = [];
  headers = [
    {
      text: 'Id',
      align: 'left',
      value: 'Id'
    },
    {
      text: 'Tags',
      value: 'RepoTags',
      align: 'left'
    },
    {
      text: 'Size',
      value: 'Size',
      align: 'left'
    },
    {
      text: 'Created',
      value: 'Created',
      align: 'left'
    }
  ]

  created () {
    this.images = this.$route.meta?.images;
  }

  byteToSize (bytes: number) {
    return formatBytes(bytes);
  }
}
</script>
