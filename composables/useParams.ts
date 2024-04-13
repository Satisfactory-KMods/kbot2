import type { RouteParamsRaw } from '#vue-router';
import type { Simplify } from '@kmods/drizzle-pg/utils';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

export type MergeObjectTypes<T, U> = Simplify<{
	[K in keyof T]: K extends keyof U ? T[K] | U[K] : T[K];
}>;

function createQueryHandler(type: 'params' | 'query') {
	return function handler<
		T extends RouteParamsRaw,
		CustomParser extends object | undefined = undefined
	>({
		values,
		event = () => {},
		customParser,
		disabledWatchRouting = type === 'params'
	}: {
		values: T;
		event?: () => void;
		customParser?: (params: T) => CustomParser;
		disabledWatchRouting?: boolean;
	}) {
		function applyParser(params: any): any {
			if (customParser) {
				return customParser(params);
			}
			return params;
		}

		const route = useRoute();
		const router = useRouter();
		const params = reactive<CustomParser extends undefined ? T : CustomParser>(
			applyParser({ ...applyParser(values), ...(cloneDeep(route[type]) as any) })
		);
		const reffer = toRef(params);

		watch(
			() => {
				return reffer.value;
			},
			() => {
				setParams(reffer.value as any, true, false, disabledWatchRouting);
			},
			{
				deep: true,
				immediate: true
			}
		);

		watch(
			() => {
				return route[type];
			},
			async (nv, ov) => {
				let dirty = false;

				if (!ov || !nv) {
					dirty = true;
				} else {
					const onv = applyParser(ov);
					const pnv = applyParser(nv);
					for (const key in values) {
						if (!isEqual(pnv[key], onv[key])) {
							dirty = true;
							break;
						}
					}
				}

				if (!dirty || process.server) return;

				await nextTick();
				refreshParams();
				event?.();
			},
			{ immediate: true, deep: true }
		);

		function refreshParams() {
			const newParams = applyParser(route[type]);
			const defaultParsed = applyParser(values);
			for (const key in values) {
				// @ts-ignore
				params[key] = (!newParams[key] ? defaultParsed[key] : newParams[key]) as any;
			}
		}
		refreshParams();

		function updateRoute(replace = false, resetQuery = false, noRouting = false) {
			const stritifyParams = Object.entries({ ...route[type], ...params }).reduce(
				(acc, [key, value]) => {
					acc[key] = String(value);
					return acc;
				},
				{} as any
			);
			const applyParams =
				type === 'params'
					? {
							params: stritifyParams,
							query: resetQuery ? {} : route.query,
							hash: route.hash
						}
					: { params: route.params, query: stritifyParams, hash: route.hash };

			if (noRouting) return;

			if (replace) {
				// @ts-ignore
				return router.replace(applyParams);
			}
			// @ts-ignore
			router.push(applyParams);
		}

		function setParams(
			newParams: Partial<MergeObjectTypes<T, CustomParser>>,
			replace = false,
			resetQuery = false,
			noRouting = false
		) {
			Object.assign(params, applyParser(newParams));
			updateRoute(replace, resetQuery, noRouting);
		}

		function hasParam<Key extends keyof T>(key: Key, value: T[Key]) {
			// @ts-ignore
			return params[key] === value;
		}

		return {
			params: readonly(params),
			reffer,
			hasParam,
			updateRoute,
			setParams,
			refreshParams
		};
	};
}

/**
 * Reactively watch the params of the current route
 * @param values default params to set
 * @param event event to call when the params are updated
 * @return params and event as ref z
 * @example ```ts
 * const { params, refs, onParamsUpdated } = useParams({
 *      values: { search: '' },
 *      event: () => {
 *          console.log('params updated', params);
 *          fetch(params.value.search);
 *      }
 * });
 *
 * <input class="form-control" v-model="refs.search" />
 * ```
 */
export const useParams = createQueryHandler('params');

/**
 * Reactively watch the params of the current route
 * @param values default params to set
 * @param event event to call when the params are updated
 * @return params and event as ref z
 * @example ```ts
 * const { params, refs, onParamsUpdated } = useSearchParams({
 *      values: { search: '' },
 *      event: () => {
 *          console.log('params updated', params);
 *          fetch(params.value.search);
 *      }
 * });
 *
 * <input class="form-control" v-model="refs.search" />
 * ```
 */
export const useSearchParams = createQueryHandler('query');
