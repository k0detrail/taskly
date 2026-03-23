<script lang="ts">
  import * as Chart from "$lib/components/ui/chart/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { scaleUtc } from "d3-scale";
  import { LineChart } from "layerchart";
  import { curveNatural } from "d3-shape";

  const chartData = [
    { date: new Date("2024-05-01"), high: 4, medium: 2, low: 5 },
    { date: new Date("2024-05-02"), high: 1, medium: 5, low: 2 },
    { date: new Date("2024-05-03"), high: 6, medium: 1, low: 1 },
    { date: new Date("2024-05-04"), high: 2, medium: 3, low: 4 },
    { date: new Date("2024-05-05"), high: 0, medium: 7, low: 2 },
    { date: new Date("2024-05-06"), high: 5, medium: 2, low: 1 },
    { date: new Date("2024-05-07"), high: 1, medium: 4, low: 6 },
    { date: new Date("2024-05-08"), high: 3, medium: 3, low: 3 },
    { date: new Date("2024-05-09"), high: 7, medium: 0, low: 2 },
    { date: new Date("2024-05-10"), high: 2, medium: 5, low: 1 },
    { date: new Date("2024-05-11"), high: 0, medium: 2, low: 8 },
    { date: new Date("2024-05-12"), high: 1, medium: 1, low: 3 },
    { date: new Date("2024-05-13"), high: 4, medium: 4, low: 0 },
    { date: new Date("2024-05-14"), high: 2, medium: 6, low: 1 },
  ];

  const chartConfig = {
    tasks: { label: "Tasks", color: "" },
    high: { label: "High Priority", color: "var(--chart-1)" },
    medium: { label: "Medium", color: "var(--chart-2)" },
    low: { label: "Low", color: "var(--chart-3)" },
  } satisfies Chart.ChartConfig;

  let activeChart = $state<keyof typeof chartConfig>("high");

  const total = $derived({
    high: chartData.reduce((acc, curr) => acc + curr.high, 0),
    medium: chartData.reduce((acc, curr) => acc + curr.medium, 0),
    low: chartData.reduce((acc, curr) => acc + curr.low, 0),
  });

  const activeSeries = $derived([
    {
      key: activeChart,
      label: chartConfig[activeChart].label,
      color: chartConfig[activeChart].color,
    },
  ]);
</script>

<Card.Root>
  <Card.Header
    class="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row"
  >
    <div class="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
      <Card.Title>Workload Intensity</Card.Title>
      <Card.Description>Upcoming tasks categorized by priority</Card.Description
      >
    </div>
    <div class="flex">
      {#each ["high", "medium", "low"] as key (key)}
        {@const chart = key as keyof typeof chartConfig}
        <button
          data-active={activeChart === chart}
          class="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-start even:border-s sm:border-s sm:border-t-0 sm:px-8 sm:py-6 transition-colors hover:bg-muted/25"
          onclick={() => (activeChart = chart)}
        >
          <span class="text-muted-foreground text-xs uppercase tracking-wider">
            {chartConfig[chart].label}
          </span>
          <span class="text-lg leading-none font-bold sm:text-3xl">
            {total[key as keyof typeof total].toLocaleString()}
          </span>
        </button>
      {/each}
    </div>
  </Card.Header>

  <Card.Content class="px-2 sm:p-6">
    <Chart.Container config={chartConfig} class="aspect-auto h-62.5 w-full">
      <LineChart
        data={chartData}
        x="date"
        xScale={scaleUtc()}
        axis="x"
        series={activeSeries}
        props={{
          spline: { curve: curveNatural, motion: "tween", strokeWidth: 3 },
          xAxis: {
            format: (v: Date) => {
              return v.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            },
          },
          highlight: { points: { r: 5 } },
        }}
      >
        {#snippet tooltip()}
          <Chart.Tooltip hideLabel />
        {/snippet}
      </LineChart>
    </Chart.Container>
  </Card.Content>
</Card.Root>
