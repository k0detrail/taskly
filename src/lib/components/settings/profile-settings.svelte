<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import * as Card from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";

  import { getAvatarUrl, getFallback } from "$lib/utils";

  const currentUser = $derived(page.data.user);

  import { page } from "$app/state";
  import { enhance } from "$app/forms";
  import { toast } from "svelte-sonner";

  let { user } = $props();

  let editingName = $state(false);
  let editingUsername = $state(false);
  // svelte-ignore state_referenced_locally
  let nameValue = $state(user?.name ?? "");
  // svelte-ignore state_referenced_locally
  let usernameValue = $state(user?.username ?? "");
  let uploading = $state(false);

  $effect(() => {
    if (!editingName) nameValue = user?.name ?? "";
    if (!editingUsername) usernameValue = user?.username ?? "";
  });

  function toggleNameEdit() {
    editingName = !editingName;
    if (!editingName) {
      nameValue = user?.name ?? "";
    }
  }

  function toggleUsernameEdit() {
    editingUsername = !editingUsername;
    if (!editingUsername) {
      usernameValue = currentUser?.username ?? "";
    }
  }
</script>

<Card.Root class="max-w-md mx-auto my-4">
  <Card.Header>
    <Card.Title>Profile</Card.Title>
    <Card.Description>
      Update your profile information and avatar.
    </Card.Description>
  </Card.Header>

  <Card.Content class="space-y-6">
    <div class="flex items-center gap-4">
      <Avatar.Root class="size-14">
        <Avatar.Image src={getAvatarUrl(currentUser)} alt={currentUser.name} />
        <Avatar.Fallback>{getFallback(currentUser.name)}</Avatar.Fallback>
      </Avatar.Root>

      <div class="flex gap-2">
        <form
          method="POST"
          action="?/updateAvatar"
          use:enhance={() => {
            uploading = true;
            return async ({ result, update }) => {
              if (result.type === "success") {
                toast.success("Avatar uploaded!");
                await update();
              } else if (result.type === "failure") {
                toast.error(String(result.data?.error ?? "Upload failed"));
              }
              uploading = false;
            };
          }}
          enctype="multipart/form-data"
        >
          <label class="cursor-pointer">
            <input
              type="file"
              name="avatar"
              accept="image/*"
              class="hidden"
              disabled={uploading}
              onchange={(e) => e.currentTarget.form?.requestSubmit()}
            />
            <Button
              variant="secondary"
              size="sm"
              class="pointer-events-none disabled={uploading}"
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </label>
        </form>

        <form method="POST" action="?/removeAvatar" use:enhance>
          <Button type="submit" size="sm" variant="destructive">Remove</Button>
        </form>
      </div>
    </div>

    <!-- name -->
    <form
      method="POST"
      action="?/updateName"
      use:enhance={({ cancel }) => {
        if (!nameValue.trim()) {
          toast.error("Name cannot be empty");
          cancel();
          return;
        }

        return async ({ result, update }) => {
          if (result.type === "success") {
            toast.success("Name updated");
            editingName = false;
            await update();
          } else if (result.type === "failure") {
            toast.error(String(result.data?.error ?? "Update failed"));
          }
        };
      }}
      class="space-y-4"
    >
      <div class="flex items-center justify-between">
        <Label for="name">Name</Label>
        <div class="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            type="button"
            onclick={toggleNameEdit}
          >
            {editingName ? "Cancel" : "Edit"}
          </Button>
          {#if editingName}
            <Button type="submit" size="sm">Save</Button>
          {/if}
        </div>
      </div>
      <Input
        id="name"
        name="name"
        bind:value={nameValue}
        disabled={!editingName}
      />
    </form>

    <!-- username -->
    <form
      method="POST"
      action="?/updateUsername"
      use:enhance={({ cancel }) => {
        if (!usernameValue.trim()) {
          toast.error("Username cannot be empty");
          cancel();
          return;
        }

        return async ({ result, update }) => {
          if (result.type === "success") {
            toast.success("Username updated");
            editingUsername = false;
            await update();
          } else if (result.type === "failure") {
            toast.error(String(result.data?.error ?? "Update failed"));
          }
        };
      }}
      class="space-y-4"
    >
      <div class="flex items-center justify-between">
        <Label for="username">Username</Label>
        <div class="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            type="button"
            onclick={toggleUsernameEdit}
          >
            {editingUsername ? "Cancel" : "Edit"}
          </Button>
          {#if editingUsername}
            <Button type="submit" size="sm">Save</Button>
          {/if}
        </div>
      </div>
      <Input
        id="username"
        name="username"
        bind:value={currentUser.username}
        disabled={!editingUsername}
      />
    </form>
  </Card.Content>
</Card.Root>
