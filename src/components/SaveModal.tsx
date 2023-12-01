import { Modal } from 'flowbite-react';
import { ModalProps } from 'flowbite-react/lib/esm/components/Modal/Modal';
import { FunctionComponent } from 'react';

const SaveModal: FunctionComponent<ModalProps> = ({ show, children, ...props }) => {
	if (!show) {
		return <></>;
	}
	return (
		<Modal show={show} {...props}>
			{children}
		</Modal>
	);
};

export default SaveModal;
