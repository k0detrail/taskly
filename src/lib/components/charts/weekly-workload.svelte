<script lang="ts">
  import { LineChart } from "layerchart";
  import TrendingUpIcon from "@lucide/svelte/icons/trending-up";
  import { curveLinearClosed } from "d3-shape";
  import { scaleBand } from "d3-scale";
  import * as Chart from "$lib/components/ui/chart/index.js";
  import * as Card from "$lib/components/ui/card/index.js";

  const chartData = [
    { day: "Monday", tasks: 4 },
    { day: "Tuesday", tasks: 7 },
    { day: "Wednesday", tasks: 2 },
    { day: "Thursday", tasks: 8 },
    { day: "Friday", tasks: 5 },
    { day: "Saturday", tasks: 1 },
  ];

  const chartConfig = {
    tasks: { label: "Tasks Due", color: "var(--chart-1)" },
  } satisfies Chart.ChartConfig;
</script>

<Card.Root>
  <Card.Header class="items-center pb-0">
    <Card.Title>Weekly Workload Radar</Card.Title>
    <Card.Description>Tasks due over the next 6 days</Card.Description>
  </Card.Header>
  
  <Card.Content class="flex-1 pb-0">
    <Chart.Container config={chartConfig} class="mx-auto aspect-square max-h-62.5">
      <LineChart
        data={chartData}
        series={[
          {
            key: "tasks",
            label: "Tasks Due",
            color: chartConfig.tasks.color,
          },
        ]}
        radial
        x="day"
        xScale={scaleBand()}
        points={{ r: 4 }}
        padding={12}
        props={{
          spline: {
            curve: curveLinearClosed,
            fill: "var(--color-tasks)",
            fillOpacity: 0.6,
            stroke: "0",
            motion: "tween",
          },
          xAxis: {
            tickLength: 0,
          },
          yAxis: {
            format: () => "",
          },
          grid: {
            radialY: "linear",
          },
          tooltip: {
            context: {
              mode: "voronoi",
            },
          },
          highlight: {
            lines: false,
            points: false,
          },
        }}
      >
        {#snippet tooltip()}
          <Chart.Tooltip />
        {/snippet}
      </LineChart>
    </Chart.Container>
  </Card.Content>

  <Card.Footer class="flex-col gap-2 text-sm pt-4">
    <div class="flex items-center gap-2 leading-none font-medium">
      Thursday is your busiest upcoming day <TrendingUpIcon class="size-4" />
    </div>
    <div class="text-muted-foreground flex items-center gap-2 leading-none">
      Based on pending and in-progress deadlines
    </div>
  </Card.Footer>
</Card.Root>
