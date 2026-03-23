<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";

  let { open = $bindable(false) } = $props();

  let name = $state("");
  let oldPassword = $state("");
  let newPassword = $state("");
  let passwordConfirm = $state("");

  async function handleUpdateName(e: Event) {
    e.preventDefault();
    console.log("Updating name to:", name);
  }

  async function handleUpdatePassword(e: Event) {
    e.preventDefault();
    console.log("Updating password");
  }

  async function handleDeleteAccount() {
    const confirm = window.confirm("Are you absolutely sure? This cannot be undone.");
    if (confirm) {
      console.log("Account deleted");
    }
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Content class="sm:max-w-106.25 max-h-[85vh] overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title>Settings</Dialog.Title>
      <Dialog.Description>
        Manage your account profile and security preferences.
      </Dialog.Description>
    </Dialog.Header>

    <div class="flex flex-col gap-6 py-4">
      
      <form onsubmit={handleUpdateName} class="flex flex-col gap-3">
        <h4 class="text-sm font-semibold leading-none">Profile</h4>
        <div class="grid gap-2">
          <Label for="name">Display Name</Label>
          <Input id="name" bind:value={name} placeholder="Enter your name" required />
        </div>
        <Button type="submit" variant="secondary" class="w-full sm:w-auto self-start">
          Save Name
        </Button>
      </form>

      <div class="h-px bg-border w-full"></div>

      <form onsubmit={handleUpdatePassword} class="flex flex-col gap-3">
        <h4 class="text-sm font-semibold leading-none">Change Password</h4>
        <div class="grid gap-2">
          <Label for="old-password">Current Password</Label>
          <Input id="old-password" type="password" bind:value={oldPassword} required />
        </div>
        <div class="grid gap-2">
          <Label for="new-password">New Password</Label>
          <Input id="new-password" type="password" bind:value={newPassword} minlength={8} required />
        </div>
        <div class="grid gap-2">
          <Label for="confirm-password">Confirm New Password</Label>
          <Input id="confirm-password" type="password" bind:value={passwordConfirm} minlength={8} required />
        </div>
        <Button type="submit" variant="secondary" class="w-full sm:w-auto self-start">
          Update Password
        </Button>
      </form>

      <div class="h-px bg-border w-full"></div>

      <div class="flex flex-col gap-3">
        <h4 class="text-sm font-semibold text-destructive leading-none">Danger Zone</h4>
        <p class="text-sm text-muted-foreground">
          Permanently delete your account and remove all data from our servers.
        </p>
        <Button type="button" variant="destructive" onclick={handleDeleteAccount} class="w-full sm:w-auto self-start">
          Delete Account
        </Button>
      </div>

    </div>
  </Dialog.Content>
</Dialog.Root>
