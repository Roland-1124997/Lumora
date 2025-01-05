import { serverSupabaseClient, serverSupabaseUser, serverSupabaseSession } from "#supabase/server";

export default defineEventHandler((event) => {
    return new Promise(async (resolve, reject) => {
        setTimeout(async () => {
            const client = await serverSupabaseClient(event)
            const { credential } = await readBody(event)
            const { provider } = getRouterParams(event)

            const { error } = await client.auth.signInWithIdToken({
                provider: provider,
                token: credential,
            });

            if (error) return reject({
                statusCode: 400,
                statusMessage: "Foutieve aanvraag",
                message: "Het verzoek kon door de server niet begrepen worden vanwege een onjuiste syntaxis."
            });

            const session: any = await serverSupabaseSession(event)
            useSetCookies(event, session)
        
            return resolve({
                statusCode: 200,
                statusMessage: "OK",
                message: "Je bent succesvol ingelogd.",
                redirect: "/",
            });
        }, 1000);
    });
});
