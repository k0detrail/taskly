<script lang="ts">
  import ChartBarIcon from "@tabler/icons-svelte/icons/chart-bar";
  import DashboardIcon from "@tabler/icons-svelte/icons/dashboard";
  import HelpIcon from "@tabler/icons-svelte/icons/help";
  import Checklist from "@tabler/icons-svelte/icons/checklist";
  import SettingsIcon from "@tabler/icons-svelte/icons/settings";
  import NavMain from "./nav-main.svelte";
  import NavSecondary from "./nav-secondary.svelte";
  import NavUser from "./nav-user.svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import type { ComponentProps } from "svelte";

  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: DashboardIcon,
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: ChartBarIcon,
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "/settings",
        icon: SettingsIcon,
      },
      {
        title: "Get Help",
        url: "/help",
        icon: HelpIcon,
      },
    ],
  };

  let { ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root collapsible="offcanvas" {...restProps}>
  <!-- header -->
  <Sidebar.Header>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton class="data-[slot=sidebar-menu-button]:p-1.5!">
          {#snippet child({ props })}
            <a href="/dashboard" {...props}>
              <Checklist class="size-5!" />
              <span class="text-base font-semibold">Taskly</span>
            </a>
          {/snippet}
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Header>

  <!-- content -->
  <Sidebar.Content>
    <NavMain items={data.navMain} />
    <NavSecondary items={data.navSecondary} class="mt-auto" />
  </Sidebar.Content>

  <!-- footer -->
  <Sidebar.Footer>
    <NavUser user={data.user} />
  </Sidebar.Footer>
</Sidebar.Root>
