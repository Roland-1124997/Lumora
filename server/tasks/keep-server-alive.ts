import { consola} from "consola"

export default defineTask({
    async run() {

        consola.info("checking server status ...")

        await new Promise((resolve) => setTimeout(resolve, 2000));
        await $fetch("/status")
        .then(() => consola.success("Server status checked successfully"))
        .catch(() => consola.error("Failed to check server status"))

        return { result: "Done" }

    },
});