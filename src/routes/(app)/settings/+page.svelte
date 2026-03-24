<script lang="ts">
  import ProfileSettings from "$lib/components/settings/profile-settings.svelte";
  import EmailSettings from "$lib/components/settings/email-settings.svelte";
  import SecuritySettings from "$lib/components/settings/security-settings.svelte";
    import MiscSettings from "$lib/components/settings/misc-settings.svelte";

  export let data;
</script>

<div class="mx-auto max-w-3xl space-y-8">
  <ProfileSettings user={data.user} />
  <EmailSettings user={data.user} />
  <SecuritySettings user={data.user} />
  <MiscSettings user={data.user} />
</div>
