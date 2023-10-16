<template>
  <el-upload
    v-bind="$attrs"
    v-on="$listeners"
    action="#"
    :auto-upload="false"
    :accept="accept"
    :show-file-list="false"
    :on-change="onChange"
  >
    <el-button type="primary">{{ btnText }}</el-button>
  </el-upload>
</template>

<script>
export default {
  props: {
    accept: {
      type: String,
      default: 'image/jpeg,image/png,image/jpg'
    },

    btnText: {
      type: String,
      default: '上传图片'
    }
  },

  methods: {
    async onChange(file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        this.$emit('changeHandler', event.target.result)
      }
      reader.readAsDataURL(file.raw)
    }
  }
}
</script>

<style lang="scss" scoped></style>
