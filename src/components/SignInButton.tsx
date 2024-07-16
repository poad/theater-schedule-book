import { Button } from 'terracotta';
import { Show, createSignal } from 'solid-js';
import { ErrorAlert } from '../components/ui/alert';
import { supabase } from '../supabase';

export function SignInButton() {
  const [errors, setErrors] = createSignal<Error>();

  async function signInWithAzure() {
    const response = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        scopes: 'email offline_access',
        redirectTo:
          typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    });
    if (response?.error) {
      setErrors(response.error);
    }
  }

  return (
    <>
      <Button
        onClick={() => void signInWithAzure()}
        class="bg-green-500 rounded text-white text-xs px-2.5 py-2"
      >
        Sign in
      </Button>
      <Show when={errors()}>
        <ErrorAlert title="Failed to Sign In">{errors()?.message}</ErrorAlert>
      </Show>
    </>
  );
}

export default SignInButton;
