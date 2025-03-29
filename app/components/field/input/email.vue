<template>
	<field :name="name" v-slot="{ field, meta }: any">
		
		<div class="space-y-2">
			<label class="text-sm font-medium text-gray-700 " :for="name"> {{ label }} <span class="text-red-700 ">{{ required ? "*" : "" }}</span> 
				<transition name="fade">
					<span v-if="meta.validated && !meta.valid" class="text-red-700">({{ meta.errors[0] || "There is an issue with this field" }})</span>
				</transition>
			</label>

			<ClientOnly>
			<input v-bind="field" :id="name" :placeholder type="email" :class="meta.validated && !meta.valid ? ' btn-Input-Error ' : ' btn-Input'" class="w-full p-2 px-3 transition-colors duration-300 border appearance-none rounded-xl" />
				<template #fallback>
					<input :id="name" :placeholder type="email" :class="meta.validated && !meta.valid ? ' btn-Input-Error ' : ' btn-Input'" class="w-full p-2 px-3 transition-colors duration-300 border appearance-none rounded-xl" />
				</template>
			</ClientOnly>
		</div>
	</field>
</template>

<script setup lang="ts">
	const { name, initalvalue } = defineProps({
		name: { type: String, required: true },
		label: { type: String, default: "Email" },
		placeholder: { type: String, default: "" },
		required: { type: Boolean, default: false },
		disabled: { type: Boolean, default: false },
		initalvalue: { type: String, default: "" },
	});

	const { value } = useField<string>(`${name}`);
	value.value = initalvalue;

</script>


<style scoped>
.fade-enter-active, .fade-leave-active {
	transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
	opacity: 0;
}
</style>