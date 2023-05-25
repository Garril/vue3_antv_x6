<template>
  <el-form :model="form" label-width="120px">
    <template v-for="index in inputNum" :key="index">
      <el-form-item :label="'input' + index">
        <el-input
          :placeholder="'input ' + index"
          v-model="form['input' + index]"
        ></el-input>
      </el-form-item>
    </template>
    <template v-for="index in outputNum" :key="index">
      <el-form-item :label="'output' + index">
        <el-input
          :placeholder="'output ' + index"
          v-model="form['output' + index]"
        ></el-input>
      </el-form-item>
    </template>
    <el-form-item label="name">
      <el-input
        placeholder="请输入事件流/switch的名字"
        v-model="form.name"
      ></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button @click="onCancel">Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  onMounted,
  ref,
  Ref,
  reactive,
  toRefs
} from 'vue'
export default defineComponent({
  components: {},
  props: {
    inputNum: {
      type: Number,
      default: 0
    },
    outputNum: {
      type: Number,
      default: 0
    }
  },
  setup(props, { emit }) {
    const { inputNum, outputNum } = toRefs(props)
    const obj = {} as any
    for (let i = 0; i < inputNum.value; i++) {
      obj['input' + i] = ''
    }
    for (let i = 0; i < outputNum.value; i++) {
      obj['output' + i] = ''
    }
    obj.name = ''
    const form = reactive(obj)
    const onSubmit = () => {
      emit('onSubmit', {
        data: form,
        inputNum: inputNum.value,
        outputNum: outputNum.value
      })
    }
    const onCancel = () => {
      emit('onCancel')
    }
    return { onSubmit, form, onCancel }
  }
})
</script>
