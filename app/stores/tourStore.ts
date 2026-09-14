import { createGlowTour } from "@glowhop/vue-tour";

export const useTourStorage = defineStore("useTourStorage", () => {
	const tour = createGlowTour();
	const workflow = ref<any>(null);

	const setWorkflow = (flow: any) => {
		workflow.value = flow;
	};

	const runTour = () => {
		if (tour && workflow.value) {
			tour.run(workflow.value);
		} else {
			console.warn("Tour instance or workflow is not set.");
		}
	};

	return {
		tour,
		workflow,
		setWorkflow,
		runTour,
	};
});
