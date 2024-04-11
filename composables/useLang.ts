export function useLang(key: MaybeRef<string>) {
	const i18n = useI18n();
	const mainKey = isRef(key) ? key : ref(key);

	const mt: (key: string, values?: Parameters<typeof i18n.t>[1]) => string = (
		key,
		values = {}
	) => {
		return i18n.t(`${unref(mainKey)}.${key}`, values);
	};

	return { ...i18n, mt };
}
