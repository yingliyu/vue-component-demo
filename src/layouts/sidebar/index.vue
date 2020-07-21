<template>
  <!-- element-ui 隐藏控件 -->
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <div class="logo-wrapper">
      <router-link to="/home/dashboard">
        <!-- <img :src="logo" alt :style="{ width: isCollapse ? '36px' : '72px' }" /> -->
      </router-link>
    </div>
    <el-menu
      :show-timeout="100"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#3a3c40"
      text-color="#999"
      active-text-color="#fff"
    >
      <sidebar-item
        v-for="route in router"
        :key="route.name"
        :item="route"
        :id="route.name"
        :base-path="route.path"
      />
    </el-menu>
  </el-scrollbar>
</template>

<script>
// import { mapGetters } from 'vuex'
import SidebarItem from './sidebar-item'
// import logo from './img/logo.png'
import router from '@/routers'
export default {
  name: 'Sidebar',

  data() {
    return {
      router: router
      // logo: logo
    }
  },

  components: {
    SidebarItem
  },

  computed: {
    // ...mapGetters(['sidebar', 'permissionRouters']),

    isCollapse() {
      return false
    }
  }
}
</script>

<style lang="less" scoped>
.logo-wrapper {
  padding: 10px 0;
  text-align: center;
  background: #3a3c40;
}
</style>
