import * as zod from "zod";
import type { Session } from "@supabase/supabase-js";

const schema = zod.object({
  email: zod.string().email(),
  wachtwoord: zod.string().min(8),
  remember: zod.boolean().optional(),
});

export default defineEventHandler(async (event) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const request = await readBody(event)

  const { error: zodError } = await schema.safeParseAsync(request);

  if (zodError) return useReturnResponse(event, {
    ...badRequestError,
    error: {
      type: "fields",
      details: zodError.errors
    }
  })

  const client = await serverSupabaseClient(event)

  const { error } = await client.auth.signInWithPassword({
    email: request.email, password: request.wachtwoord
  })

  if (error) return useReturnResponse(event, {
    ...unauthorizedError,
    error: {
      type: "fields",
      details: {
        email: ["Onbekende combinatie"],
        wachtwoord: ["Onbekende combinatie"]
      }
    }
  })

  const invite = getCookie(event, "invite_token")
  const session: Omit<Session, "user"> | null = await serverSupabaseSession(event)

  deleteCookie(event, "invite_token")
  useSetCookies(event, session)

  return useReturnResponse(event, {
    status: {
      success: true,
      redirect: invite || "/",
      message: "Ok",
      code: 200
    }
  })
})
