<script setup>
import { ref, onMounted } from 'vue'

const captchaText = ref('')
const canvas = ref(null)

const generateCaptcha = () => {
  const ctx = canvas.value.getContext('2d')
  const width = canvas.value.width
  const height = canvas.value.height
  
  // 清空画布
  ctx.clearRect(0, 0, width, height)
  
  // 生成随机验证码
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  captchaText.value = code
  
  // 绘制背景
  ctx.fillStyle = '#1e1f35'
  ctx.fillRect(0, 0, width, height)
  
  // 绘制文字
  ctx.font = 'bold 24px Arial'
  for (let i = 0; i < code.length; i++) {
    ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 70%)`
    ctx.translate(30 * i + 15, 30)
    ctx.rotate((Math.random() - 0.5) * 0.4)
    ctx.fillText(code[i], 0, 0)
    ctx.setTransform(1, 0, 0, 1, 0, 0)
  }
  
  // 添加干扰线
  for (let i = 0; i < 3; i++) {
    ctx.strokeStyle = `hsla(${Math.random() * 360}, 70%, 70%, 0.5)`
    ctx.beginPath()
    ctx.moveTo(Math.random() * width, Math.random() * height)
    ctx.lineTo(Math.random() * width, Math.random() * height)
    ctx.stroke()
  }
  
  // 添加干扰点
  for (let i = 0; i < 50; i++) {
    ctx.fillStyle = `hsla(${Math.random() * 360}, 70%, 70%, 0.5)`
    ctx.beginPath()
    ctx.arc(Math.random() * width, Math.random() * height, 1, 0, 2 * Math.PI)
    ctx.fill()
  }
}

defineExpose({
  captchaText,
  generateCaptcha
})

onMounted(() => {
  generateCaptcha()
})
</script>

<template>
  <div class="captcha-container">
    <canvas 
      ref="canvas" 
      width="120" 
      height="40" 
      @click="generateCaptcha"
      title="点击刷新验证码"
    ></canvas>
  </div>
</template>

<style scoped>
.captcha-container {
  display: inline-block;
}

canvas {
  border-radius: 8px;
  cursor: pointer;
  vertical-align: middle;
}
</style> 