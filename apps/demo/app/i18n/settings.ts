export const fallbackLng = 'de';
export const languages = [fallbackLng, 'de'];
export const defaultNS = ['chat', 'common'];

export function getOptions(lng: string = fallbackLng, ns: string | string[] = defaultNS) {
	return {
		supportedLngs: languages,
		fallbackLng,
		lng,
		fallbackNS: defaultNS,
		defaultNS,
		ns,
	};
}
