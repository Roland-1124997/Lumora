<template>
	<FieldFormBaseLayer :requestUrl :onSuccess :onError :method :onReturn :schema label="Confirm">
		<div class="space-y-4 md:pt-12">
			<field name="code" v-model="value" v-slot="{ field, meta }: any">
				<transition name="fade">
					<p v-if="meta.validated && !meta.valid" class="-mt-8 text-red-700 md:-mt-20 md:pb-[2.5rem]">{{ meta.errors[0] || "There is an issue with this field" }}</p>
				</transition>

				<div class="flex justify-center w-full gap-2">
					<input v-for="(digit, idx) in digits" :key="idx" ref="inputs" type="text" :disabled="pasted" inputmode="numeric" placeholder="0" autocomplete="one-time-code" maxlength="1" class="w-full h-[3.3rem] text-2xl text-center transition-colors duration-300 border border-gray-500 md:h-[4.3rem] rounded-xl" :class="meta.validated && !meta.valid ? 'btn-Input-Error ' : 'btn-Input placeholder:text-gray-400 '" :value="digits[idx]" @input="onInput($event, idx)" @keydown.backspace="onBackspace($event, idx)" @focus="onFocus(idx)" @paste="onPaste($event)" />
				</div>

				<label class="sr-only" for="count">
					<input :value="field.value" />
				</label>
			</field>
		</div>
	</FieldFormBaseLayer>
</template>

<script setup lang="ts">
	const { requestUrl, onSuccess, onError, method } = defineProps({
		requestUrl: { type: String, required: true },
		onSuccess: { type: Function, required: true },
		onError: { type: Function, required: true },
		method: { type: String, default: "POST" },
		schema: { type: Object, required: true },
	});

	const store = useSessionsStore();
	const pasted = ref(false);

	const onReturn = () => {
		$fetch("/api/auth/logout", { method: "POST" }).then((response) => {
			store.clearSession();
			navigateTo(response.status.redirect);
		});
	};

	const { value } = useField<string>(`code`);

	watch(value, (newValue) => {
		if (!newValue) {
			digits.value = ["", "", "", "", "", ""];
			inputs.value[0]?.focus();
			pasted.value = false;
		}
	});

	const digits = ref<string[]>(["", "", "", "", "", ""]);
	const inputs = ref<HTMLInputElement[]>([]);

	const onInput = (e: Event, idx: number) => {
		const input = e.target as HTMLInputElement;
		const val = input.value.replace(/\D/g, ""); // Alleen cijfers

		if (!val) {
			digits.value[idx] = "";
			input.value = "";
			return;
		}

		digits.value[idx] = val[0] || "";
		input.value = digits.value[idx];

		if (idx < 5) inputs.value[idx + 1]?.focus();

		const code = digits.value.join("");
		value.value = code;
	};

	const onPaste = (e: ClipboardEvent) => {
		const paste = e.clipboardData?.getData("text") || "";
		const numbers = paste.replace(/\D/g, "").split("").slice(0, 6);

		if (numbers.length === 0) return;
		pasted.value = true;

		e.preventDefault();
		for (let i = 0; i < 6; i++) {
			const digit = numbers[i] ?? "";
			digits.value[i] = digit;
			const input = inputs.value[i];
			if (input) input.value = digit;
		}
		value.value = digits.value.join("");
		const nextIdx = numbers.length < 6 ? numbers.length : 5;

		inputs.value[nextIdx]?.focus();
	};

	const onBackspace = (e: KeyboardEvent, idx: number) => {
		if (digits.value[idx] === "" && idx > 0) {
			inputs.value[idx - 1]?.focus();
		}

		const code = digits.value.join("");
		value.value = code;
	};

	const onFocus = (idx: number) => {
		inputs.value[idx]?.select();
	};

	onMounted(() => {
		inputs.value[0]?.focus();
	});
</script>

<style scoped>
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.3s ease;
	}
	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}
</style>
