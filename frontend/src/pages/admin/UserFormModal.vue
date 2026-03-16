<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="$emit('update:modelValue', false)" />
      <div
        class="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ isEdit ? '編輯使用者' : '新增使用者' }}
          </h3>
          <button
            type="button"
            class="text-gray-400 hover:text-gray-600"
            @click="$emit('update:modelValue', false)"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="px-6 py-5 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">姓名</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">電子郵件</label>
              <input
                v-model="form.email"
                type="email"
                required
                :disabled="isEdit"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">角色</label>
              <select
                v-model="form.role"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="employee">員工</option>
                <option value="hr">HR</option>
                <option value="admin">管理員</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">部門</label>
              <input
                v-model="form.department"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">到職日期</label>
            <input
              v-model="form.employmentDate"
              type="date"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">直屬主管（可選）</label>
            <select
              v-model="form.supervisorId"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">無</option>
              <option v-for="u in supervisorOptions" :key="u._id" :value="u._id">
                {{ u.name }} ({{ u.department }})
              </option>
            </select>
          </div>

          <div class="flex items-center gap-4">
            <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input v-model="form.overtimePay" type="checkbox" class="rounded" />
              計算加班費
            </label>
            <label
              v-if="isEdit"
              class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
            >
              <input v-model="form.isActive" type="checkbox" class="rounded" />
              帳號啟用
            </label>
          </div>

          <div v-if="errorMsg" class="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
            {{ errorMsg }}
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              @click="$emit('update:modelValue', false)"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {{ submitting ? '儲存中...' : isEdit ? '儲存變更' : '新增使用者' }}
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
