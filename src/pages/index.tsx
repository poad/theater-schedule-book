import { Schedules } from '../feature/schedule';
import { SupabaseSessionContext } from '../feature/supabase';
import { Header } from '../feature/ui';

import { createSignal, Show, useContext } from 'solid-js';

export default function Index() {
  const now = new Date();
  const [year, setYear] = createSignal(now.getFullYear());
  const [month, setMonth] = createSignal(now.getMonth());
  const session = useContext(SupabaseSessionContext);

  const goPrevMonth = () => {
    if (month() === 0) {
      setMonth(11);
      setYear(year() - 1);
    } else {
      setMonth(month() - 1);
    }
  };

  const goNextMonth = () => {
    if (month() === 11) {
      setMonth(0);
      setYear(year() + 1);
    } else {
      setMonth(month() + 1);
    }
  };

  return (
    <main>
      <div class="w-full flex flex-col items-center">
        <Header />

        <Show when={session()} fallback={<>サインインしてください</>}>
          <>
            <div class="flex items-center gap-4 pt-4 text-foreground">
              <button type="button" onClick={goPrevMonth} aria-label="前の月" class="px-3 py-1">
                ‹ 前の月
              </button>
              <span class="text-lg font-medium">
                {year()}年{month() + 1}月
              </span>
              <button type="button" onClick={goNextMonth} aria-label="次の月" class="px-3 py-1">
                次の月 ›
              </button>
            </div>

            <Schedules year={year()} month={month()} />
          </>
        </Show>
      </div>
    </main>
  );
}
