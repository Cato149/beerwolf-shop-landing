import { useEffect, useRef } from 'react';
import { useLocale } from '../i18n/useLocale';
import { analyticsEvents, identifySession, installUmami, trackEvent } from './umami';

const SECTION_IDS = ['concept', 'process', 'archive', 'contact'] as const;

const seenSections = new Set<string>();

const usePageLeaveAnalytics = (locale: string) => {
  const localeRef = useRef(locale);
  localeRef.current = locale;

  // Wall-clock starts once per page load. Locale at leave time comes from localeRef.
  useEffect(() => {
    const startedAt = Date.now();
    let visibleSince = document.visibilityState === 'visible' ? startedAt : 0;
    let engagedMs = 0;
    let leaveSent = false;

    const pauseEngaged = () => {
      if (visibleSince === 0) return;
      engagedMs += Date.now() - visibleSince;
      visibleSince = 0;
    };

    const sendLeave = () => {
      if (leaveSent) return;
      leaveSent = true;
      pauseEngaged();

      trackEvent(analyticsEvents.pageLeave, {
        locale: localeRef.current,
        duration_seconds: Math.round((Date.now() - startedAt) / 1000),
        engaged_seconds: Math.round(engagedMs / 1000),
      });
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        pauseEngaged();
        return;
      }

      visibleSince = Date.now();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pagehide', sendLeave);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pagehide', sendLeave);
    };
  }, []);
};

const useSectionViewAnalytics = (locale: string) => {
  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (element): element is HTMLElement => element !== null,
    );

    if (elements.length === 0 || typeof IntersectionObserver === 'undefined')
      return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const section = entry.target.id;
          if (!section || seenSections.has(section)) continue;
          seenSections.add(section);
          trackEvent(analyticsEvents.sectionView, { section, locale });
        }
      },
      { threshold: 0.35 },
    );

    for (const element of elements) observer.observe(element);

    return () => observer.disconnect();
  }, [locale]);
};

/** Loads Umami and records visit duration, section depth, and locale. */
export function AnalyticsRoot() {
  const { locale } = useLocale();

  useEffect(() => {
    installUmami();
  }, []);

  useEffect(() => {
    identifySession({ locale });
  }, [locale]);

  usePageLeaveAnalytics(locale);
  useSectionViewAnalytics(locale);

  return null;
}
