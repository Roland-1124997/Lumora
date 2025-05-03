<template>
    <field :name="name" v-slot="{ field, meta }: any">
        <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700 " :for="name"> {{ label }} <span class="text-red-700 ">{{ required ? "* " : "" }}</span> 
                <transition name="fade">
                    <span v-if="meta.validated && !meta.valid" class="text-red-700 ">({{ meta.errors[0] || "There is an issue with this field" }})</span>
                </transition>
            </label>
            
            <div class="flex gap-2">
                <input v-bind="field" :disabled :id="name" :placeholder type="text" :class="meta.validated && !meta.valid ? ' btn-Input-Error' : 'btn-Input'" class="z-10 w-full p-2 px-3 transition-colors duration-300 border appearance-none rounded-xl" />
            </div>
        </div>
    </field>
</template>

<script setup lang="ts">
    
    const { name, initialValue } = defineProps({
        name: { type: String, required: true, },
        label: { type: String, default: "text" },
        placeholder: { type: String, default: "" },
        required: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        initialValue: { type: String, default: "" },
    });

    const { value } = useField<string>(`${name}`);
	value.value = initialValue;
    
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
</style>