<template>
  <div id="app">
    <el-container>
      <el-header><Header /></el-header>
      <router-view></router-view>
      <el-footer>
        <Footer />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import Footer from "./components/Footer";
import Header from "./components/Header";

export default {
  name: "App",
  components: {
    Footer,
    Header,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  display: flex;
}
body {
  margin: 0;
}
.el-header {
  padding: 0;
  padding-bottom: 15px;
}
.el-footer {
  background-color: #f2f6fc;
}
</style>
