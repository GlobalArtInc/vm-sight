<template>
  <div>
    asd
  </div>
</template>

<script>
  import {check} from '@/api/users/admin'

  export default {
    created() {
      check().then(() => {

      }).catch(() => {
        this.$router.push('/init/admin')
      })
    }
  }

</script>