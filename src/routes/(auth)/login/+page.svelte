<script lang="ts">
  import type { ActionData } from "./$types";
  import LoginForm from "$lib/components/auth/login-form.svelte";

  let { form }: { form: ActionData } = $props();
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
  <LoginForm {form} />
</div>
