import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
  signup: async ({ locals, request }) => {
    const data = await request.formData();

    const name = data.get("name");
    const email = data.get("email");
    const password = data.get("password");
    const passwordConfirm = data.get("passwordConfirm");

    if (!email || !password || !passwordConfirm) {
      return fail(400, { error: "Missing required fields" });
    }

    if (password !== passwordConfirm) {
      return fail(400, { error: "Passwords do not match" });
    }

    try {
      await locals.pb.collection("users").create({
        name: name?.toString(),
        email: email.toString(),
        password: password.toString(),
        passwordConfirm: passwordConfirm.toString(),
      });

      await locals.pb
        .collection("users")
        .authWithPassword(email.toString(), password.toString());
    } catch (err) {
      return fail(400, {
        error: "Signup failed (email may already be in use)",
      });
    }

    throw redirect(303, "/login");
  },
};
