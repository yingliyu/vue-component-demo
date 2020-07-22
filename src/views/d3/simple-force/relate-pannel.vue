<template>
  <div class="relate-subject-wrapper">
    <h3 class="comm-title">{{ title }}</h3>
    <ul>
      <li v-for="item in list" :key="item">{{ item }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'RelatePannel',

  props: {
    title: String,
    list: Array
  },
  data() {
    return {
      // list2: ['吴恩达', '周志华', '韩家炜', 'Geoffrey Hinton', 'Yoshua Bengio', 'Yann Lecun', 'Michael I. Jordan', '谭铁牛', '李飞飞', 'Sebastian Thrun']
    }
  },

  methods: {
    goSearch(key) {
      this.$router.push(`/search/${key}`)
    }
  }
}
</script>

<style lang="less" scoped>
.relate-subject-wrapper {
  .comm-title {
    padding: 15px 0;
    color: #fff;
    font-size: 20px;
    font-weight: 600;
  }
  ul {
    display: flex;
    flex-flow: column wrap;
    li {
      font-size: 12px;
      color: #fff;
      line-height: 25px;
      cursor: pointer;
    }
  }
}
</style>
