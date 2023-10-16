<template>
  <div class="single-warpper">
    <el-button class="mb10" type="primary" @click="transferHandler">
      风格迁移
    </el-button>
    <h3 class="mb10 success">输入：</h3>
    <el-row :span="24" :gutter="10">
      <el-col :md="24" :lg="12">
        <img
          class="image"
          ref="contentImage"
          :src="ctxImgSrc"
          :style="`height: ${ctxImgHeight}px`"
        />
        <div class="flex-middle mt10">
          待转换图片：
          <baseSelect
            v-model="ctxImgSrc"
            placeholder="请选择待转换的图片"
            :dicData="ctxImgList"
          />
          <baseUpload
            class="ml15"
            @changeHandler="changeHandler($event, 'ctxImgSrc')"
          />
        </div>

        <div class="flex-middle">
          图片高度：
          <el-slider
            class="ml10"
            v-model="ctxImgHeight"
            :min="256"
            :max="400"
            :step="1"
          >
          </el-slider>
        </div>
      </el-col>
      <el-col :md="24" :lg="12">
        <img
          class="image"
          ref="styleImage"
          :src="styleImgSrc"
          :style="`height: ${styleImgHeight}px`"
        />
        <div class="flex-middle">
          风格图片：
          <baseSelect
            class="mt10"
            v-model="styleImgSrc"
            placeholder="请选择风格图片："
            :dicData="styleImgList"
          />
          <baseUpload
            class="ml15"
            @changeHandler="changeHandler($event, 'styleImgSrc')"
          />
        </div>
        <div class="flex-middle">
          图片高度：
          <el-slider
            class="ml10"
            v-model="styleImgHeight"
            :min="256"
            :max="400"
            :step="1"
          >
          </el-slider>
        </div>
        <div class="flex-middle">
          风格比率：
          <el-slider
            class="ml10"
            v-model="styleRatio"
            :min="0.1"
            :max="1"
            :step="0.01"
          >
          </el-slider>
        </div>
        <el-checkbox class="mt10" v-model="square">方形输入</el-checkbox>
      </el-col>
    </el-row>

    <h3 class="mb10 mt10 success">输出：</h3>

    <canvas class="mt10" ref="canvas" width="256" height="256"></canvas>
  </div>
</template>

<script>
import baseUpload from '../baseUpload'
import baseSelect from '../baseSelect'
import * as tf from '@tensorflow/tfjs'
import { ctxImgList, styleImgList } from './const'

export default {
  components: { baseSelect, baseUpload },
  props: {
    inceptionStyleNet: Object,
    transformeNet: Object
  },

  data() {
    return {
      visible: false,
      square: false,
      ctxImgList,
      styleImgList,
      styleRatio: 1,
      ctxImgHeight: 256,
      styleImgHeight: 256,
      ctxImgSrc: require('../../contentImages/beauty.jpg'),
      styleImgSrc: require('../../styleImages/seaport.jpg')
    }
  },

  computed: {
    contentImg({ $refs: { contentImage } }) {
      return contentImage
    },

    styleImg({ $refs: { styleImage } }) {
      return styleImage
    }
  },

  watch: {
    square(val) {
      this.styleImg.style.width = val ? `${this.styleImgHeight}px` : 'auto'
    }
  },

  methods: {
    async onTransfer() {
      let bottleneck = await tf.tidy(() => {
        return this.inceptionStyleNet.predict(
          tf.browser
            .fromPixels(this.styleImg)
            .toFloat()
            .div(tf.scalar(255))
            .expandDims()
        )
      })
      await tf.nextFrame()
      if (this.styleRatio !== 1.0) {
        const identityBottleneck = await tf.tidy(() => {
          return this.inceptionStyleNet.predict(
            tf.browser
              .fromPixels(this.contentImg)
              .toFloat()
              .div(tf.scalar(255))
              .expandDims()
          )
        })
        const styleBottleneck = bottleneck
        bottleneck = await tf.tidy(() => {
          const styleBottleneckScaled = styleBottleneck.mul(
            tf.scalar(this.styleRatio)
          )
          const identityBottleneckScaled = identityBottleneck.mul(
            tf.scalar(1.0 - this.styleRatio)
          )
          return styleBottleneckScaled.addStrict(identityBottleneckScaled)
        })
        styleBottleneck.dispose()
        identityBottleneck.dispose()
      }
      await tf.nextFrame()
      const stylized = await tf.tidy(() => {
        return this.transformeNet
          .predict([
            tf.browser
              .fromPixels(this.contentImg)
              .toFloat()
              .div(tf.scalar(255))
              .expandDims(),
            bottleneck
          ])
          .squeeze()
      })
      await tf.browser.toPixels(stylized, this.$refs.canvas)
      bottleneck.dispose()
      stylized.dispose()
    },

    async transferHandler() {
      const p = new Promise((resolve) => {
        setTimeout(async () => {
          const res = await this.onTransfer()
          resolve(res)
        }, 2000)
      })

      await awaitLoading(p)
    },

    changeHandler($event, value) {
      this[value] = $event
    }
  }
}
</script>

<style lang="scss" scoped>
.single-warpper {
  .el-select {
    width: 180px;
  }
  ::v-deep {
    .el-slider__runway {
      width: 300px;
    }
  }
}
</style>
