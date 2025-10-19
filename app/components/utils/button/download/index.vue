<template>
	<button @click="downloadFile" class="w-full items-center justify-center gap-2 p-2 px-4 text-sm border border-[#756145] rounded-xl">Download</button>
</template>

<script setup lang="ts">
	
	const { url } = defineProps({
		url: { type: String, default: "/" },
	});

	const { makeRequest } = useRetryableFetch({ throwOnError: false });
	const { addToast } = useToast();

	const downloadFile = async () => {
		const { data, error } = await makeRequest(url, {
			responseType: "blob",
		});

		if (data.value) {
			const filename = url.split("/").pop() || "download";
			const blobUrl = window.URL.createObjectURL(new Blob([data.value as any]));
			const link = document.createElement("a");
			link.href = blobUrl;
			link.setAttribute("download", filename);
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(blobUrl);
		}

		if (error.value)
			addToast({
				message: "Failed to download image.",
				type: "error",
				duration: 5000,
			});
	};
</script>
