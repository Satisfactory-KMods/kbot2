export default {
	root: ({ props }) => {
		return {
			class: [
				'relative',
				'flex items-center',

				// Size
				{
					'h-2 w-full min-w-[15rem]': props.orientation === 'horizontal',
					'w-2 h-full min-h-[15rem]': props.orientation === 'vertical'
				},

				// Shape
				'border-0 rounded-lg',

				// Colors
				'bg-surface-100 dark:bg-surface-700',

				// States
				{ 'opacity-60 select-none pointer-events-none cursor-default': props.disabled }
			]
		};
	},
	range: ({ props }) => {
		return {
			class: [
				// Position
				'block absolute',
				{
					'top-0 left-0': props.orientation === 'horizontal',
					'bottom-0 left-0': props.orientation === 'vertical'
				},

				//Size
				{
					'h-full': props.orientation === 'horizontal',
					'w-full': props.orientation === 'vertical'
				},

				//Shape
				'rounded-lg',

				// Colors
				'bg-primary-500 dark:bg-primary-400'
			]
		};
	},
	handle: ({ props }) => {
		return {
			class: [
				'block',

				// Size
				'h-4',
				'w-4',
				{
					'top-[50%] mt-[-0.5rem] ml-[-0.5rem]': props.orientation === 'horizontal',
					'left-[50%] mb-[-0.5rem] ml-[-0.5rem]': props.orientation === 'vertical'
				},

				// Shape
				'rounded-full',
				'ring-2',

				// Colors
				'bg-surface-0 dark:bg-surface-900',
				'ring-primary-500 dark:ring-primary-400',

				// Transitions
				'transition duration-200',

				// Misc
				'cursor-grab',
				'touch-action-none'
			]
		};
	},
	starthandler: ({ props }) => {
		return {
			class: [
				'block',

				// Size
				'h-4',
				'w-4',
				{
					'top-[50%] mt-[-0.5rem] ml-[-0.5rem]': props.orientation === 'horizontal',
					'left-[50%] mb-[-0.5rem] ml-[-0.5rem]': props.orientation === 'vertical'
				},

				// Shape
				'rounded-full',
				'ring-2',

				// Colors
				'bg-surface-0 dark:bg-surface-900',
				'ring-primary-500 dark:ring-primary-400',

				// Transitions
				'transition duration-200',

				// Misc
				'cursor-grab',
				'touch-action-none'
			]
		};
	},
	endhandler: ({ props }) => {
		return {
			class: [
				'block',

				// Size
				'h-4',
				'w-4',
				{
					'top-[50%] mt-[-0.5rem] ml-[-0.5rem]': props.orientation === 'horizontal',
					'left-[50%] mb-[-0.5rem] ml-[-0.5rem]': props.orientation === 'vertical'
				},

				// Shape
				'rounded-full',
				'ring-2',

				// Colors
				'bg-surface-0 dark:bg-surface-900',
				'ring-primary-500 dark:ring-primary-400',

				// Transitions
				'transition duration-200',

				// Misc
				'cursor-grab',
				'touch-action-none'
			]
		};
	}
};
