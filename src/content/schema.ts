import { z } from 'zod';

const nonEmptyText = z.string().trim().min(1);

const processStepSchema = z.object({
  number: nonEmptyText,
  kicker: nonEmptyText,
  title: nonEmptyText,
  body: nonEmptyText,
});

const boardColumnSchema = z.object({
  title: nonEmptyText,
  cards: z.array(nonEmptyText).min(1),
});

const messageSchema = z.object({
  from: z.enum(['bot', 'client']),
  text: nonEmptyText,
});

export const copySchema = z.object({
  meta: z.object({
    title: nonEmptyText,
    description: nonEmptyText,
  }),
  nav: z.object({
    label: nonEmptyText,
    brand: nonEmptyText,
    concept: nonEmptyText,
    process: nonEmptyText,
    archive: nonEmptyText,
    contact: nonEmptyText,
    menuOpen: nonEmptyText,
    menuClose: nonEmptyText,
    skip: nonEmptyText,
  }),
  common: z.object({
    telegramCta: nonEmptyText,
    telegramCtaNote: nonEmptyText,
    me: nonEmptyText,
    viewProject: nonEmptyText,
    demoProject: nonEmptyText,
    scrollCue: nonEmptyText,
    language: nonEmptyText,
  }),
  hero: z.object({
    eyebrow: nonEmptyText,
    titleLead: nonEmptyText,
    titleAccent: nonEmptyText,
    description: nonEmptyText,
    sideNote: nonEmptyText,
    stamp: nonEmptyText,
    posterAlt: nonEmptyText,
  }),
  process: z.object({
    eyebrow: nonEmptyText,
    title: nonEmptyText,
    intro: nonEmptyText,
    steps: z.array(processStepSchema).min(1),
    board: z.object({
      title: nonEmptyText,
      project: nonEmptyText,
      columns: z.array(boardColumnSchema).min(1),
    }),
    telegram: z.object({
      title: nonEmptyText,
      status: nonEmptyText,
      messages: z.array(messageSchema).min(1),
      actions: z.array(nonEmptyText).min(1),
    }),
  }),
  archive: z.object({
    eyebrow: nonEmptyText,
    title: nonEmptyText,
    intro: nonEmptyText,
    labels: z.object({
      client: nonEmptyText,
      year: nonEmptyText,
      direction: nonEmptyText,
      features: nonEmptyText,
      stack: nonEmptyText,
      status: nonEmptyText,
    }),
    cabinet: z.object({
      brand: nonEmptyText,
      selectLabel: nonEmptyText,
      selectAriaLabel: nonEmptyText,
      filesSuffix: nonEmptyText,
      skipToContact: nonEmptyText,
    }),
  }),
  contact: z.object({
    eyebrow: nonEmptyText,
    heading: z.object({
      question: nonEmptyText,
      scriptLine: nonEmptyText,
      brand: nonEmptyText,
    }),
    intro: nonEmptyText,
    telegramTitle: nonEmptyText,
    telegramBody: nonEmptyText,
    formTitle: nonEmptyText,
    formIntro: nonEmptyText,
    priceSticker: nonEmptyText,
    fields: z.object({
      name: nonEmptyText,
      namePlaceholder: nonEmptyText,
      method: nonEmptyText,
      contact: nonEmptyText,
      contactPlaceholder: nonEmptyText,
      idea: nonEmptyText,
      ideaPlaceholder: nonEmptyText,
      references: nonEmptyText,
      referencesPlaceholder: nonEmptyText,
      budget: nonEmptyText,
      budgetPlaceholder: nonEmptyText,
      consent: nonEmptyText,
      honeypot: nonEmptyText,
    }),
    methods: z.array(nonEmptyText).min(2),
    submit: nonEmptyText,
    sending: nonEmptyText,
    success: nonEmptyText,
    error: nonEmptyText,
    missingEndpoint: nonEmptyText,
    required: nonEmptyText,
    availability: nonEmptyText,
    privacy: nonEmptyText,
  }),
  footer: z.object({
    socialTitle: nonEmptyText,
    signoff: nonEmptyText,
    copyright: nonEmptyText,
    easterEgg: nonEmptyText,
  }),
});

const localizedTextSchema = z.object({
  en: nonEmptyText,
  ru: nonEmptyText,
});

export const projectSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  year: nonEmptyText,
  client: nonEmptyText,
  image: nonEmptyText,
  imageAlt: localizedTextSchema,
  artVariant: z.enum(['signal', 'riot', 'river']),
  stack: z.array(nonEmptyText).min(1),
  // CMS string widgets often save "" instead of omitting the field.
  liveUrl: z.preprocess(
    (value) => (value === '' ? null : value),
    z.url().nullable().optional(),
  ),
  translations: z.object({
    en: z.object({
      title: nonEmptyText,
      description: nonEmptyText,
      direction: nonEmptyText,
      features: z.array(nonEmptyText).min(1),
      testimonial: z.object({
        quote: nonEmptyText,
        author: nonEmptyText,
      }),
    }),
    ru: z.object({
      title: nonEmptyText,
      description: nonEmptyText,
      direction: nonEmptyText,
      features: z.array(nonEmptyText).min(1),
      testimonial: z.object({
        quote: nonEmptyText,
        author: nonEmptyText,
      }),
    }),
  }),
});

export const settingsSchema = z.object({
  brandName: nonEmptyText,
  telegramBotUrl: z.url(),
  email: z.email(),
  personalSiteUrl: z.url(),
  socials: z
    .array(
      z.object({
        label: nonEmptyText,
        url: z.string().refine((value) => {
          if (value.startsWith('mailto:')) return true;
          return z.url().safeParse(value).success;
        }, 'Expected a URL or mailto link'),
      }),
    )
    .min(1),
});

export type SiteCopy = z.infer<typeof copySchema>;
export type Project = z.infer<typeof projectSchema>;
export type SiteSettings = z.infer<typeof settingsSchema>;
