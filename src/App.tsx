import AuthContext from '@context/AuthContext';
import useAuth from '@hooks/useAuth';
import '@kyri123/k-javascript-utils/lib/useAddons';
import { rootRouter } from '@routing/Router';
import { initFlowbite } from 'flowbite';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

function App() {
	useEffect(initFlowbite, []);
	const Auth = useAuth();

	return (
		<AuthContext.Provider value={Auth}>
			<RouterProvider router={rootRouter} fallbackElement={<></>} />
		</AuthContext.Provider>
	);
}

export default App;
