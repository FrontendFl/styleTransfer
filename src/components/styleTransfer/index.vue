<template>
  <div class="style-transfer-warpper flex-column">
    <singleStyle
      :transformeNet="transformeNet"
      :inceptionStyleNet="inceptionStyleNet"
    />
  </div>
</template>

<script>
import * as tf from '@tensorflow/tfjs'
import singleStyle from './module/singeStyle'

export default {
  components: {
    singleStyle
  },

  mounted() {
    this.initTfModel()
  },

  data() {
    return {
      inceptionStyleNet: {},
      transformeNet: {}
    }
  },

  methods: {
    async initTfModel() {
      ;[this.inceptionStyleNet, this.transformeNet] = await Promise.all([
        tf.loadGraphModel('inception/model.json'),
        tf.loadGraphModel('transformer/model.json')
      ])
    }
  }
}
</script>

<style lang="scss" scoped>
.style-transfer-warpper {
  box-sizing: border-box;
  padding: 20px;
  height: 100vh;
  overflow-y: auto;
}
</style>
