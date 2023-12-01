import AuthContext from '@context/AuthContext';
import { Navbar } from 'flowbite-react';
import { FC, useContext } from 'react';
import { BiDoorOpen, BiServer } from 'react-icons/bi';
import { Link, useParams } from 'react-router-dom';

const TopNavbar: FC = () => {
	const [, logout] = useContext(AuthContext);
	const { guildId } = useParams();

	return (
		<Navbar fluid={true} rounded={false}>
			<Navbar.Brand as={Link} to={`/guild/${guildId}`}></Navbar.Brand>
			<Navbar.Toggle />
			<Navbar.Collapse>
				<Navbar.Link as={Link} to='/' className='flex items-center'>
					<div className='flex py-3'>
						<BiServer size={20} className='me-3 text-sm font-medium text-gray-500 dark:text-gray-400' />
						Back to serverlist
					</div>
				</Navbar.Link>
				<Navbar.Link as={'button'} className='flex items-center' onClick={logout}>
					<div className='flex py-3'>
						<BiDoorOpen size={20} className='me-3 text-sm font-medium text-gray-500 dark:text-gray-400' />
						Logout
					</div>
				</Navbar.Link>
			</Navbar.Collapse>
		</Navbar>
	);
};

export default TopNavbar;
