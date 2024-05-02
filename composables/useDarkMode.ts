export const useDarkMode = () => {
	const colorMode = useColorMode();
	const cookie = useCookie('color-mode');

	if (!cookie.value) {
		cookie.value = colorMode.value ?? colorMode.preference;
	} else {
		colorMode.value = cookie.value;
		colorMode.preference = cookie.value;
	}

	const active = computed({
		get() {
			return (cookie.value ?? colorMode.value ?? colorMode.preference) === 'dark';
		},
		set(v) {
			colorMode.value = !v ? 'light' : 'dark';
			cookie.value = !v ? 'light' : 'dark';
			colorMode.preference = !v ? 'light' : 'dark';
		}
	});

	const toggle = () => {
		active.value = !active.value;
	};

	const modeIcon = computed(() => {
		return active.value ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid';
	});

	return { active, modeIcon, toggle };
};
