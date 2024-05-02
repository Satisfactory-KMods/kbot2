/* eslint-disable no-console */

/**
 * vue directive to detect click outside of an element
 * use v-click-outside="function" or v-click-outside="{active: true, fn: function}"
 * will call the function when a click outside of the element is detected
 * will pass the click event to the function
 */
export default defineNuxtPlugin((nuxt) => {
	nuxt.vueApp.directive('click-outside', {
		mounted: (el, { value }) => {
			try {
				if (typeof value === 'undefined') return;
				let active = true;
				let fn: Function;
				if (typeof value === 'function') {
					fn = value;
				} else if (typeof value === 'object') {
					active = !!value.active;
					if (typeof value.fn === 'function') {
						fn = value.fn;
					} else {
						throw new TypeError('v-click-outside value must be a function or object');
					}
				} else {
					throw new TypeError('v-click-outside value must be a function or object');
				}

				if (!active) return;
				el.clickOutsideEvent = function (event: any) {
					if (!(el === event.target || el.contains(event.target))) {
						fn(event);
					}
				};
				document.body.addEventListener('click', el.clickOutsideEvent);
			} catch (e: any) {
				console.error('v-click-outside error:', el, e);
			}
		},
		updated: (el, { value }) => {
			try {
				document.body.removeEventListener('click', el.clickOutsideEvent);
				if (typeof value === 'undefined') return;

				let active = true;
				let fn: Function;
				if (typeof value === 'function') {
					fn = value;
				} else if (typeof value === 'object') {
					active = !!value.active;
					if (typeof value.fn === 'function') {
						fn = value.fn;
					} else {
						throw new TypeError('v-click-outside value must be a function or object');
					}
				} else {
					throw new TypeError('v-click-outside value must be a function or object');
				}

				if (!active) return;
				el.clickOutsideEvent = function (event: any) {
					if (!(el === event.target || el.contains(event.target))) {
						fn(event);
					}
				};
				document.body.addEventListener('click', el.clickOutsideEvent);
			} catch (e: any) {
				console.error('v-click-outside error:', el, e);
			}
		},
		beforeUnmount: (el) => {
			document.body.removeEventListener('click', el.clickOutsideEvent);
		}
	});
});
