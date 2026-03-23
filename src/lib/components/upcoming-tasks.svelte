<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import {
    IconCalendar,
    IconClock,
    IconArrowUp,
    IconArrowDown,
    IconArrowRight,
  } from "@tabler/icons-svelte";

  let { tasks = [] } = $props();

  let upcomingTasks = $derived(
    tasks
      .filter((task) => task.status !== "done")
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      )
      .slice(0, 3),
  );

  type PriorityKey = "high" | "medium" | "low";

  const priorityConfig: Record<
    PriorityKey,
    { label: string; icon: any; color: string }
  > = {
    high: {
      label: "High",
      icon: IconArrowUp,
      color: "text-red-500 bg-red-50 dark:bg-red-950/50",
    },
    medium: {
      label: "Medium",
      icon: IconArrowRight,
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/50",
    },
    low: {
      label: "Low",
      icon: IconArrowDown,
      color: "text-blue-500 bg-blue-50 dark:bg-blue-950/50",
    },
  };
</script>

<Card.Root class="w-full max-w-md">
  <Card.Header>
    <Card.Title class="flex items-center gap-2">
      <IconClock size={20} class="text-muted-foreground" />
      Upcoming Tasks
    </Card.Title>
    <Card.Description>Your next 3 priorities.</Card.Description>
  </Card.Header>
  <Card.Content>
    <div class="flex flex-col gap-4">
      {#if upcomingTasks.length > 0}
        {#each upcomingTasks as task (task.id)}
          {@const priority = priorityConfig[task.priority as PriorityKey] || priorityConfig.low}
          <div
            class="flex items-center justify-between gap-4 rounded-lg border p-3 shadow-sm"
          >
            <div class="flex flex-col overflow-hidden">
              <span class="truncate font-semibold text-sm">{task.name}</span>
              <div
                class="flex items-center gap-1 text-xs text-muted-foreground mt-1"
              >
                <IconCalendar size={14} />
                <span>
                  {new Date(task.dueDate).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            <Badge class="{priority.color} flex items-center gap-1" variant="outline">
              <priority.icon size={14} />
              {priority.label}
            </Badge>
          </div>
        {/each}
      {:else}
        <div class="py-6 text-center text-sm text-muted-foreground">
          You're all caught up! No upcoming tasks.
        </div>
      {/if}
    </div>
  </Card.Content>
</Card.Root>
