<template>
  <div class="auth-container">
    <div class="auth-box animate-fade-up">
      <h2 class="title">创建新账户</h2>
      <p class="subtitle">开始制作您的完美简历</p>
      
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" class="auth-form">
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="form.username" 
            placeholder="请输入用户名" 
            size="large"
            :prefix-icon="UserIcon"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input 
            v-model="form.email" 
            placeholder="请输入邮箱" 
            size="large"
            :prefix-icon="MailIcon"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="form.password" 
            type="password" 
            placeholder="请输入密码" 
            show-password 
            size="large"
            :prefix-icon="LockIcon"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input 
            v-model="form.confirmPassword" 
            type="password" 
            placeholder="请再次输入密码" 
            show-password 
            size="large"
            :prefix-icon="LockIcon"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit-btn" @click="handleRegister" :loading="loading" size="large">
            注册
          </el-button>
        </el-form-item>
      </el-form>
      <div class="footer-links">
        <span>已有账号？</span>
        <router-link to="/login" class="link">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, h } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { useUserStore } from '@/stores/user';

// Simple icon render functions
const UserIcon = () => h('span', { class: 'iconify', 'data-icon': 'solar:user-linear' });
const MailIcon = () => h('span', { class: 'iconify', 'data-icon': 'solar:letter-linear' });
const LockIcon = () => h('span', { class: 'iconify', 'data-icon': 'solar:lock-password-linear' });

const router = useRouter();
const userStore = useUserStore();
const formRef = ref<FormInstance>();
const loading = ref(false);

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== form.password) {
    callback(new Error('两次输入密码不一致!'));
  } else {
    callback();
  }
};

const rules = reactive<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [{ validator: validatePass2, trigger: 'blur' }]
});

const handleRegister = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid, fields) => {
    if (valid) {
      loading.value = true;
      // 模拟注册请求
      setTimeout(() => {
        loading.value = false;
        // 模拟注册成功并自动登录
        userStore.login({
          id: Date.now().toString(),
          username: form.username,
          email: form.email,
          avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
          bio: 'Jusort 新用户'
        });
        ElMessage.success('注册成功');
        router.push('/');
      }, 1000);
    }
  });
};
</script>

<style lang="less" scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 73px);
  background-color: #f8fafc;
  background-image: 
    radial-gradient(at 0% 0%, rgba(37, 99, 235, 0.1) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(37, 99, 235, 0.1) 0px, transparent 50%);
}

.auth-box {
  width: 100%;
  max-width: 440px;
  padding: 48px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 10px 15px -3px rgba(0, 0, 0, 0.05),
    0 0 0 1px rgba(0,0,0,0.03);
}

.logo-area {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 32px;
    
    .logo-icon {
        font-size: 32px;
        color: @primary-color;
    }
    
    .logo-text {
        font-size: 24px;
        font-weight: 800;
        color: #1e293b;
        letter-spacing: -0.5px;
    }
}

.title {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.subtitle {
    text-align: center;
    font-size: 14px;
    color: #64748b;
    margin-bottom: 32px;
}

.auth-form {
    :deep(.el-input__wrapper) {
        border-radius: 12px;
        box-shadow: 0 0 0 1px #e2e8f0 inset;
        padding: 1px 15px;
        
        &.is-focus {
            box-shadow: 0 0 0 2px @primary-color inset !important;
        }
    }
    
    :deep(.el-form-item__label) {
        font-weight: 600;
        color: #334155;
    }
}

.submit-btn {
  width: 100%;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  height: 48px;
  background: @primary-color;
  border: none;
  transition: all 0.2s;
  
  &:hover {
      background: #1d4ed8; // blue-700
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
  }
  
  &:active {
      transform: translateY(0);
  }
}

.footer-links {
  margin-top: 32px;
  text-align: center;
  font-size: 14px;
  color: #64748b;

  .link {
    color: @primary-color;
    text-decoration: none;
    font-weight: 600;
    margin-left: 4px;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
