<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";

  export let user;

  let editingEmail = false;

  function toggleEmailEdit() {
    editingEmail = !editingEmail;
  }
</script>

<Card.Root class="max-w-md mx-auto my-4 shadow-lg">
  <Card.Header>
    <Card.Title>Email</Card.Title>
    <Card.Description>
      Manage the email address associated with your account.
    </Card.Description>
  </Card.Header>

  <Card.Content class="space-y-4">
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <Label for="email">Email address</Label>

        <!-- edit button -->
        <div class="flex gap-2">
          <Button size="sm" variant="outline" onclick={toggleEmailEdit}>
            {editingEmail ? "Cancel" : "Edit"}
          </Button>

          {#if editingEmail}
            <Button size="sm">Save email</Button>
          {/if}
        </div>
      </div>

      <Input
        id="email"
        type="email"
        value={user.email}
        disabled={!editingEmail}
      />
    </div>
  </Card.Content>
</Card.Root>
