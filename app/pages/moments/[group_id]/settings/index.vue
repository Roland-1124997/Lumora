<template>
	<div>
		<div v-if="content?.permision?.delete" class="p-2 border rounded-xl bg-gray-50">
			<button @click="deleteData" class="flex items-center justify-center p-2 px-4 text-white bg-black border border-black rounded-xl w-fit">delete</button>
		</div>
	</div>
</template>

<script setup lang="ts">

	const group_id = useRoute().params.group_id;
	const content = ref()



	await $fetch(`/api/moments/settings/${group_id}`).then((response: ApiResponse<Group>) => {
		content.value = response.data 
        
		
	}).catch((error) => {

		throw createError({
            statusCode: error.data.meta.code,
            message: error.data.meta.message,
            fatal: true,
        })

	});

	const deleteData = async () => {
		await $fetch(`/api/moments/${group_id}`, { method: "DELETE"}).then((response: ApiResponse<null>) => {
			if(response.status.redirect) navigateTo(response.status.redirect)
		}).catch((error)=> {
			console.log(error)
		})
		
	}


</script>