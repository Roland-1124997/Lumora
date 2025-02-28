<template>
    <div>
        <TransitionGroup name="fade" tag="div" class="space-y-2 mb-[12.40rem]">
            <div v-for="notification in notifications" :key="notification" class="flex items-center justify-between p-4 border bg-gray-50 rounded-xl">
                <div class="flex items-start justify-between w-full space-x-3">
                    <div>
                        <p class="text-lg font-semibold text-[#5a4d3c] underline underline-offset-1">{{ notification.title }}</p>
                        <p class="text-sm text-gray-500 line-clamp-2">{{ notification.message }}</p>
                        <p class="text-xs text-gray-400">{{ notification.time }}</p>
                    </div>
                    <icon @click="updateNotification({notification})" name="ri:close-fill" size="1.6rem" class="text-xl text-gray-500 cursor-pointer" />
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup>
    useHead({
        htmlAttrs: {
            lang: "nl",
        },
    });

    useSeoMeta({
        title: "Lumora - Notifications",
        description: "Bekijk de nieuwste en populairste posts op Lumora!",
        ogTitle: "Lumora",
        ogDescription: "Bekijk de nieuwste en populairste posts op Lumora!",
        ogImage: "/apple-touch-icon.png",
        ogUrl: "/",
        twitterTitle: "Lumora",
        twitterDescription: "Bekijk de nieuwste en populairste posts op Lumora!",
        twitterImage: "/apple-touch-icon.png",
        twitterCard: "summary",
    });

    definePageMeta({
        middleware: "unauthorized",
    });

    const { data: notifications, updateNotification} = inject("notifications");
</script>

<style scoped>
    .fade-enter-active,
    .fade-leave-active {
        transition: all 0.5s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
		/* transform: translateX(12em); */
    }
</style>