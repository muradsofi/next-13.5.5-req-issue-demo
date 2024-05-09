import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';

import { fallbackLng, getOptions } from './settings';

/* Here in this file you can find the useTranslation hook
 * for server components and the initialization of the i18 instance
 *
 * Based on this refrence https://locize.com/blog/next-app-dir-i18n/
 * "We're not using the i18next singleton here but creating a new instance on each useTranslation call,
 * because during compilation everything seems to be executed in parallel.
 * Having a separate instance will keep the translations consistent."
 *
 * and the import is like below for server components:
 * import { useTranslation } from '@/app/i18n/server';
 */

// i18next initialization
const initI18next = async (ns: string | string[] | undefined, lng = fallbackLng) => {
	const i18nInstance = createInstance();
	await i18nInstance
		.use(initReactI18next)
		.use(
			// eslint-disable-next-line consistent-return
			resourcesToBackend((language: string, namespace: string | string[]) => {
				if (Array.isArray(namespace)) {
					(namespace as string[]).forEach((nsElement) => import(`./locales/${language}/${nsElement}.json`));
				} else {
					return import(`./locales/${language}/${namespace}.json`);
				}
			}),
		)
		.init(getOptions(lng, ns));
	return i18nInstance;
};

/**
 * useTranslation hook to use for translating keywords using the given namespaces as arguments
 *
 * @return { Promise<{ t: any; i18n: any;}> } a Promise that resolves t function which uses to get the keywords value out of namespace
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
export async function useTranslation(
	ns: string | string[],
	lng = fallbackLng,
	options?: {
		keyPrefix: '';
	},
): Promise<{ t: any; i18n: any }> {
	const i18nextInstance = await initI18next(ns, lng);
	return {
		t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns, options?.keyPrefix || ''),
		i18n: i18nextInstance,
	};
}
