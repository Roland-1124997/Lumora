
export const useDebounce = (callback: Function, wait: number = 1500) => {
	let timeout: number | ReturnType<typeof setTimeout>;
	return (...args: any[]) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => callback.apply(this, args), wait);
	};
};