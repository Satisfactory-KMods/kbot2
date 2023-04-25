import {
	AllHTMLAttributes,
	FC,
	PropsWithChildren,
	useMemo
}                 from "react";
import { ERoles } from "@shared/Enum/ERoles";
import useAuth    from "./useAuth";

export interface IShowConditionProps extends PropsWithChildren, AllHTMLAttributes<HTMLDivElement> {
	show : boolean;
}

const ShowCondition : FC<IShowConditionProps> = ( { show, children, ...props } ) => {
	if ( !show ) {
		return null;
	}

	return (
		<div { ...props }>
			{ children }
		</div>
	);
};


export interface IuseAuthCond {
	loggedIn : boolean;
	role : ERoles;
}


const useAuthValidate = ( condition : Partial<IuseAuthCond> ) : Partial<IShowConditionProps> => {
	const [ user ] = useAuth();

	const show = useMemo( () => {
		if ( condition.loggedIn !== undefined || condition.role !== undefined ) {
			const needToBeLoggedIn = condition.loggedIn || condition.role === undefined;
			if ( condition.role !== undefined ) {
				return user.HasPermssion( condition.role );
			}
			return needToBeLoggedIn === user.IsValid;
		}
		return true;
	}, [ condition, user ] );

	return {
		show: true
	};
};

export default useAuthValidate;
export { ShowCondition };