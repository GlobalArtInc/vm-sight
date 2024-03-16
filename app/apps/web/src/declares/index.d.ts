import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    t(locale: string): string;
  }
}
