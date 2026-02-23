<template>
  <div class="profile-container">
    <div class="profile-card animate-fade-up">
      <div class="header">
        <div class="header-left">
            <h2 class="page-title">个人中心</h2>
            <p class="page-subtitle">管理您的个人信息与设置</p>
        </div>
        <el-button type="danger" plain @click="handleLogout" class="logout-btn">
            <span class="iconify" data-icon="solar:logout-2-linear" style="margin-right: 4px"></span>
            退出登录
        </el-button>
      </div>
      
      <div class="user-info">
        <div class="avatar-section">
          <div class="avatar-wrapper">
              <el-avatar :size="120" :src="form.avatar" class="user-avatar" />
              <div class="avatar-overlay">
                  <span class="iconify" data-icon="solar:camera-minimalistic-linear"></span>
              </div>
          </div>
          <div class="upload-tip">点击修改头像</div>
        </div>
        
        <el-form ref="formRef" :model="form" :rules="rules" label-position="top" class="info-form">
          <div class="form-row">
              <el-form-item label="用户名" prop="username" class="flex-1">
                <el-input v-model="form.username" disabled />
              </el-form-item>
              <el-form-item label="邮箱" prop="email" class="flex-1">
                <el-input v-model="form.email" />
              </el-form-item>
          </div>
          
          <el-form-item label="个人简介" prop="bio">
            <el-input 
                v-model="form.bio" 
                type="textarea" 
                :rows="4" 
                placeholder="介绍一下你自己..."
                resize="none"
            />
          </el-form-item>
          
          <el-form-item class="actions">
            <el-button type="primary" @click="handleSave" :loading="loading" class="save-btn">
                保存修改
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);

const form = reactive({
  username: '',
  email: '',
  bio: '',
  avatar: ''
});

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
};

onMounted(() => {
  if (!userStore.isAuthenticated || !userStore.user) {
    router.push('/login');
    return;
  }
  const { username, email, bio, avatar } = userStore.user;
  form.username = username;
  form.email = email;
  form.bio = bio || '';
  form.avatar = avatar || '';
});

const handleSave = () => {
  loading.value = true;
  // 模拟保存请求
  setTimeout(() => {
    loading.value = false;
    userStore.updateProfile({
      email: form.email,
      bio: form.bio
    });
    ElMessage.success('个人信息保存成功');
  }, 500);
};

const handleLogout = () => {
  userStore.logout();
  ElMessage.success('已退出登录');
  router.push('/login');
};
</script>

<style lang="less" scoped>
.profile-container {
  padding: 40px 20px;
  max-width: 900px;
  margin: 0 auto;
  min-height: calc(100vh - 73px);
  background-color: #f8fafc;
}

.profile-card {
  background: #fff;
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 48px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 24px;

  .page-title {
    margin: 0 0 8px 0;
    color: #1e293b;
    font-size: 24px;
    font-weight: 700;
  }
  
  .page-subtitle {
      margin: 0;
      color: #64748b;
      font-size: 14px;
  }
}

.user-info {
  display: flex;
  gap: 64px;
  align-items: flex-start;
  
  @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
      gap: 32px;
  }
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  
  .avatar-wrapper {
      position: relative;
      cursor: pointer;
      border-radius: 50%;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
      
      &:hover .avatar-overlay {
          opacity: 1;
      }
  }
  
  .avatar-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s;
      color: white;
      font-size: 32px;
  }
  
  .upload-tip {
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
  }
}

.info-form {
  flex: 1;
  width: 100%;
  
  .form-row {
      display: flex;
      gap: 24px;
      
      @media (max-width: 640px) {
          flex-direction: column;
          gap: 0;
      }
  }
  
  .flex-1 {
      flex: 1;
  }
  
  :deep(.el-form-item__label) {
      font-weight: 600;
      color: #334155;
  }
  
  :deep(.el-input__wrapper), :deep(.el-textarea__inner) {
      border-radius: 12px;
      box-shadow: 0 0 0 1px #e2e8f0 inset;
      padding: 8px 12px;
      
      &.is-focus {
          box-shadow: 0 0 0 2px @primary-color inset !important;
      }
  }
  
  .save-btn {
      border-radius: 12px;
      padding: 12px 32px;
      font-weight: 600;
      height: auto;
  }
}

.logout-btn {
    border-radius: 12px;
}
</style>
