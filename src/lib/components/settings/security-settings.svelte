<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";

  import { enhance, applyAction } from "$app/forms";
  import { toast } from "svelte-sonner";
</script>

<form
  method="POST"
  action="?/updatePassword"
  use:enhance={({ formElement }) => {
    return async ({ result }) => {
      if (result.type === "failure") {
        toast("Password update failed", {
          description: String(result.data?.error ?? "Unknown error"),
        });
      }

      if (result.type === "success") {
        toast("Password updated", {
          description: "Your password has been changed",
        });
      }

      formElement.reset();

      await applyAction(result);
    };
  }}
>
  <Card.Root class="max-w-md mx-auto my-4 shadow-lg">
    <Card.Header>
      <Card.Title>Security</Card.Title>
      <Card.Description>Change your password.</Card.Description>
    </Card.Header>

    <Card.Content class="space-y-4">
      <div class="space-y-2">
        <Label for="oldPassword">Current password</Label>
        <Input id="oldPassword" name="oldPassword" type="password" />
      </div>

      <div class="space-y-2">
        <Label for="password">New password</Label>
        <Input id="password" name="password" type="password" />
      </div>

      <div class="space-y-2">
        <Label for="passwordConfirm">Confirm password</Label>
        <Input id="passwordConfirm" name="passwordConfirm" type="password" />
      </div>
    </Card.Content>

    <Card.Footer>
      <Button type="submit">Update password</Button>
    </Card.Footer>
  </Card.Root>
</form>
