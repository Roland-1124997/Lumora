
import * as zod from "zod";
import { serverSupabaseClient, serverSupabaseSession } from "#supabase/server";

const schema = zod.object({
  email: zod.string().email(),
  wachtwoord: zod.string().min(8),
  remember: zod.boolean().optional(),
});

export default defineEventHandler((event) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const request = await readBody(event)

      const { error: zodError }: any = await schema.safeParseAsync(request);

      if (zodError) return reject({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "De gegevens zijn onjuist.",
        data: zodError.errors,
      });

      const client = await serverSupabaseClient(event)

      const { error } = await client.auth.signInWithPassword({
        email: request.email, password: request.wachtwoord
      })

      if (error) return reject({
        statusCode: 401,
        statusMessage: "Unauthorized",
        message: "The request has not been applied because it lacks valid authentication credentials for the target resource.",
        data: {
          email: ["Onbekende combinatie"],
          wachtwoord: ["Onbekende combinatie"]
        },
      });

      const session: any = await serverSupabaseSession(event)
      useSetCookies(event, session)
      
      return resolve({
        statusCode: 200,
        statusMessage: "OK",
        message: "Je bent succesvol ingelogd.",
        redirect: "/",
      })

    }, 2000);
  })
})
