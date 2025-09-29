<script lang="ts" setup>
	
    const { data, height } = defineProps<{
        data: Array<{ month: string; users: number }>
        height: number,
    }>()

	const categories = computed(() => ({
		users: {
			name: "users",
			color: "#756145",
		},
	}));

	const xFormatter = (i: number): string =>  `${data[i]?.month}`;
    const yFormatter = (i: number) => i.toString();
</script>

<template>
	<BarChart key="light" 
    :data 
    :height 
    :categories
    :y-axis="['users']" 
    :xNumTicks="(data.length - 1)" 
    :radius="0" 
    :y-grid-line="true" 
    :hideLegend="true"
    :x-formatter="xFormatter" 
    :y-formatter="yFormatter"
    />
</template>
