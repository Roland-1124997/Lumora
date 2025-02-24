import * as zod from "zod";
import { serverSupabaseClient, serverSupabaseSession } from "#supabase/server";
import type { Session } from "@supabase/supabase-js";

const schema = zod.object({
  email: zod.string().email(),
  wachtwoord: zod.string().min(8),
  remember: zod.boolean().optional(),
});

export default defineEventHandler(async (event) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const time = Date.now();
  const request = await readBody(event)

  const { error: zodError } = await schema.safeParseAsync(request);

  if (zodError) return useReturnResponse(event, time, {
    ...badRequestError,
    errors: {
      field: zodError.errors,
    }
  })

  const client = await serverSupabaseClient(event)

  const { error } = await client.auth.signInWithPassword({
    email: request.email, password: request.wachtwoord
  })

  if (error) return useReturnResponse(event, time, {
    ...unauthorizedError,
    errors: {
      field: {
        email: ["Onbekende combinatie"],
        wachtwoord: ["Onbekende combinatie"]
      }
    }
  })

  const session: Omit<Session, "user"> | null = await serverSupabaseSession(event)
  useSetCookies(event, session)

  return useReturnResponse(event, time, {
    meta: {
      code: 200,
      message: "OK",
      redirect: "/",
    },
  })
})
