import { FunctionComponent } from "react";
import { ModalProps }        from "flowbite-react/lib/esm/components/Modal/Modal";
import { Modal }             from "flowbite-react";

const SaveModal : FunctionComponent<ModalProps> = ( { show, children, ...props } ) => {
	if ( !show ) {
		return (
			<></>
		);
	}
	return (
		<Modal show={ show } { ...props }>{ children }</Modal>
	);
};

export default SaveModal;
