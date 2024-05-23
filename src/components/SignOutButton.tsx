import { Button } from 'terracotta';
import { ErrorAlert } from '../components/ui/alert';
import { Show, createSignal } from 'solid-js';
import { supabase } from '../supabase';

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

export default SignOutButton;
