module.exports = {
  // outputDir: process.env.NODE_ENV === 'qa' ? 'qa-dist' : 'dist',
  // outputDir: process.env.NODE_ENV === 'qa' ? 'qadist' : 'dist',
  lintOnSave: process.env.NODE_ENV !== 'production', // 非生产环境开启lintOnSave

  devServer: {
    // dev-server中，lint不通过报错
    overlay: {
      warnings: true,
      errors: true
    }
  }
}
