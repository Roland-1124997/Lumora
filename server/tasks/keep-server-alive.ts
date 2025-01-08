import { consola } from "consola"

export default defineTask({
    async run() {

        const config = useRuntimeConfig()
        consola.info("checking server status ...")
        await new Promise((resolve) => setTimeout(resolve, 2000));

        await fetch(config.ServerUrl)
            .then(() => consola.success("Server status checked successfully",))
            .catch(() => consola.error("Failed to check server status",))

        return { result: "Done" }

    },
});