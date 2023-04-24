import { FC } from "react";
import {
	json,
	Link,
	LoaderFunction,
	Outlet
}             from "react-router-dom";


const loader : LoaderFunction = async() => {
	return json( {} );
};


const Component : FC = () => {
	return (
		<section className="bg-gray-900">
			<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
				<Link to="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 text-white">
					<img className="w-8 h-8 mr-2" src="/images/logo.png"
						 alt="logo"/>
					KBot 2.0
				</Link>
				<div
					className="w-full bg-gray-800 rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 border-gray-700">
					<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
						<Outlet/>
					</div>
				</div>
			</div>
		</section>
	);
};


export {
	Component,
	loader
};