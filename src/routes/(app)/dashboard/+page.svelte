<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  import SiteHeader from "$lib/components/site-header.svelte";
  import Table from "./table.svelte";
  import Sheet from "./sheet.svelte";
  import UpcomingTasks from "$lib/components/upcoming-tasks.svelte";
  import DashboardTaskChart from "$lib/components/charts/dashboard-task-chart.svelte";

  let { data } = $props();
</script>

<Sidebar.Provider
  style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
>
  <AppSidebar variant="inset" />
  <Sidebar.Inset>
    <SiteHeader />
    <div class="flex flex-1 flex-col">
      <div class="@container/main p-4">
        <Sheet />
        <div class="mt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <UpcomingTasks tasks={data.tasks} />
          <DashboardTaskChart tasks={data.tasks} />
        </div>
        <Table tasks={data.tasks} />
      </div>
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>
