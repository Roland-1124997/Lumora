<template>
    <div>
        
    </div>
</template>

<script setup>

definePageMeta({
	middleware: "invite-redirecter",
    layout: false,
});

const route = useRoute();

const id = route.params.id;
const token = route.query.token;

await $fetch(`/api/invitations/${id}/${token}`).then((response) => {
    sessionStorage.removeItem(`${response.status.redirect.split("/")[2]}_List`)
    sessionStorage.removeItem(`${response.status.redirect.split("/")[2]}_Scroll`)
    setTimeout(() => {
        if (response.status.redirect) navigateTo(response.status.redirect);
    }, 500);
}).catch((error) => setTimeout(() => navigateTo('/moments'), 1000));


</script>