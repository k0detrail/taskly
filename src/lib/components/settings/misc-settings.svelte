<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import * as Card from "$lib/components/ui/card";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import { enhance } from "$app/forms";
  import { toast } from "svelte-sonner";

  let isDeleting = $state(false);
</script>

<Card.Root class="max-w-md mx-auto my-4 shadow-lg">
  <Card.Header>
    <Card.Title class="text-destructive">Danger zone</Card.Title>
    <Card.Description>Irreversible actions.</Card.Description>
  </Card.Header>

  <Card.Content>
    <p class="text-sm text-muted-foreground">
      Deleting your account will permanently remove all your data, including
      your profile, settings, and uploaded content.
    </p>
  </Card.Content>

  <Card.Footer>
    <AlertDialog.Root>
      <AlertDialog.Trigger class={buttonVariants({ variant: "destructive" })}>
        Delete account
      </AlertDialog.Trigger>

      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
          <AlertDialog.Description>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <div class="flex justify-end">
            <form
              method="POST"
              action="?/deleteAccount"
              use:enhance={() => {
                isDeleting = true;
                return async ({ result }) => {
                  if (result.type === "failure") {
                    toast.error("Failed to delete account");
                    isDeleting = false;
                  }
                };
              }}
            >
              <AlertDialog.Cancel type="button" disabled={isDeleting}
                >Cancel</AlertDialog.Cancel
              >
              <AlertDialog.Action type="submit" disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete Permanently"}
              </AlertDialog.Action>
            </form>
          </div>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  </Card.Footer>
</Card.Root>
