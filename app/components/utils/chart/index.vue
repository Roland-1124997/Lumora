<script lang="ts" setup>
	
    const { data, height } = defineProps<{
        data: Array<{ month: string; users: number }>
        height: number
    }>()

	const categories = computed(() => ({
		users: {
			name: "users",
			color: "#756145",
		},
	}));

    
    

	const xFormatter = (i: number): string =>  `${data[i]?.month}`;
	const yFormatter = (i: number) => i;
</script>

<template>
	<BarChart key="light" 
    :data="data" 
    :height 
    :categories="categories" 
    :y-axis="['users']" 
    :xNumTicks="2" 
    :radius="4" 
    :y-grid-line="true" 
    :hideLegend="true"
    :x-formatter="xFormatter" 
    :y-formatter="yFormatter"
    />
</template>
