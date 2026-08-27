import { AnalyticsRoot } from '../analytics/AnalyticsRoot';
import { LocaleProvider } from '../i18n/LocaleProvider';
import { PosterWorld } from '../layout/PosterWorld';

export function App() {
  return (
    <LocaleProvider>
      <AnalyticsRoot />
      <PosterWorld />
    </LocaleProvider>
  );
}
