<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/70" @click="$emit('update:modelValue', false)" />
      <div class="relative tattoo-card w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <!-- 標題列 -->
        <div class="flex items-center justify-between mb-4" style="border-bottom: 1px solid #3a3530; padding-bottom: 1rem;">
          <h3 class="tattoo-heading text-base">
            {{ isEdit ? '✦ 編輯使用者' : '✦ 新增使用者' }}
          </h3>
          <button
            type="button"
            class="font-cinzel text-tattoo-warm hover:text-tattoo-gold transition-colors text-lg"
            @click="$emit('update:modelValue', false)"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="tattoo-label">姓名</label>
              <input v-model="form.name" type="text" required class="tattoo-input" />
            </div>
            <div>
              <label class="tattoo-label">電子郵件</label>
              <input
                v-model="form.email"
                type="email"
                required
                :disabled="isEdit"
                class="tattoo-input disabled:opacity-40"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="tattoo-label">角色</label>
              <select v-model="form.role" required class="tattoo-select">
                <option value="employee">員工</option>
                <option value="hr">HR</option>
                <option value="admin">管理員</option>
              </select>
            </div>
            <div>
              <label class="tattoo-label">部門</label>
              <input v-model="form.department" type="text" required class="tattoo-input" />
            </div>
          </div>

          <div>
            <label class="tattoo-label">到職日期</label>
            <input v-model="form.employmentDate" type="date" required class="tattoo-input" />
          </div>

          <div>
            <label class="tattoo-label">直屬主管（可選）</label>
            <select v-model="form.supervisorId" class="tattoo-select">
              <option value="">無</option>
              <option v-for="u in supervisorOptions" :key="u._id" :value="u._id">
                {{ u.name }} ({{ u.department }})
              </option>
            </select>
          </div>

          <div class="flex items-center gap-6">
            <label class="flex items-center gap-2 font-cinzel text-tattoo-warm text-xs uppercase tracking-wider cursor-pointer">
              <input v-model="form.overtimePay" type="checkbox" class="accent-tattoo-red" />
              計算加班費
            </label>
            <label
              v-if="isEdit"
              class="flex items-center gap-2 font-cinzel text-tattoo-warm text-xs uppercase tracking-wider cursor-pointer"
            >
              <input v-model="form.isActive" type="checkbox" class="accent-tattoo-gold" />
              帳號啟用
            </label>
          </div>

          <div
            v-if="errorMsg"
            class="font-cinzel text-sm px-3 py-2 border border-tattoo-red text-tattoo-red bg-tattoo-dark"
          >
            {{ errorMsg }}
          </div>

          <TattooDivider />

          <div class="flex justify-end gap-3">
            <button
              type="button"
              class="tattoo-btn-secondary"
              @click="$emit('update:modelValue', false)"
            >
              取消
            </button>
            <button type="submit" :disabled="submitting" class="tattoo-btn-primary">
              {{ submitting ? '儲存中...' : isEdit ? '✦ 儲存變更' : '✦ 新增使用者' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { useUserStore } from '@/stores/user'
  import type { User } from '@/types'
  import TattooDivider from '@/components/tattoo/TattooDivider.vue'

  const props = defineProps<{
    modelValue: boolean
    editUser?: User | null
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    saved: []
  }>()

  const userStore = useUserStore()
  const submitting = ref(false)
  const errorMsg = ref('')

  const isEdit = computed(() => !!props.editUser)

  const supervisorOptions = computed(() =>
    userStore.users.filter((u) => u._id !== props.editUser?._id && u.isActive),
  )

  const defaultForm = () => ({
    name: '',
    email: '',
    role: 'employee' as User['role'],
    department: '',
    employmentDate: '',
    supervisorId: '',
    overtimePay: false,
    isActive: true,
  })

  const form = ref(defaultForm())

  watch(
    () => props.modelValue,
    (open) => {
      if (open) {
        errorMsg.value = ''
        if (props.editUser) {
          form.value = {
            name: props.editUser.name,
            email: props.editUser.email,
            role: props.editUser.role,
            department: props.editUser.department,
            employmentDate: props.editUser.employmentDate?.slice(0, 10) ?? '',
            supervisorId: props.editUser.supervisorId ?? '',
            overtimePay: props.editUser.overtimePay,
            isActive: props.editUser.isActive,
          }
        } else {
          form.value = defaultForm()
        }
      }
    },
  )

  async function handleSubmit() {
    errorMsg.value = ''
    submitting.value = true
    try {
      const payload: Partial<User> = {
        name: form.value.name,
        role: form.value.role,
        department: form.value.department,
        employmentDate: form.value.employmentDate,
        overtimePay: form.value.overtimePay,
        isActive: form.value.isActive,
        ...(form.value.supervisorId ? { supervisorId: form.value.supervisorId } : {}),
      }

      if (isEdit.value && props.editUser) {
        await userStore.updateUser(props.editUser._id, payload)
      } else {
        await userStore.createUser({ ...payload, email: form.value.email })
      }

      emit('saved')
      emit('update:modelValue', false)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      errorMsg.value = error.response?.data?.message ?? '操作失敗，請重試'
    } finally {
      submitting.value = false
    }
  }
</script>
