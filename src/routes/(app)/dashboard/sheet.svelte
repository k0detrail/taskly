<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";
  import { enhance } from "$app/forms";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { toast } from "svelte-sonner";

  import Calendar from "$lib/components/ui/calendar/calendar.svelte";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
  import { parseDate, getLocalTimeZone } from "@internationalized/date";
  import type { CalendarDate } from "@internationalized/date";

  interface Task {
    id: string;
    name: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string;
  }

  const id = $props.id();
  const isDesktop = new MediaQuery("(min-width: 768px)");

  let {
    editingTask = null,
    open = $bindable(false),
  }: { editingTask?: Task | null; open: boolean } = $props();
  let isSubmitting = $state(false);

  let name = $state(editingTask?.name ?? "");
  let description = $state(editingTask?.description ?? "");
  let selectedStatus = $state(editingTask?.status ?? "pending");
  let selectedPriority = $state(editingTask?.priority ?? "medium");
  let calendarValue = $state<CalendarDate | undefined>();

  function getInitialDate(dateStr: string | undefined) {
    if (!dateStr) return undefined;
    try {
      // Split by 'T' or space to get only the 'YYYY-MM-DD' part
      const dateOnly = dateStr.split(/[T ]/)[0]; 
      return parseDate(dateOnly);
    } catch (e) {
      console.error("Date parsing failed", e);
      return undefined;
    }
  }

  let dateValue = $state(getInitialDate(editingTask?.dueDate));

  let timeValue = $state(
    editingTask?.dueDate 
      ? new Date(editingTask.dueDate).toLocaleTimeString('en-GB', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }) 
      : "12:00"
  );

  // state for date and time
  let popoverOpen = $state(false);

  let fullDueDate = $derived.by(() => {
    if (!dateValue) return "Not set";
    return `${dateValue.toString()} at ${timeValue}`;
  });

  const statuses = [
    { value: "pending", label: "Pending" },
    { value: "inProgress", label: "In Progress" },
    { value: "done", label: "Done" },
  ];

  const priorities = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  const statusLabel = $derived(
    statuses.find((s) => s.value === selectedStatus)?.label,
  );
  const priorityLabel = $derived(
    priorities.find((p) => p.value === selectedPriority)?.label,
  );
</script>

{#snippet taskForm()}
  <form
    method="POST"
    action={editingTask ? "?/updateTask" : "?/createTask"}
    class="grid items-start gap-4"
    use:enhance={() => {
      isSubmitting = true;
      return async ({ result }) => {
        if (result.type === "success") {
          toast.success(editingTask ? "Task updated!" : "Task created!");
          open = false;
        }
        isSubmitting = false;
      };
    }}
  >
    {#if editingTask}
      <input type="hidden" name="id" value={editingTask.id} />
    {/if}
    <div class="grid gap-2">
      <Label for="task-{id}">Task</Label>
      <Input
        name="name"
        type="text"
        bind:value={name}
        placeholder="What needs to be done?"
      />
    </div>
    <div class="grid gap-2">
      <Label for="desc-{id}">Description</Label>
      <Input
        name="description"
        bind:value={description}
        placeholder="Add more details..."
      />
    </div>
    <div class="flex gap-4">
      <div class="grid gap-2 w-full">
        <Label>Status</Label>
        <Select.Root type="single" bind:value={selectedStatus}>
          <input type="hidden" name="status" value={selectedStatus} />
          <Select.Trigger class="w-full">
            {statusLabel}
          </Select.Trigger>
          <Select.Content>
            {#each statuses as s}
              <Select.Item value={s.value}>{s.label}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>

      <div class="grid gap-2 w-full">
        <Label>Priority</Label>
        <Select.Root type="single" bind:value={selectedPriority}>
          <input type="hidden" name="priority" value={selectedPriority} />
          <Select.Trigger class="w-full">
            {priorityLabel}
          </Select.Trigger>
          <Select.Content>
            {#each priorities as p}
              <Select.Item value={p.value}>{p.label}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>
    </div>

    <!-- date and time -->
    <div class="grid gap-2 w-full">
      <Label>Due Date</Label>
      <div class="flex items-center gap-2">
        <input
          type="hidden"
          name="dueDate"
          value={dateValue?.toString() || ""}
        />
        <input type="hidden" name="dueTime" value={timeValue || ""} />
        <Popover.Root bind:open={popoverOpen}>
          <Popover.Trigger>
            {#snippet child({ props })}
              <Button
                {...props}
                variant="outline"
                class="justify-between text-left font-normal"
              >
                {dateValue
                  ? dateValue.toDate(getLocalTimeZone()).toLocaleDateString()
                  : "Pick a date"}
                <ChevronDownIcon class="ml-2 h-4 w-4 opacity-50" />
              </Button>
            {/snippet}
          </Popover.Trigger>
          <Popover.Content class="w-auto p-0" align="start">
            <Calendar
              type="single"
              bind:value={dateValue}
              onValueChange={() => (popoverOpen = false)}
              captionLayout="dropdown"
            />
          </Popover.Content>
        </Popover.Root>

        <Input type="time" bind:value={timeValue} class="w-30" />
      </div>
    </div>

    <Button type="submit" disabled={isSubmitting}>
      {editingTask ? "Update Task" : "Create Task"}
    </Button>
  </form>
{/snippet}

{#if isDesktop.current}
  <Dialog.Root bind:open>
    <Dialog.Trigger class={buttonVariants({ variant: "outline" })}
      >New Task</Dialog.Trigger
    >
    <Dialog.Content class="sm:max-w-106.25">
      {@render taskForm()}
    </Dialog.Content>
  </Dialog.Root>
{:else}
  <Drawer.Root bind:open>
    <Drawer.Trigger class={buttonVariants({ variant: "outline" })}
      >New Task</Drawer.Trigger
    >
    <Drawer.Content class="p-5">
      {@render taskForm()}
    </Drawer.Content>
  </Drawer.Root>
{/if}
