<template>
	<div class="">
		<section class="">
			<div class="grid w-full grid-cols-2 gap-3 mb-32 h-fit lg:grid-cols-4">
				<div class="" v-for="(group, index) in 8">
					<div class="w-full h-40 overflow-hidden bg-gray-200 md:h-52 rounded-xl">
						<div class="flex items-center justify-center w-full h-full">
							<icon class="bg-gray-400 animate-spin" name="ri:loader-2-line" size="2em" />
						</div>
						<!-- <NuxtImg :src="`https://picsum.photos/id/${index + 15}/5000/3333`" alt="image" class="object-cover w-full h-full" /> -->
					</div>
					<div class="py-2">
						<p class="text-sm text-gray-500">Post in group</p>
						<p class="text-sm text-gray-500">2 hours ago</p>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
	definePageMeta({
		middleware: "unauthorized",
	});
</script>
