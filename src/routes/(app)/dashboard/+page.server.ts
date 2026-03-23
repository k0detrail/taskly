import { error, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  // 1. get the current authenticated user
  const user = locals.pb.authStore.record;

  // if no user is logged in, return empty
  if (!user) {
    return { tasks: [] };
  }

  try {
    // 2. fetch tasks where the user is the owner
    const tasks = await locals.pb.collection("tasks").getFullList({
      filter: `user = "${user.id}"`,
      sort: "-created",
    });

    // 3. format the data for the ui
    const formattedTasks = tasks.map((task) => {
      return {
        id: task.id,
        name: task.name,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        descriptionSnippet: task.description
          ? task.description.substring(0, 100) +
          (task.description.length > 100 ? "..." : "")
          : "No description provided",
        url: task.url,
        created: task.created,
      };
    });

    return {
      tasks: formattedTasks,
    };
  } catch (err) {
    console.error("Error fetching tasks:", err);
    throw error(500, "Could not fetch tasks");
  }
};

export const actions: Actions = {
  createTask: async ({ request, locals }) => {
    const user = locals.pb.authStore.record;
    const data = await request.formData();

    if (!user) {
      throw error(401, "Unauthorized");
    }

    console.log("Hit action!")

    const name = data.get("name") as string;
    const description = data.get("description") as string;
    const status = data.get("status") as string;
    const priority = data.get("priority") as string;
    const dueDateStr = data.get("dueDate") as string;
    const dueTimeStr = data.get("dueTime") as string;

    // validation: "name" is the only required text field
    if (!name || name.trim().length === 0) {
      return fail(400, {
        error: "Task name cannot be empty",
        values: { name, description },
      });
    }

    const taskData = {
      user: user.id,
      name: name,
      description: description || "",
      status: status || "pending",
      priority: priority || "low",
      dueDate: dueDateStr
        ? new Date(`${dueDateStr} ${dueTimeStr || "00:00"}`).toISOString()
        : null,
    };

    try {
      await locals.pb.collection("tasks").create(taskData);
    } catch (err: any) {
      console.error("PocketBase error:", err.taskData);
      return fail(err.status || 500, {
        error: err.message || "Failed to create task",
      });
    }

    return { success: true };
  },

  updateTask: async ({ request, locals }) => {
    const user = locals.pb.authStore.record;
    const data = await request.formData();

    if (!user) throw error(401, "Unauthorized");

    const id = data.get("id") as string;
    const taskData = {
      name: data.get("name"),
      description: data.get("description"),
      status: data.get("status"),
      priority: data.get("priority"),
      dueDate: data.get("dueDate")
        ? new Date(`${data.get("dueDate")} ${data.get("dueTime")}`).toISOString()
        : null,
    };

    try {
      await locals.pb.collection("tasks").update(id, taskData);
      return { success: true };
    } catch (err) {
      return fail(500, { error: "Failed to update task" });
    }
  },

  deleteTask: async ({ request, locals }) => {
    const user = locals.pb.authStore.record;
    if (!user) throw error(401, "Unauthorized");

    const data = await request.formData();
    const id = data.get("id") as string;

    try {
      await locals.pb.collection("tasks").delete(id);
      return { success: true };
    } catch (err) {
      return fail(500, { error: "Failed to delete task" });
    }
  }
};
