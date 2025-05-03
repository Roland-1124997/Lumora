<template>
	<div>
		<div class="sticky z-50 pt-3 -mt-5 bg-white -top-4">
			<div class="flex items-center justify-between w-full gap-2 mb-3 md:justify-end">
				<FieldInputSearch class="hidden md:flex" uri="/api/moments" placeholder="Search logs..." :url="$route.path" :update="() => {}" />

				<div class="relative w-full space-y-2 md:w-1/4">
					<button @click="isActionDropdownOpen = !isActionDropdownOpen" class="flex items-center justify-between gap-2 pl-3 p-2 text-white bg-[#756145] border border-[#756145] rounded-xl w-full">
						{{ FilterByActionOptions.find((option) => option.value === actions)?.label }}
						<icon :name="isActionDropdownOpen ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'" size="1.4rem" />
					</button>
					<ul v-if="isActionDropdownOpen" class="absolute left-0 z-50 w-full mt-1 overflow-scroll bg-white border rounded-md shadow-xl">
						<li v-for="option in FilterByActionOptions" :key="option.value" @click="actions = option.value; isActionDropdownOpen = false;" class="p-2 border-b cursor-pointer hover:bg-gray-100">
						{{ option.label }}
						</li>
					</ul>
				</div>
				
				<div class="relative w-full space-y-2 md:w-1/4">
					<button @click="isTimeDropdownOpen = !isTimeDropdownOpen" class="flex items-center justify-between p-2 pl-3 gap-2 text-white bg-[#756145] border border-[#756145] rounded-xl w-full">
						{{ FilterByTimeOptions.find((option) => option.value === time)?.label }}
						<icon :name="isTimeDropdownOpen ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'" size="1.4rem" />
					</button>
					<ul v-if="isTimeDropdownOpen" class="absolute left-0 z-50 w-full mt-1 overflow-scroll bg-white border shadow-md rounded-xl">
						<li v-for="option in FilterByTimeOptions" :key="option.value" @click="time = option.value; isTimeDropdownOpen = false;" class="p-2 border-b cursor-pointer hover:bg-gray-100">
						{{ option.label }}
						</li>
					</ul>
				</div>

				<button @click="() => {}" class="flex items-center justify-center p-2 px-2 text-white bg-[#756145] border border-[#756145] rounded-xl w-fit">
					<icon :class="false ? 'animate-spin' : ''" name="ri:refresh-line" size="1.4em" />
				</button>
			</div>
			<FieldInputSearch class="md:hidden" uri="/api/moments" placeholder="Search logs..." :url="$route.path" :update="() => {}" />
			<hr class="pb-3 mt-3" />
		</div>
		<div :class="PWAInstalled ? 'pb-32' : 'pb-20'" class="">
			<div class="relative">
				<div class="absolute top-0 z-20 w-1 h-full bg-gray-100 left-6"></div>
				<div v-for="(logs, group) in groupedLogs" :key="group" class="mb-2">
					<div :class=" PWAInstalled ? 'top-[13.85vh] md:top-[7.95vh]' : 'top-[13.4vh] md:top-[7.95vh]'" class="sticky z-30 flex items-center justify-between px-4 py-3 mb-3 text-lg font-bold text-gray-700 border rounded-xl bg-gray-50">

						<div class="z-30 flex items-center justify-center gap-2">
							<div class="flex z-30 justify-center flex-shrink-0 w-8 -ml-[0.35rem]">
								<div class="flex items-center justify-center w-8 h-8 text-white bg-[#756145] border-2 border-gray-100 rounded-full">
									<Icon name="ri:time-line" size="1.4rem"/>
								</div>
							</div>
							<h2 class="">{{ group }}</h2>
						</div>
						<h3 class="text-sm font-normal text-gray-400 ">Count({{ logs.length }})</h3>
					</div>
					
					<ul class="space-y-4">
						<li v-for="log in logs" :key="log.id" class="relative flex items-start gap-2 md:gap-4">
							<div class="z-20 flex justify-center flex-shrink-0 w-8 ml-[0.65rem]">
								<div :class="`flex items-center justify-center w-6 h-6 p-[0.20rem] text-white border-2 rounded-full border-gray-50 -mt-[0.10rem] ${actionStyles[log.action].color}`">
									<Icon :name="actionStyles[log.action].icon" />
								</div>
							</div>
							<div class="flex-1 rounded-xl">
								<div class="">
									<div class="flex items-center justify-between">
										<span class="text-sm font-semibold text-gray-900">{{ log.message }}</span>
										<span class="text-sm text-gray-500">{{ useDateFormat(log.timestamp, "HH:mm"), { locales: "en-uk"} }}</span>
									</div>
									<hr class="mt-2 ">
									<code class="block p-2 mt-2 font-mono text-xs text-gray-800 border rounded-lg">
										{{ log }}
									</code>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	useHead({
		htmlAttrs: {
			lang: "en",
		},
	});

	useSeoMeta({
		title: "Lumora - Group audit logs",
		description: "View shared photos and stories in this Lumora group. Connect, comment, and be inspired.",
		ogTitle: "Lumora - Explore This Group",
		ogDescription: "Dive into the latest posts and moments shared in this Lumora group.",
		ogImage: "/apple-touch-icon.png",
		ogUrl: "/",
		twitterTitle: "Lumora - Group audit logs",
		twitterDescription: "Discover photos and connect with members in this Lumora group.",
		twitterImage: "/apple-touch-icon.png",
		twitterCard: "summary",
	});

	definePageMeta({
		middleware: "unauthorized",
	});

	/*
	 ************************************************************************************
	 */

	const { PWAInstalled } = inject<any>("PWA");

	const time = ref(7);
	const actions = ref("all");

	const isActionDropdownOpen = ref(false);
	const isTimeDropdownOpen = ref(false);

	watch(isActionDropdownOpen, (value) => {
        if (value && isTimeDropdownOpen.value) isTimeDropdownOpen.value = false;
    });

	watch(isTimeDropdownOpen, (value) => {
        if (value && isActionDropdownOpen.value) isActionDropdownOpen.value = false;
    });

	const FilterByActionOptions = [
		{ label: "All actions", value: "all" },
		{ label: "Group", value: "group" },
		{ label: "Messages", value: "message" },
		{ label: "Moderation", value: "moderation" },
	];

	const FilterByTimeOptions = [
		{ label: "Last day", value: 1 },
		{ label: "Last 7 days", value: 7 },
		{ label: "Last 30 days", value: 30 },
		{ label: "Last 90 days", value: 90 },
	];

	const actionStyles: any = {
		group: { icon: "ri:group-line", color: "bg-blue-500" },
		message: { icon: "ri:message-3-line", color: "bg-green-500" },
		moderation: { icon: "ri:shield-check-line", color: "bg-red-500" },
		default: { icon: "ri:account-circle-fill", color: "bg-gray-600" },
	};

	
	const logs = ref<any>([
		{ 
			id: 1, 
			timestamp: new Date(), 
			message: "User joined the group", 
			action: "group", 
			user: { id: 101, name: "Alice", avatar: "/avatars/alice.jpg" }, 
			invite: { code: "INV123", issuedBy: "Bob" } 
		},
		{ 
			id: 2, 
			timestamp: new Date(new Date().setHours(new Date().getHours() - 5)), 
			message: "User sent a message", 
			action: "message", 
			user: { id: 102, name: "Charlie", avatar: "/avatars/charlie.jpg" }, 
			content: "Hello everyone!" 
		},
		{ 
			id: 3, 
			timestamp: new Date(new Date().setDate(new Date().getDate() - 1)), 
			message: "Moderator removed a post", 
			action: "moderation", 
			user: { id: 103, name: "Moderator", avatar: "/avatars/moderator.jpg" }, 
			target: { id: 201, content: "Inappropriate content", avatar: "/avatars/target1.jpg" } 
		},
		{ 
			id: 4, 
			timestamp: new Date(new Date().setDate(new Date().getDate() - 2)), 
			message: "User liked a post", 
			action: "group", 
			user: { id: 104, name: "Diana", avatar: "/avatars/diana.jpg" }, 
			post: { id: 301, content: "Great post about Vue.js!" } 
		},
		{ 
			id: 5, 
			timestamp: new Date(new Date().setHours(new Date().getHours() - 10)), 
			message: "User posted a comment", 
			action: "message", 
			user: { id: 105, name: "Eve", avatar: "/avatars/eve.jpg" }, 
			comment: { id: 401, content: "I totally agree with this!" } 
		},
		{ 
			id: 6, 
			timestamp: new Date(new Date().setDate(new Date().getDate() - 3)), 
			message: "Moderator banned a user", 
			action: "moderation", 
			user: { id: 103, name: "Moderator", avatar: "/avatars/moderator.jpg" }, 
			target: { id: 106, name: "Frank", avatar: "/avatars/frank.jpg" }, 
			reason: "Violation of community guidelines" 
		},
		{ 
			id: 7, 
			timestamp: new Date(new Date().setDate(new Date().getDate() - 4)), 
			message: "User created a new group", 
			action: "group", 
			user: { id: 107, name: "Grace", avatar: "/avatars/grace.jpg" }, 
			group: { id: 501, name: "Vue Enthusiasts" } 
		},
		{ 
			id: 8, 
			timestamp: new Date(new Date().setHours(new Date().getHours() - 15)), 
			message: "User sent a private message", 
			action: "message", 
			user: { id: 108, name: "Hank", avatar: "/avatars/hank.jpg" }, 
			recipient: { id: 109, name: "Ivy", avatar: "/avatars/ivy.jpg" }, 
			content: "Can we discuss the project?" 
		},
		{ 
			id: 9, 
			timestamp: new Date(new Date().setDate(new Date().getDate() - 5)), 
			message: "Moderator approved a post", 
			action: "moderation", 
			user: { id: 103, name: "Moderator", avatar: "/avatars/moderator.jpg" }, 
			post: { id: 302, content: "Check out this new feature!" } 
		},
		{ 
			id: 10, 
			timestamp: new Date(new Date().setDate(new Date().getDate() - 6)), 
			message: "User joined another group", 
			action: "group", 
			user: { id: 110, name: "Jack", avatar: "/avatars/jack.jpg" }, 
			group: { id: 502, name: "React Developers" } 
		},
	]);

	
	const isToday = (date: Date) => {
		const today = new Date();
		return (
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear()
		);
	};

	const isYesterday = (date: Date) => {
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		return (
			date.getDate() === yesterday.getDate() &&
			date.getMonth() === yesterday.getMonth() &&
			date.getFullYear() === yesterday.getFullYear()
		);
	};

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("en-uk", {
			month: "long",
			day: "numeric",
			year: "numeric",
		});
	};


	const groupedLogs = computed(() => {
	const groups: Record<string, any> = {};
	const now = new Date();

	logs.value.filter((log: any) => {
		
		if (time.value !== 0) {
			const logDate = new Date(log.timestamp);
			const diffInDays = Math.floor((now.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
			if (diffInDays > time.value) return false;
		}

		if (actions.value !== "all" && log.action !== actions.value) return false;

		return true;
	}).forEach((log: any) => {
		let group = "Older";
		if (isToday(log.timestamp)) group = "Today";
		else if (isYesterday(log.timestamp)) group = "Yesterday";
		else group = formatDate(log.timestamp);

		if (!groups[group]) groups[group] = [];
		groups[group].push(log);
	});

	return groups;
	});

	/*
	 ************************************************************************************
	 */
</script>
