import { useState, type FormEvent } from 'react';
import { analyticsEvents, trackEvent } from '../../analytics/umami';
import { useLocale } from '../../i18n/useLocale';

type SubmissionState = 'idle' | 'sending' | 'success' | 'error' | 'invalid';

export function ContactForm() {
  const { copy, locale } = useLocale();
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT?.trim();

  const statusMessage = {
    idle: endpoint ? '' : copy.contact.missingEndpoint,
    sending: copy.contact.sending,
    success: copy.contact.success,
    error: copy.contact.error,
    invalid: copy.contact.required,
  }[submissionState];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      setSubmissionState('invalid');
      form.reportValidity();
      trackEvent(analyticsEvents.contactFormInvalid, { locale });
      return;
    }

    if (!endpoint) {
      setSubmissionState('idle');
      return;
    }

    setSubmissionState('sending');

    try {
      const data = new FormData(form);
      data.set('_language', locale);
      data.set('_subject', `Beerwolf commission request from ${data.get('name')}`);

      const response = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) throw new Error('Formspree rejected the submission');

      form.reset();
      setSubmissionState('success');
      trackEvent(analyticsEvents.contactFormSuccess, {
        locale,
        method: String(data.get('preferredContact') ?? ''),
        has_budget: Boolean(String(data.get('budget') ?? '').trim()),
        has_references: Boolean(String(data.get('references') ?? '').trim()),
      });
    } catch {
      setSubmissionState('error');
      trackEvent(analyticsEvents.contactFormError, { locale });
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form__row">
        <label>
          <span>{copy.contact.fields.name} *</span>
          <input
            name="name"
            type="text"
            placeholder={copy.contact.fields.namePlaceholder}
            autoComplete="name"
            required
          />
        </label>

        <label>
          <span>{copy.contact.fields.method} *</span>
          <select name="preferredContact" defaultValue={copy.contact.methods[0]}>
            {copy.contact.methods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        <span>{copy.contact.fields.contact} *</span>
        <input
          name="contact"
          type="text"
          placeholder={copy.contact.fields.contactPlaceholder}
          autoComplete="email"
          required
        />
      </label>

      <label>
        <span>{copy.contact.fields.idea} *</span>
        <textarea
          name="idea"
          rows={6}
          placeholder={copy.contact.fields.ideaPlaceholder}
          required
        />
      </label>

      <div className="contact-form__row">
        <label>
          <span>{copy.contact.fields.references}</span>
          <textarea
            name="references"
            rows={3}
            placeholder={copy.contact.fields.referencesPlaceholder}
          />
        </label>

        <label>
          <span>{copy.contact.fields.budget}</span>
          <input
            name="budget"
            type="text"
            placeholder={copy.contact.fields.budgetPlaceholder}
            inputMode="decimal"
          />
        </label>
      </div>

      <label className="contact-form__honeypot" aria-hidden="true">
        {copy.contact.fields.honeypot}
        <input name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
      </label>

      <label className="contact-form__consent">
        <input name="consent" type="checkbox" value="yes" required />
        <span>{copy.contact.fields.consent}</span>
      </label>

      <div className="contact-form__footer">
        <button type="submit" disabled={submissionState === 'sending' || !endpoint}>
          <span>
            {submissionState === 'sending' ? copy.contact.sending : copy.contact.submit}
          </span>
          <span aria-hidden="true">↗</span>
        </button>
        <p>{copy.contact.privacy}</p>
      </div>

      <p
        className="contact-form__status"
        data-state={submissionState}
        role="status"
        aria-live="polite"
      >
        {statusMessage}
      </p>
    </form>
  );
}
