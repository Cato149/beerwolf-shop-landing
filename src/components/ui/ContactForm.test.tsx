import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, vi } from 'vitest';
import { analyticsEvents, trackEvent } from '../../analytics/umami';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { ContactForm } from './ContactForm';

vi.mock('../../analytics/umami', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../analytics/umami')>();
  return {
    ...actual,
    trackEvent: vi.fn(),
  };
});

const renderForm = () =>
  render(
    <LocaleProvider>
      <ContactForm />
    </LocaleProvider>,
  );

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.mocked(trackEvent).mockClear();
});

describe('ContactForm', () => {
  it('shows an honest fallback when Formspree is not configured', () => {
    vi.stubEnv('VITE_FORMSPREE_ENDPOINT', '');
    renderForm();

    expect(screen.getByRole('button', { name: /send the signal/i })).toBeDisabled();
    expect(screen.getByRole('status')).toHaveTextContent('The web form is being tuned');
  });

  it('validates required fields before submission', async () => {
    vi.stubEnv('VITE_FORMSPREE_ENDPOINT', 'https://formspree.io/f/test-form');
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: /send the signal/i }));

    expect(screen.getByRole('status')).toHaveTextContent(
      'Please complete the required fields',
    );
    expect(trackEvent).toHaveBeenCalledWith(analyticsEvents.contactFormInvalid, {
      locale: 'en',
    });
  });

  it('submits valid data and announces success', async () => {
    vi.stubEnv('VITE_FORMSPREE_ENDPOINT', 'https://formspree.io/f/test-form');
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/Name \/ nickname/), 'Morrow');
    await user.type(screen.getByLabelText(/Telegram \/ Discord/), '@morrow');
    await user.type(
      screen.getByLabelText(/Tell me about your idea/),
      'A small identity archive with artwork and music.',
    );
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: /send the signal/i }));

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(await screen.findByRole('status')).toHaveTextContent('Signal received');
    expect(trackEvent).toHaveBeenCalledWith(analyticsEvents.contactFormSuccess, {
      locale: 'en',
      method: 'Telegram',
      has_budget: false,
      has_references: false,
    });
  });
});
