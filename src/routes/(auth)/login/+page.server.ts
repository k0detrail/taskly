import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
  login: async ({ request, locals }) => {
    const data = await request.formData();
    const email = data.get("email")?.toString();
    const password = data.get("password")?.toString();

    if (!email || !password) {
      return fail(400, { error: "Please enter both email and password." });
    }

    try {
      await locals.pb.collection("users").authWithPassword(email, password);
    } catch (err: any) {
      if (err.isAbort) return fail(500, { error: "Request was cancelled." });
      
      if (err.status === 400 || err.status === 401) {
        return fail(401, { error: "Invalid email or password." });
      }

      return fail(500, { error: "Authentication server is currently unreachable." });
    }

    throw redirect(303, "/dashboard");
  },
};
