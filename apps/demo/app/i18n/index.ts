'use client';

import i18next from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { useEffect, useState } from 'react';
import { initReactI18next, useTranslation as useTranslationOrg, UseTranslationResponse } from 'react-i18next';

import { getOptions, languages } from './settings';

/**
 * Here in this file you can find the useTranslation hook
 * for client components and the initialization of the i18 instance
 * and the import is like below for client components:
 * import { useTranslation } from '@/app/i18n/';
 */

const runsOnServerSide = typeof window === 'undefined';

// i18next initialization
i18next
	.use(initReactI18next)
	.use(
		resourcesToBackend(
			(language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`),
		),
	)
	.init({
		...getOptions(),
		lng: undefined, // let detect the language on client side
		detection: {
			order: ['path', 'htmlTag', 'cookie', 'navigator'],
		},
		preload: runsOnServerSide ? languages : [],
	});

/**
 * useTranslation hook to use for translating keywords using the given namespaces as arguments
 *
 * @return { UseTranslationResponse<string | string[], undefined> } a t function which uses to get the keywords value out of namespace
 * @param {(string|string[])} ns
 * @param lng
 * @param options
 * @returns
 *
 * @example
 *
 *     const {t}=useTranslation('chat');
 * 	   t('chat:example.exampleNested');
 */
export function useTranslation(
	ns: string | string[],
	lng?: string,
	options?: {},
): UseTranslationResponse<string | string[], undefined> {
	const ret = useTranslationOrg(ns, options);
	const { i18n } = ret;
	if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
		i18n.changeLanguage(lng);
	} else {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage);
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			if (activeLng === i18n.resolvedLanguage) return;
			setActiveLng(i18n.resolvedLanguage);
		}, [activeLng, i18n.resolvedLanguage]);
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			if (!lng || i18n.resolvedLanguage === lng) return;
			i18n.changeLanguage(lng);
		}, [lng, i18n]);
	}
	return ret;
}
