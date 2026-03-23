<script lang="ts">
  import "./layout.css";
  import { ModeWatcher } from "mode-watcher";
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  import favicon from "$lib/assets/favicon.svg";

  let { children } = $props();
</script>

<ModeWatcher />
<Toaster position="top-center"/>
<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
