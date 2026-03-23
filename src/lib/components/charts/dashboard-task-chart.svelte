<script lang="ts">
  import TrendingUpIcon from "@lucide/svelte/icons/trending-up";
  import * as Chart from "$lib/components/ui/chart/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { PieChart, Text } from "layerchart";

  let { tasks = [] } = $props();

  let chartData = $derived([
    { status: "pending", count: tasks.filter((t: any) => t.status === 'pending').length, color: "var(--color-pending)" },
    { status: "inProgress", count: tasks.filter((t: any) => t.status === 'inProgress').length, color: "var(--color-inProgress)" },
    { status: "done", count: tasks.filter((t: any) => t.status === 'done').length, color: "var(--color-done)" },
  ].filter(item => item.count > 0)); // Hide empty slices

  const chartConfig = {
    count: { label: "Tasks" },
    pending: { label: "Pending", color: "var(--chart-1)" },
    inProgress: { label: "In Progress", color: "var(--chart-2)" },
    done: { label: "Done", color: "var(--chart-3)" },
  } satisfies Chart.ChartConfig;

  let totalTasks = $derived(tasks.length);
</script>

<Card.Root class="flex flex-col w-full">
  <Card.Header class="items-center">
    <Card.Title>Task Status</Card.Title>
    <Card.Description>Current Breakdown</Card.Description>
  </Card.Header>
  <Card.Content class="flex-1">
    <Chart.Container config={chartConfig} class="mx-auto aspect-square max-h-62.5">
      <PieChart
        data={chartData}
        key="status"
        value="count"
        c="color"
        innerRadius={60}
        padding={28}
        props={{ pie: { motion: "tween" } }}
      >
        {#snippet aboveMarks()}
          <Text
            value={String(totalTasks)}
            textAnchor="middle"
            verticalAnchor="middle"
            class="fill-foreground text-3xl! font-bold"
            dy={3}
          />
          <Text
            value="Tasks"
            textAnchor="middle"
            verticalAnchor="middle"
            class="fill-muted-foreground! text-muted-foreground"
            dy={22}
          />
        {/snippet}
        {#snippet tooltip()}
          <Chart.Tooltip hideLabel />
        {/snippet}
      </PieChart>
    </Chart.Container>
  </Card.Content>
  <Card.Footer class="flex-col gap-2 text-sm">
    <div class="flex items-center gap-2 leading-none font-medium">
      Keep up the good work! <TrendingUpIcon class="size-4" />
    </div>
    <div class="text-muted-foreground leading-none">
      Showing all active and completed tasks
    </div>
  </Card.Footer>
</Card.Root>
