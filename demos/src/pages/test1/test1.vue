<template>
  <div class="${createName}-page">
    <vi-header :title="pageTitle"></vi-header>
    <main class="smi-content">

    </main>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "${createName}",
  components: {},
  data() {
    return {
      pageTitle: "${createName}-page"
    };
  },
  computed: {
    ...mapGetters({})
  },
  mounted() {
    this.pageTitle = this.$route.meta.title;
  },
  methods: {}
};
</script>
<style lang="scss" src="./${createName}.scss" scoped></style>