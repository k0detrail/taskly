<script lang="ts">
  import { enhance } from "$app/forms";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Table from "$lib/components/ui/table/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { Button } from "$lib/components/ui/button/index.js";

  import {
    IconCalendar,
    IconProgress,
    IconProgressBolt,
    IconProgressCheck,
    IconTextCaption,
    IconTextColor,
    IconArrowUp,
    IconArrowDown,
    IconArrowRight,
    IconDots,
    IconCopy,
    IconPencil,
    IconTrash,
  } from "@tabler/icons-svelte";
  import Sheet from "./sheet.svelte";

  type StatusKey = "pending" | "inProgress" | "done";
  type PriorityKey = "high" | "medium" | "low";

  interface ConfigItem {
    label: string;
    icon: any;
    color: string;
  }

  const columns = [
    { label: "Title", icon: IconTextColor },
    { label: "Description", icon: IconTextCaption },
    { label: "Status", icon: IconProgress },
    { label: "Priority", icon: IconProgressCheck },
    { label: "Due Date", icon: IconCalendar },
  ];

  const statusConfig: Record<StatusKey, ConfigItem> = {
    pending: {
      label: "Pending",
      icon: IconProgress,
      color: "text-red-500 bg-red-50 dark:bg-red-950/50",
    },
    inProgress: {
      label: "In Progress",
      icon: IconProgressBolt,
      color: "text-blue-500 bg-blue-50 dark:bg-blue-950/50",
    },
    done: {
      label: "Done",
      icon: IconProgressCheck,
      color: "text-green-500 bg-green-50 dark:bg-green-950/50",
    },
  };

  const priorityConfig: Record<PriorityKey, ConfigItem> = {
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

  let { tasks = [] } = $props();
  let isEditDialogOpen = $state(false);
  let taskToEdit = $state<any>(null);

  function handleEdit(task: any) {
    taskToEdit = task;
    isEditDialogOpen = true;
  }
</script>

<h1 class="font-bold p-2">Tasks</h1>
<Card.Root>
  <Card.Content class="-m-6">
    <Table.Root>
      <Table.Header>
        <Table.Row>
          {#each columns as column}
            <Table.Head>
              <div class="flex items-center gap-2">
                <column.icon size="18px" />
                {column.label}
              </div>
            </Table.Head>
          {/each}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#each tasks as task (task.id)}
          {@const status =
            statusConfig[task.status as StatusKey] || statusConfig.pending}
          {@const priority =
            priorityConfig[task.priority as PriorityKey] || priorityConfig.low}
          <Table.Row>
            <Table.Cell class="font-bold">{task.name}</Table.Cell>
            <Table.Cell class="max-w-75 truncate">
              {task.descriptionSnippet}
            </Table.Cell>
            <Table.Cell>
              <Badge class={status.color} variant="outline">
                <status.icon size={14} />
                {status.label}
              </Badge>
            </Table.Cell>

            <Table.Cell>
              <Badge class={priority.color} variant="outline">
                <priority.icon size={14} />
                {priority.label}
              </Badge>
            </Table.Cell>
            <Table.Cell>
              {new Date(task.dueDate).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </Table.Cell>

            <!-- actions -->
            <Table.Cell>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  {#snippet child({ props })}
                    <Button {...props} variant="ghost" size="icon">
                      <IconDots size={20} />
                      <span class="sr-only">Open menu</span>
                    </Button>
                  {/snippet}
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end">
                  <DropdownMenu.Group>
                    <!-- duplicate -->
                    <DropdownMenu.Item
                      onclick={() => console.log("Duplicate", task.id)}
                    >
                      <IconCopy class="mr-2 size-4" /> Duplicate
                    </DropdownMenu.Item>
                    <!-- edit -->
                    <DropdownMenu.Item onclick={() => handleEdit(task)}>
                      <IconPencil class="mr-2 size-4" /> Edit
                    </DropdownMenu.Item>
                    {#if isEditDialogOpen}
                      <Sheet
                        bind:open={isEditDialogOpen}
                        editingTask={taskToEdit}
                      />
                    {/if}
                    <!-- delete -->
                    <form method="POST" action="?/deleteTask" use:enhance>
                      <input type="hidden" name="id" value={task.id} />

                      <DropdownMenu.Item class="p-0">
                        {#snippet child({ props })}
                          <button
                            {...props}
                            type="submit"
                            class="flex w-full items-center px-2 py-1.5 text-sm text-red-600 outline-none hover:bg-red-50 focus:bg-red-50"
                            onclick={(e) => {
                              if (!confirm("Delete this task?")) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <IconTrash class="mr-2 size-4" />
                            Delete
                          </button>
                        {/snippet}
                      </DropdownMenu.Item>
                    </form>
                  </DropdownMenu.Group>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </Table.Cell>
          </Table.Row>
        {:else}
          <Table.Row>
            <Table.Cell
              colspan={5}
              class="text-center py-10 text-muted-foreground"
            >
              No tasks found. Create one to get started!
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </Card.Content>
</Card.Root>

<style>
  :global(th),
  :global(td) {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
</style>
