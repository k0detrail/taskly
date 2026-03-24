import { error, fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

// helper to make sure user is logged in
const getAuthUser = (locals: App.Locals) => {
  const user = locals.pb.authStore.record;
  if (!locals.pb.authStore.isValid || !user) {
    throw error(401, "Unauthorized");
  }
  return user;
};

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.pb?.authStore?.record;

  if (!user) {
    throw redirect(303, "/login");
  }

  // TODO: use this instead
  // user: structuredClone(locals.pb.authStore.record),
  return {
    user: {
      id: user.id,
      collectionId: user.collectionId,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    },
  };
};

export const actions = {
  updateAvatar: async ({ request, locals }) => {
    const user = getAuthUser(locals);
    const data = await request.formData();
    const avatar = data.get("avatar");

    if (!(avatar instanceof File) || avatar.size === 0) {
      return fail(400, { error: "No file uploaded" });
    }

    await locals.pb.collection("users").update(user.id, { avatar });
    return { success: true };
  },

  removeAvatar: async ({ locals }) => {
    const user = getAuthUser(locals);
    await locals.pb.collection("users").update(user.id, { avatar: null });
    return { success: true };
  },

  updateName: async ({ request, locals }) => {
    const user = getAuthUser(locals);
    const data = await request.formData();
    const name = data.get("name")?.toString().trim();

    if (!name) return fail(400, { error: "Name is required" });

    await locals.pb.collection("users").update(user.id, { name });
    return { success: true };
  },

  updateUsername: async ({ request, locals }) => {
    const user = getAuthUser(locals);
    const data = await request.formData();
    const username = data.get("username")?.toString().trim();

    if (!username) return fail(400, { error: "Username is required" });

    await locals.pb.collection("users").update(user.id, { username });
    return { success: true };
  },

  updatePassword: async ({ request, locals }) => {
    const user = getAuthUser(locals);
    const data = await request.formData();
    const { oldPassword, password, passwordConfirm } = Object.fromEntries(data);

    if (!oldPassword || !password || password !== passwordConfirm) {
      return fail(400, { error: "Invalid password data" });
    }

    await locals.pb.collection("users").update(user.id, {
      oldPassword,
      password,
      passwordConfirm,
    });

    await locals.pb
      .collection("users")
      .authWithPassword(user.email, password.toString());

    return { success: true };
  },

  deleteAccount: async ({ locals }) => {
    const user = getAuthUser(locals);

    try {
      await locals.pb.collection("users").delete(user.id);

      locals.pb.authStore.clear();
    } catch (err) {
      return fail(500, {
        error: "Something went wrong deleting your account.",
      });
    }

    throw redirect(303, "/");
  },
};
