import {
	FC,
	useContext
}                  from "react";
import {
	json,
	Link,
	LoaderFunction,
	Outlet
}                  from "react-router-dom";
import Ribbon      from "@comp/elements/Ribbon";
import { Button }  from "flowbite-react";
import {
	BiBot,
	BsDoorOpen,
	SiDiscord,
	SiGithub,
	SiPatreon
}                  from "react-icons/all";
import AuthContext from "@context/AuthContext";


const loader : LoaderFunction = async() => {
	return json( {} );
};


const Component : FC = () => {
	const [ user, logout ] = useContext( AuthContext );
	return (
		<section className="bg-gray-900">
			<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
				<div className="flex sm:max-w-md w-full">
					<Link to="#"
					      className="flex-1 flex items-center mb-6 text-2xl font-semibold text-gray-900 text-white">
						<img className="w-8 h-8 mr-2" src="/images/logo.png"
						     alt="logo"/>
						KBot 2.0
					</Link>
					{ user.IsValid && (
						<Button color="gray" onClick={ logout }>
							<BsDoorOpen className="mr-3 h-4 w-4"/>
							Logout
						</Button>
					) }
				</div>
				<div
					className="w-full bg-gray-800 rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 border-gray-700">
					<div className="relative p-6 space-y-4 md:space-y-6 sm:p-8">
						<Ribbon color="red">Alpha</Ribbon>
						<Outlet/>

						<div className="flex flex-wrap gap-2">
							<Button href={ "https://github.com/Kyri123/kbot2" } target="_blank" color="gray"
							        className="flex-1">
								<SiGithub className="mr-3 h-4 w-4"/>
								Source
							</Button>
							<Button href={ "https://www.patreon.com/kmods" } target="_blank" color="gray"
							        className="flex-1">
								<SiPatreon className="mr-3 h-4 w-4"/>
								Donate
							</Button>
							<Button href={ "https://discord.gg/BeH4GRRWxc" } target="_blank" color="gray"
							        className="flex-1">
								<SiDiscord className="mr-3 h-4 w-4"/>
								Discord
							</Button>
							<Button href={ import.meta.env.VITE_INVURL } target="_blank" color="green"
							        className="flex-1">
								<BiBot className="mr-3 h-4 w-4"/>
								Invite
							</Button>
						</div>
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