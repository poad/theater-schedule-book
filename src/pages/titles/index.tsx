import { Titles } from '../../feature/title';
import { Header } from '../../feature/ui';

function Main() {
  return <Titles />;
}

export default function Index() {
  return (
    <div class="w-full flex flex-col items-center">
      <nav class="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div class="w-full max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
          <div />
          <Header />
          <div>
            <a href="/" target="_self">
              Top
            </a>
          </div>
        </div>
      </nav>

      <Main />
    </div>
  );
}
