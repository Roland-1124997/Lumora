<template>
	<FieldFormBaseLayer class="mb-5" :callback :requestUrl :onSuccess :onError :method :resize :schema label="Update">
		<template v-slot="{ errors }">
			<div class="py-3 mt-5 border-y h-fit">
				<div class="">
					<div class="flex items-center gap-3 p-2 px-3 text-sm font-semibold text-gray-900 rounded bg-gray-50">
						<img  :src="member.avatar || '/profile.jpg'" :alt="member.name" class="w-10 h-10 rounded-full" />
						<div class="pl-2 border-l border-black">
							<h1 class="-mb-1 font-bold">{{ member.name }}</h1>
							<p v-if="member.can_edit_group" class="text-sm text-gray-500">Admin</p>
							<p v-else-if="member.can_delete_messages_all" class="text-sm text-gray-500">Moderator</p>
							<p v-else class="text-sm text-gray-500 text">Member</p>
						</div>
					</div>

					<hr class="my-3" />

					<div class="grid items-center gap-2">
						<div v-for="option in permissions" :key="option.key" class="flex items-center justify-between">
							<field :name="option.key" v-slot="{ field, meta }: any" v-model="option.value">
								<p>{{ option.label }}</p>
								<label class="cursor-pointer">
									<input type="checkbox" v-model="option.value" @change="updateRole({ key: option.key, value: option.value})" class="sr-only" />
									<div class="w-12 h-6 p-1 transition duration-300 bg-gray-200 rounded-full" :class="{ ' bg-yellow-800': option.value, 'bg-gray-300': !option.value }">
										<div class="w-4 h-4 mt-[0.020rem] transition duration-300 transform bg-white rounded-full shadow-md" :class="{ 'translate-x-6': option.value }"></div>
									</div>
								</label>
							</field>
						</div>
					</div>

					<p class="mt-2 text-red-700 ">
						{{ errors.message }}
					</p>
				</div>
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
        method: { type: String, default: "PATCH" },
		resize: { type: Boolean, default: false },
    });

    interface PermissionOption {
        key: string;
        label?: string;
        value: boolean;
    }
	
    const permissions = ref<PermissionOption[]>([]);
    const member = ref();
	
	const updateRole = (option: PermissionOption) => {
		if (option.key === "can_delete_messages_all") member.value.can_delete_messages_all = option.value;
		else if (option.key === "can_edit_group") member.value.can_edit_group = option.value;
	};

	const { makeRequest, data, error } = useRetryableFetch<ApiResponse<any>>({ throwOnError: false });

	await makeRequest(requestUrl);

	if(data.value) {
		permissions.value = data.value.data.permissions.options;
        member.value = data.value.data;
	}

	if(error.value) onError(error.value.data)

    const schema = toTypedSchema(
        zod.object(permissions.value.reduce((acc, option) => {
            acc[option.key] = zod.boolean();
            return acc;
        }, {} as Record<string, zod.ZodBoolean>))
    );
</script>