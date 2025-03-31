<template>
    <field :name="name" v-slot="{ field, meta }: any">
        <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 " :for="name"> {{ label }} <span class="text-red-700 ">{{ required ? "*" : "" }}</span> 
                <transition name="fade">
                    <span v-if="meta.validated && !meta.valid" class="text-red-700 ">({{ meta.errors[0] || "There is an issue with this field" }})</span>
                </transition>
            </label>
            
            <div class="flex gap-2">

				<div class="w-full" v-if="rerender">
					<input :disabled v-if="!blurred" @blur="toggleBlur" v-bind="field" :id="name" :placeholder type="password" :class="meta.validated && !meta.valid ? ' btn-Input-Error' : 'btn-Input'" class="z-10 w-full p-2 px-3 transition-colors duration-300 border appearance-none rounded-xl" />
					<input :disabled v-else-if="!showPassword" v-bind="field" :id="name" :placeholder type="password" :class="meta.validated && !meta.valid ? ' btn-Input-Error' : 'btn-Input'" class="z-10 w-full p-2 px-3 transition-colors duration-300 border appearance-none rounded-xl" />
					<input :disabled v-else v-bind="field" :id="name" :placeholder type="text" :class="'btn-Input'" class="z-10 w-full p-2 px-3 transition-colors duration-300 border appearance-none rounded-xl" />
				</div>
				
				<input v-else v-bind="field" :id="name" :placeholder :type="showPassword ? 'text' : 'password'" :class="meta.validated && !meta.valid ? ' btn-Input-Error' : 'btn-Input'" class="z-10 w-full p-2 px-3 transition-colors duration-300 border appearance-none rounded-xl" />
                <button v-if="enableToggle" type="button" @click="togglePassword" class="z-20 flex items-center justify-center p-1 border bg-[#756145]/80 hover:bg-[#756145] w-11 rounded-xl group">
                    <icon :name="showPassword ? 'ri:eye-off-fill' : 'ri:eye-fill'" size="1.2rem" class="bg-white opacity-80 group-hover:opacity-100"></icon>
                </button>
            </div>
        </div>
    </field>
</template>

<script setup lang="ts">

defineProps({
    name: { type: String, required: true, },
    label: { type: String, default: "Password" },
    placeholder: { type: String, default: "" },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    enableToggle: { type: Boolean, default: false },
    rerender: { type: Boolean, default: false }
});

const showPassword = ref(false);
const blurred = ref(false);

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};

const toggleBlur = () => (blurred.value = !blurred.value);

</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
</style>
