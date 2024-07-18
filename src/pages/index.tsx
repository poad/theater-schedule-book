import { Schedules } from '../feature/schedule';
import { Header } from '../feature/ui';

export default function Index() {
  return (
    <main>
      <div class="w-full flex flex-col items-center">
        <Header />

        <Schedules currentMonthOnly />
      </div>
    </main>
  );
}
