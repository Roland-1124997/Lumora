<template>
	<FieldFormBaseLayer class="mb-5" :callback :requestUrl :onSuccess :onError :resize :method :schema>
		<template v-slot="{ errors }">
			<div class="py-3 mt-5 border-y h-fit md:h-[68vh]">
				<img v-if="qr_code" class="object-contain w-full h-full border rounded-xl aspect-square bg-gray-50" :src="qr_code" />
				<div @click="copy" class="flex items-center justify-center gap-2 p-2 mt-2 bg-gray-100 border rounded-xl">
					<Icon :class=" copied ? 'text-green-600' : ''" :name=" copied ? 'ri:checkbox-circle-fill' : 'ri:attachment-2'" size="1.4rem" />
					
					<span class="pl-2 text-sm font-semibold truncate border-l-2 border-black opacity-80">
						{{ secret }}
					</span>
				</div>
                <p v-if="failed" class="mt-5 text-red-700 ">
					An error occurred, unable to create an qr code! Please try again later.
				</p>
			</div>
		</template>
	</FieldFormBaseLayer>
</template>

<script setup lang="ts">
	import { toTypedSchema } from "@vee-validate/zod";
	import * as zod from "zod";

	const { requestUrl, onSuccess, onError, method } = defineProps({
		callback: { type: Function, required: false },
		requestUrl: { type: String, required: true },
		onSuccess: { type: Function, required: true },
		onError: { type: Function, required: true },
		method: { type: String, default: "POST" },
		resize: { type: Boolean, default: false },
	});

	const qr_code = ref();
	const secret = ref();
    const copied = ref()
    const failed = ref(false)

	await $fetch("/api/auth/totp").then((response) => {
        qr_code.value = response.data.qr_code
        secret.value = response.data.secret
	}).catch((error) => {
        failed.value = true
    })

	
	const copy = () => {

        if(!secret.value) return

		const dummy = document.createElement("input");

		const text = secret.value;
		dummy.style.opacity = "0";
		dummy.style.position = "absolute";
		dummy.style.top = "0";

		document.body.appendChild(dummy);
		dummy.value = text;
		dummy.select();
		document.execCommand("copy");
		document.body.removeChild(dummy);

        copied.value = true

        setTimeout(() => copied.value = false, 2000)
	};

	const schema = toTypedSchema(zod.object({}));
</script>
