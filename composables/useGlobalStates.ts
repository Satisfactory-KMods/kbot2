export const useGlobalStates = () => {
	const showPolicy = useState(() => {
		return false;
	});
	const showAbout = useState(() => {
		return false;
	});

	return { showPolicy, showAbout };
};
