<template>
  <el-select
    v-model="selected"
    v-bind="$attrs"
    v-on="$listeners"
    @change="changeHandler"
  >
    <el-option
      v-for="item in dicData"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    dicData: Array,
    value: String,
    disabled: Boolean
  },

  data() {
    return {
      selected: this.value
    }
  },

  methods: {
    changeHandler(event) {
      if (this.disabled) return
      this.selected = event
      this.$emit('input', this.selected)
      this.$emit('change', this.selected)
    }
  }
}
</script>

<style lang="scss" scoped></style>
