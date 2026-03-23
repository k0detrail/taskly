<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Chart from "$lib/components/ui/chart/index.js";
  import { scaleBand } from "d3-scale";
  import { BarChart, Highlight, type ChartContextValue } from "layerchart";
  import AlertTriangleIcon from "@lucide/svelte/icons/alert-triangle";
  import { cubicInOut } from "svelte/easing";

  const chartData = [
    { priority: "High", pending: 15, inProgress: 4 },
    { priority: "Medium", pending: 8, inProgress: 12 },
    { priority: "Low", pending: 22, inProgress: 3 },
  ];

  const chartConfig = {
    pending: { label: "Pending", color: "var(--chart-1)" },
    inProgress: { label: "In Progress", color: "var(--chart-2)" },
  } satisfies Chart.ChartConfig;

  let context = $state<ChartContextValue>();
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>The Bottleneck Finder</Card.Title>
    <Card.Description>Active tasks by priority level</Card.Description>
  </Card.Header>
  <Card.Content>
    <Chart.Container config={chartConfig} class="h-62.5 w-full">
      <BarChart
        bind:context
        data={chartData}
        xScale={scaleBand().padding(0.25)}
        x="priority"
        axis="x"
        rule={false}
        series={[
          {
            key: "pending",
            label: "Pending",
            color: chartConfig.pending.color,
            props: { rounded: "bottom" },
          },
          {
            key: "inProgress",
            label: "In Progress",
            color: chartConfig.inProgress.color,
            props: { rounded: "top" }, 
          },
        ]}
        seriesLayout="stack"
        props={{
          bars: {
            stroke: "none",
            initialY: context?.height,
            initialHeight: 0,
            motion: {
              y: { type: "tween", duration: 500, easing: cubicInOut },
              height: { type: "tween", duration: 500, easing: cubicInOut },
            },
          },
          highlight: { area: false },
          xAxis: { format: (d) => d }, 
        }}
        legend
      >
        {#snippet belowMarks()}
          <Highlight area={{ class: "fill-muted" }} />
        {/snippet}

        {#snippet tooltip()}
          <Chart.Tooltip />
        {/snippet}
      </BarChart>
    </Chart.Container>
  </Card.Content>
  <Card.Footer>
    <div class="flex w-full items-start gap-2 text-sm">
      <div class="grid gap-2">
        <div class="flex items-center gap-2 leading-none font-medium text-amber-500">
          Warning: 15 High Priority tasks are Pending <AlertTriangleIcon class="size-4" />
        </div>
        <div class="text-muted-foreground flex items-center gap-2 leading-none">
          Focus on moving High Priority work to "In Progress"
        </div>
      </div>
    </div>
  </Card.Footer>
</Card.Root>
