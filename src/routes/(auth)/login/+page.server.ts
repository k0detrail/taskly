import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
  login: async ({ request, locals }) => {
    const data = await request.formData();

    const email = data.get("email");
    const password = data.get("password");

    if (!email || !password) {
      return fail(400, { error: "Missing email or password" });
    }

    try {
      await locals.pb
        .collection("users")
        .authWithPassword(email.toString(), password.toString());
    } catch {
      return fail(401, { error: "Invalid credentials" });
    }

    throw redirect(303, "/dashboard");
  },
};
