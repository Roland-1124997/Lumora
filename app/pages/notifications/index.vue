<template>
	<div>
		<!-- <div class="sticky z-10 pt-2 pb-1 -mt-4 bg-white -top-3">
            <h1 class="text-4xl font-bold tracking-tight">Notifications</h1>
            <hr class="my-3 border-gray-200">
        </div> -->

		<!-- <div class="space-y-2 mb-[8.40rem]">
			<div v-for="notification in notifications" class="flex items-center justify-between p-4 border bg-gray-50 rounded-xl">
				<div class="flex items-start space-x-3">
					<div>
						<p class="text-lg font-semibold text-[#5a4d3c] underline underline-offset-1">Notification Title</p>
						<p class="text-sm text-gray-500 line-clamp-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        <p class="text-xs text-gray-400">2 hours ago</p>

                        
					</div>
                    <icon name="ri:close-fill" size="1.6rem" class="text-xl text-gray-500 cursor-pointer" />
                    
				</div>
			</div>
		</div> -->
	</div>
</template>

<script setup>
	definePageMeta({
		middleware: "unauthorized",
	});

	const notifications = inject("notifications");
</script>
