<template>
  <div id="app">
    <div class="nav-wrapper">
      <div class="nav-inner">
        <div class="logo-wrapper">
          <!-- <img alt="Vue logo" src="@/assets/logo.png" /> -->
        </div>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="1" to="/">
            <router-link to="/">Home</router-link>
          </el-menu-item>

          <el-submenu index="2">
            <template slot="title">D3</template>
            <el-menu-item index="2-1" to="/simple-force" @click="toNavLink('/simple-force')">
              simple force
            </el-menu-item>
            <el-menu-item index="2-2" to="/new-force" @click="toNavLink('/new-force')">
              new force
            </el-menu-item>
            <el-menu-item index="2-3" to="/force" @click="toNavLink('/force')">
              知识图谱
            </el-menu-item>
          </el-submenu>
          <!-- <el-menu-item index="2">
        <router-link to="/d3">D3</router-link>
      </el-menu-item> -->
          <el-submenu index="3">
            <template slot="title">Others</template>
            <el-menu-item index="3-1">选项1</el-menu-item>
            <el-submenu index="3-4">
              <template slot="title">选项4</template>
              <el-menu-item index="3-4-1">选项1</el-menu-item>
              <el-menu-item index="3-4-2">选项2</el-menu-item>
              <el-menu-item index="3-4-3">选项3</el-menu-item>
            </el-submenu>
            <el-menu-item index="3-2">选项2</el-menu-item>
            <el-menu-item index="3-3">选项3</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </div>
    <div class="content-wrapper">
      <router-view />
    </div>
  </div>
</template>
<script>
// import NavBar from '@/layouts/sidebar'
export default {
  name: 'App',
  // components: { NavBar },
  data() {
    return {
      activeIndex: '1',
      activeIndex2: '1'
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    },
    toNavLink(path) {
      this.$router.push(path)
    }
  }
}
</script>
<style lang="less">
.nav-wrapper {
  width: 100%;
  border-bottom: solid 1px #e6e6e6;
  .nav-inner {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    .logo-wrapper {
      padding: 10px;
      box-sizing: border-box;
      margin-right: 20px;
      img {
        height: 40px;
      }
    }
  }
}
.content-wrapper {
  width: 1200px;
  margin: 0 auto;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}

#nav {
  padding: 30px;
  /deep/.el-menu-item {
    -moz-user-select: none; /*火狐*/
    -webkit-user-select: none; /*webkit浏览器*/
    -ms-user-select: none; /*IE10*/
    -khtml-user-select: none; /*早期浏览器*/
    user-select: none;
  }
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
