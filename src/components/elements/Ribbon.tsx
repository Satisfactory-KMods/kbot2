import { FlowbiteColors } from 'flowbite-react/lib/esm/components/Flowbite/FlowbiteTheme';
import { FC, PropsWithChildren } from 'react';

interface RibbonProps extends PropsWithChildren {
	position?: 'tr' | 'tl' | 'bl' | 'br';
	color?: keyof FlowbiteColors;
}

const Ribbon: FC<RibbonProps> = ({ position, color, children }) => {
	let locationOffset = 'left-[-36px] top-[32px] w-[170px] -rotate-45';
	switch (position) {
		case 'tr':
			locationOffset = 'left-[0px] top-[32px] w-[170px] rotate-45';
			break;
		case 'bl':
			locationOffset = 'left-[-37px] top-[65px] w-[170px] rotate-45';
			break;
		case 'br':
			locationOffset = 'left-[0] top-[65px] w-[170px] -rotate-45';
			break;
	}

	let location = 'left-0 top-0';
	switch (position) {
		case 'tr':
			location = 'right-0 top-0';
			break;
		case 'bl':
			location = 'left-0 bottom-0';
			break;
		case 'br':
			location = 'right-0 bottom-0';
			break;
	}

	const outerClass = 'absolute overflow-hidden h-32 w-32 ' + location;
	const innerClass = `absolute transform bg-${color}-600 text-center text-white font-semibold py-1 ` + locationOffset;

	return (
		<div className={outerClass}>
			<div className={innerClass}>{children}</div>
		</div>
	);
};

Ribbon.defaultProps = {
	color: 'blue',
	position: 'tr'
};

export default Ribbon;
