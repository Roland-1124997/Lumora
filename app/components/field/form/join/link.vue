<template>
	<FieldFormBaseLayer class="mb-5" :callback :requestUrl :onSuccess :onError :method :schema label="Confirm">
		<template v-slot="{ errors }">
			<div class="py-3 mt-5 border-y h-fit">
                <field name="invite_link" v-slot="{ field, meta }: any" v-model="link">
					<div class="relative mt-1 mb-4 space-y-2">
						<label class="text-sm font-medium text-gray-700" for="invite_link">
							Invite Link
							<transition name="fade">
								<span v-if="meta.validated && !meta.valid" class="text-red-700"> ({{ meta.errors[0] || "Er is een probleem met dit veld" }}) </span>
							</transition>
						</label>
                        <input v-bind="field" v-model="link" @input="stripHostFromUrl($event)" id="invite_link" type="url" :class="meta.validated && !meta.valid ? ' btn-Input-Error' : 'btn-Input'" class="z-10 w-full p-2 px-3 transition-colors duration-300 border appearance-none rounded-xl" />
                        <p class="mt-2 text-red-700 ">
                            {{ errors.message }}
                        </p>
                    </div>
                    
				</field>
			</div>
		</template>
	</FieldFormBaseLayer>
</template>
<script setup lang="ts">
    import { toTypedSchema } from "@vee-validate/zod";
    import * as zod from "zod";

    const link = ref()
    

    const stripHostFromUrl = (event: any) => {
        const value = event.target.value;
        const splits = value.split("/");
        link.value = splits[4] || ""; 
    };
    

    const { requestUrl, onSuccess, onError, method } = defineProps({
        callback: { type: Function, required: false },
        requestUrl: { type: String, required: true },
        onSuccess: { type: Function, required: true },
        onError: { type: Function, required: true },
        method: { type: String, default: "GET" },
    });

    const schema = toTypedSchema(
        zod.object({
            invite_link: zod.string({ message: "Dit is een verplicht veld" }).nonempty({ message: "Dit is een verplicht veld" }),
        })
    );
</script>