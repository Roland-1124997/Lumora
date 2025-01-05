import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {
        const client = await serverSupabaseClient(event);
    
        const { error } = await useDeleteSession(client)

        if (error) return reject({
            statusCode: 400,
            statusMessage: "Foutieve aanvraag",
            message: "De server kon het verzoek niet begrijpen vanwege een foutieve syntaxis."
        });

        useDeleteCookies(event)

        return resolve({
            statusCode: 200,
            statusMessage: "OK",
            message: "Je bent succesvol uitgelogd.",
            redirect: "/auth",
        });

    });
});
