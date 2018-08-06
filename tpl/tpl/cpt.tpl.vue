<template>
  <div>

  </div>
</template>
<script>
export default {
  props: {
    status: {
      type: String,
      required: true,
      default: "success",
      validator: value => ["success", "syncing", "error"].indexOf(value) !== -1
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
</style>