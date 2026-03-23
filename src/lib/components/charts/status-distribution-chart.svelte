<script lang="ts">
  import { PieChart } from "layerchart";
  import TrendingUpIcon from "@lucide/svelte/icons/trending-up";
  import * as Chart from "$lib/components/ui/chart/index.js";
  import * as Card from "$lib/components/ui/card/index.js";

  const chartData = [
    { status: "done", count: 24, color: "var(--color-done)" },
    { status: "inProgress", count: 15, color: "var(--color-inProgress)" },
    { status: "pending", count: 10, color: "var(--color-pending)" },
  ];

  const chartConfig = {
    count: { label: "Tasks" },
    done: { label: "Done", color: "var(--chart-1)" },
    inProgress: { label: "In Progress", color: "var(--chart-2)" },
    pending: { label: "Pending", color: "var(--chart-3)" },
  } satisfies Chart.ChartConfig;
</script>

<Card.Root class="flex flex-col">
  <Card.Header class="items-center pb-0">
    <Card.Title>Status Distribution</Card.Title>
    <Card.Description>Current Task Overview</Card.Description>
  </Card.Header>
  
  <Card.Content class="flex-1 pb-0">
    <Chart.Container config={chartConfig} class="mx-auto aspect-square max-h-62.5">
      <PieChart
        data={chartData}
        key="status"
        value="count"
        label={(d) => chartConfig[d.status as keyof typeof chartConfig]?.label ?? d.status}
        cRange={chartData.map((d) => d.color)}
        props={{
          pie: {
            motion: "tween",
          },
        }}
        legend
      >
        {#snippet tooltip()}
          <Chart.Tooltip hideLabel />
        {/snippet}
      </PieChart>
    </Chart.Container>
  </Card.Content>

  <Card.Footer class="flex-col gap-2 text-sm pt-4">
    <div class="flex items-center gap-2 leading-none font-medium">
      Completion rate trending up <TrendingUpIcon class="size-4" />
    </div>
    <div class="text-muted-foreground leading-none">
      Showing the current status of all active tasks
    </div>
  </Card.Footer>
</Card.Root>
