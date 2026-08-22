import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';
import { LocaleProvider } from './LocaleProvider';
import { useLocale } from './useLocale';

function LocaleProbe() {
  const { locale, copy } = useLocale();
  return (
    <>
      <output>{locale}</output>
      <h1>{copy.hero.titleAccent}</h1>
      <LanguageSwitcher />
    </>
  );
}

describe('LocaleProvider', () => {
  it('uses English by default and persists a language change', async () => {
    const user = userEvent.setup();
    render(
      <LocaleProvider>
        <LocaleProbe />
      </LocaleProvider>,
    );

    expect(screen.getByRole('heading')).toHaveTextContent('furry identities');
    await user.click(screen.getByRole('button', { name: 'RU' }));

    expect(screen.getByRole('heading')).toHaveTextContent('фурри-образов');
    expect(window.localStorage.getItem('beerwolf.locale')).toBe('ru');
    expect(document.documentElement.lang).toBe('ru');
  });

  it('restores a valid stored locale and ignores an invalid one', () => {
    window.localStorage.setItem('beerwolf.locale', 'ru');
    const { unmount } = render(
      <LocaleProvider>
        <LocaleProbe />
      </LocaleProvider>,
    );
    expect(screen.getByRole('heading')).toHaveTextContent('фурри-образов');
    unmount();

    window.localStorage.setItem('beerwolf.locale', 'xx');
    render(
      <LocaleProvider>
        <LocaleProbe />
      </LocaleProvider>,
    );
    expect(screen.getByRole('heading')).toHaveTextContent('furry identities');
  });
});
