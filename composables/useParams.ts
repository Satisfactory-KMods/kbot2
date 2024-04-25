import type { RouteParamsRaw } from '#vue-router';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

export type MergeObjectTypes<T, U> = Simplify<{
	[K in keyof T]: K extends keyof U ? T[K] | U[K] : T[K];
}>;

export function EmptyOrNull(value: unknown): boolean {
	return value === null || value === undefined || value === '';
}

export function SafeNumber<T = number>(value: unknown, fallback = -1): T {
	const result = Number(value);
	if (Number.isNaN(result as any) || EmptyOrNull(value)) return fallback as any;
	return result as any;
}

export function SafeString<T = string>(value: unknown, fallback = ''): T {
	return (EmptyOrNull(value) ? fallback : String(value)) as any;
}

export function FallBack<T>(a: T, b: NoInfer<T>): T {
	return EmptyOrNull(a) ? b : a;
}

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
		const route = useRoute();
		const router = useRouter();

		function applyParser(params: any): any {
			const newParams = cloneDeep(customParser ? customParser(params) : params);
			if (customParser) log('info', 'applyParser', { newParams, params, customParser });

			const keys = Object.keys(values);

			for (const key in newParams) {
				if (!keys.includes(key)) {
					delete newParams[key];
				}
			}

			return newParams;
		}

		const params = reactive<CustomParser extends undefined ? T : CustomParser>(
			applyParser({ ...values, ...(cloneDeep(route[type]) as any) })
		);

		const _params = computed<CustomParser extends undefined ? T : CustomParser>({
			get() {
				return params as any;
			},
			set(value: any) {
				setParamsNoParser(value, true, false, disabledWatchRouting);
			}
		});

		watch(
			() => {
				return [route.query, route.params];
			},
			([cq, cp], [oq, op]) => {
				const ov = type === 'params' ? op : oq;
				const nv = type === 'params' ? cp : cq;

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

				refreshParams();
				event?.();
			},
			{ deep: true }
		);

		function refreshParams() {
			const newParams = applyParser(route[type]);
			const defaultParsed = applyParser(values);
			for (const key in values) {
				// @ts-ignore
				params[key] = FallBack(newParams[key], defaultParsed[key]);
			}
		}

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

		function setParamsNoParser(
			newParams: Partial<MergeObjectTypes<T, CustomParser>>,
			replace = false,
			resetQuery = false,
			noRouting = false
		) {
			Object.assign(params, newParams);
			updateRoute(replace, resetQuery, noRouting);
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
			params: toReactive(_params),
			hasParam,
			updateRoute,
			setParams,
			setParamsNoParser,
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
