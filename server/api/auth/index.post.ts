
import * as zod from "zod";
import { serverSupabaseClient, serverSupabaseSession } from "#supabase/server";

const schema = zod.object({
  email: zod.string().email(),
  wachtwoord: zod.string().min(8),
  remember: zod.boolean().optional(),
});

export default defineEventHandler(async (event) => {

  const time = Date.now();
  const request = await readBody(event)

  const { error: zodError }: any = await schema.safeParseAsync(request);

  if (zodError) return useReturnResponse(event, time, {
    ...badRequestError,
    field: {
      errors: zodError.errors,
    }
  })

  const client = await serverSupabaseClient(event)

  const { error } = await client.auth.signInWithPassword({
    email: request.email, password: request.wachtwoord
  })

  if (error) return useReturnResponse(event, time, {
    ...unauthorizedError,
    field: {
      errors: {
        email: ["Onbekende combinatie"],
        wachtwoord: ["Onbekende combinatie"]
      }
    }
  })

  const session: any = await serverSupabaseSession(event)
  useSetCookies(event, session)

  return useReturnResponse(event, time, {
    meta: {
      code: 200,
      message: "OK",
      redirect: "/",
    },
  })
})
