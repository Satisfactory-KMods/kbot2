import { ButtonProps }   from "flowbite-react/lib/esm/components/Button/Button";
import { Button }        from "flowbite-react";
import React, {
	FC,
	PropsWithChildren
}                        from "react";
import { CgSpinner }     from "react-icons/all";
import { IconBaseProps } from "react-icons/lib/cjs/iconBase";

interface ILoadButtonProps extends ButtonProps, PropsWithChildren {
	isLoading : boolean;
	icon : React.ReactNode;
	spinnerProps? : IconBaseProps;
}

const LoadButton : FC<ILoadButtonProps> = ( { children, isLoading, spinnerProps, icon, ...props } ) => {
	props.disabled = props.disabled || isLoading;
	return (
		<Button { ...props }>
			{ !isLoading ? icon : <CgSpinner className="mr-3 h-4 w-4 animate-spin" { ...spinnerProps } /> }
			{ children }
		</Button>
	);
};

export default LoadButton;
