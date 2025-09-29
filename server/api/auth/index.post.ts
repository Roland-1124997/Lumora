import * as zod from "zod";
import type { Session } from "@supabase/supabase-js";

const schema = zod.object({
  email: zod.string({ message: "This field is required" }).nonempty({ message: "This field is required" }).email({ message: "Must be a valid email" }),
  password: zod.string({ message: "This field is required" }).nonempty({ message: "This field is required" }).min(8, { message: "Must be at least 8 characters long" }),
  remember: zod.boolean().optional(),
})

export default defineEventHandler(async (event) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const request = await readBody(event);
  const { error: zodError } = await schema.safeParseAsync(request);

  if (zodError) return useReturnResponse(event, {
    ...badRequestError,
    error: {
      type: "fields",
      details: zodError.errors
    }
  });

  /*
  ************************************************************************************
  */

  const client = await serverSupabaseClient(event);
  const server = serverSupabaseServiceRole(event)

  const { data, error } = await client.auth.signInWithPassword({
    email: request.email, password: request.password
  });

  if (error) return useReturnResponse(event, {
    ...unauthorizedError,
    error: {
      type: "fields",
      details: {
        email: ["Unknown combination"],
        password: ["Unknown combination"]
      }
    }
  });

  if (data.user.factors) {

    const session: Omit<Session, "user"> | null = await serverSupabaseSession(event);

    useSetCookies(event, session);
    deleteCookie(event, "opt-verified")

    await server.from("factor_sessions").insert({
      user_id: data.user.id,
    })

    return useReturnResponse(event, {
      status: {
        success: true,
        redirect: "/auth/totp",
        message: "Ok",
        code: 200
      }
    });
  }

  /*
  ************************************************************************************
  */

  await server.rpc("track_monthly_user", {
    uid: data.user?.id,
  });

  const invite = getCookie(event, "invite_token");
  const session: Omit<Session, "user"> | null = await serverSupabaseSession(event);

  deleteCookie(event, "invite_token");
  useSetCookies(event, session);

  return useReturnResponse(event, {
    status: {
      success: true,
      redirect: invite || "/",
      message: "Ok",
      code: 200
    }
  });
});
