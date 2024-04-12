export default defineNuxtRouteMiddleware(() => {
	const { status, signIn } = useAuth();

	if (status.value !== 'authenticated') {
		signIn('discord');
	}
});
