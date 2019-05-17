<template>
  <div class="test2-page">
    <vi-header :title="pageTitle"></vi-header>
    <main class="smi-content">

    </main>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "test2",
  components: {},
  data() {
    return {
      pageTitle: "test2-page"
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
<style lang="scss" src="./test2.scss" scoped></style>