<template>
	<div>
	</div>
</template>

<script setup>

    //const { updateGroupValue } = inject("group");
	const group_id = useRoute().params.group_id;


	await $fetch(`/api/moments/${group_id}`).then((response) => {
        
		//updateGroupValue(response.meta.name);
	}).catch((error) => {

		throw createError({
            statusCode: error.data.meta.code,
            message: error.data.meta.message,
            fatal: true,
        })

	});


</script>