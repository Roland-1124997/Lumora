<template>
    <field :name="name" :unchecked-value="false" v-slot="{ field, meta }: any">
        <label :for="name" class="flex items-center space-x-2 text-sm">
            <input :id="name" type="checkbox" v-model="field.value" :value="false" v-bind="field"  class="w-4 h-4 text-gray-600 accent-[#756145]/80 hover:accent-[#756145]" />
            <span class="font-medium text-[#817a70] hover:text-[#6e675d]">{{ label }}</span>
        </label>
        <ErrorMessage class="text-sm font-medium text-gray-700 " :name="name"/>
    </field>
</template>

<script setup lang="ts">

	const { name, initialValue } = defineProps({
		name: { type: String, default: "box" },
		label: { type: String, required: true },
        initialValue: { type: String, default: "" }
	});

    const { value } = useField<boolean>(`${name}`);
    
    watch(() => initialValue, (newValue) => {
		value.value = newValue ? true : false;
	}, {immediate: true});
    
</script>
