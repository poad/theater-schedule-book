import Schedules from '../components/schedules';
import Header from '../components/header';

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
