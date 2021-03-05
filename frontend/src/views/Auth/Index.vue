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
        console.log(2)
      }).catch(() => {
        this.$router.push('/auth/init')
      })
    }
  }

</script>