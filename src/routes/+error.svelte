<script lang="ts">
  import { page } from "$app/stores";
  import * as Empty from "$lib/components/ui/empty/index.js";
  import * as InputGroup from "$lib/components/ui/input-group/index.js";
  import SearchIcon from "@lucide/svelte/icons/search";
</script>

{#if $page.error}
  {#if $page.status === 404}
    <Empty.Root>
      <Empty.Header>
        <Empty.Title>404 - Not Found</Empty.Title>
        <Empty.Description>
          The page you're looking for doesn't exist. Try searching for what you
          need below.
        </Empty.Description>
      </Empty.Header>
      <Empty.Content>
        <InputGroup.Root class="sm:w-3/4">
          <InputGroup.Input placeholder="Try searching for pages..." />
          <InputGroup.Addon>
            <SearchIcon />
          </InputGroup.Addon>
          <InputGroup.Addon align="inline-end"></InputGroup.Addon>
        </InputGroup.Root>
      </Empty.Content>
    </Empty.Root>
  {:else}
    <div>
      <h1>Oops! Something went wrong</h1>
      <p>Status: {$page.status}</p>
      <p>Message: {$page.error.message}</p>
    </div>
  {/if}
{/if}
