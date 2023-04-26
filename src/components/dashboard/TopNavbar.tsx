import { Navbar }   from "flowbite-react";
import {
	FC,
	useContext
}                   from "react";
import {
	Link,
	useParams
}                   from "react-router-dom";
import guildContext from "@context/guildContext";
import {
	BiDoorOpen,
	BiServer
}                   from "react-icons/all";
import authContext  from "@context/authContext";


const TopNavbar : FC = () => {
	const [ , logout ] = useContext( authContext );
	const { guildId } = useParams();
	const { guildData } = useContext( guildContext );

	return (
		<Navbar fluid={ true } rounded={ false }>
			<Navbar.Brand as={ Link } to={ `/guild/${ guildId }` }>
				<img src="/images/logo.png" className="mr-3 h-6 sm:h-9 rounded-full"
					 alt="KBot Logo"/>
				<span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
				  KBot 2.0
				</span>
			</Navbar.Brand>
			<Navbar.Toggle/>
			<Navbar.Collapse>
				<Navbar.Link as={ Link } to="/" className="flex items-center">
					<div className="flex py-3">
						<BiServer size={ 20 } className="text-sm me-3 font-medium text-gray-500 dark:text-gray-400"/>
						Back to serverlist
					</div>
				</Navbar.Link>
				<Navbar.Link as={ "button" } className="flex items-center" onClick={ logout }>
					<div className="flex py-3">
						<BiDoorOpen size={ 20 } className="text-sm me-3 font-medium text-gray-500 dark:text-gray-400"/>
						Logout
					</div>
				</Navbar.Link>
			</Navbar.Collapse>
		</Navbar>
	);
};

export default TopNavbar;
