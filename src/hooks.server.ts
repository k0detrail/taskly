import PocketBase from "pocketbase";
import { redirect, type Handle } from "@sveltejs/kit";
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.pb = new PocketBase(PUBLIC_POCKETBASE_URL);

  event.locals.pb.authStore.loadFromCookie(
    event.request.headers.get("cookie") ?? "",
  );

  try {
    if (event.locals.pb.authStore.isValid) {
      await event.locals.pb.collection("users").authRefresh();
    }
  } catch {
    event.locals.pb.authStore.clear();
  }

  const isAppRoute = event.route.id?.startsWith("/(app)");
  const isLoggedIn = event.locals.pb.authStore.isValid;

  if (isAppRoute && !isLoggedIn) {
    throw redirect(303, "/login");
  }

  if (
    (event.url.pathname === "/login" || event.url.pathname === "/signup") &&
    isLoggedIn
  ) {
    throw redirect(303, "/dashboard");
  }

  const response = await resolve(event);

  response.headers.append(
    "set-cookie",
    event.locals.pb.authStore.exportToCookie({
      httpOnly: false,
      secure: false
    }),
  );

  return response;
};
