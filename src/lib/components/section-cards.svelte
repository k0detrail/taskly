<script lang="ts">
  import WeeklyWorkload from "./charts/weekly-workload.svelte";
  import StatusDistributionChart from "./charts/status-distribution-chart.svelte";
  import BottleneckFinder from "./charts/bottleneck-finder.svelte";
</script>

<div
  class="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4"
>
  <WeeklyWorkload />
  <StatusDistributionChart />
  <BottleneckFinder />
</div>
