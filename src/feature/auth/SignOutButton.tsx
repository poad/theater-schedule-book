import { ErrorAlert } from '../ui';
import { supabase } from '../supabase';
import { Button } from 'terracotta';
import { Show, createSignal } from 'solid-js';

export function SignOutButton() {
  const [errors, setErrors] = createSignal<Error>();

  async function handleClick() {
    const response = await supabase.auth.signOut();
    if (response?.error) {
      setErrors(response.error);
    }
  }

  return (
    <div>
      <Button
        onClick={() => {
          void handleClick();
        }}
        class="py-2 px-4 rounded-md no-underline bg-green-500 text-white text-xs  hover:bg-btn-background-hover"
      >
        Sign out
      </Button>
      <Show when={errors()}>
        <ErrorAlert title="Failed to Sign In">{errors()?.message}</ErrorAlert>
      </Show>
    </div>
  );
}
