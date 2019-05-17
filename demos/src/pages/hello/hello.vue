<template>
  <div class="hello-page">
    <vi-header :title="pageTitle"></vi-header>
    <main class="smi-content">

    </main>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "hello",
  components: {},
  data() {
    return {
      pageTitle: "hello-page"
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
<style lang="scss" src="./hello.scss" scoped></style>