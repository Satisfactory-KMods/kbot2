import type { RouteParamsRaw } from '#vue-router';
import type { Simplify } from '@kmods/drizzle-pg';
import cloneDeep from 'lodash/cloneDeep';

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

export type ExtendableParams<T, TTypes = string> = Simplify<
	T & {
		[key: string]: TTypes;
	}
>;

function createQueryHandler<TType extends 'params' | 'query'>(type: TType) {
	return function handler<
		T extends RouteParamsRaw = Record<string, string>,
		CustomParser extends object | undefined = undefined
	>({
		values,
		event = () => {},
		customParser
	}: {
		values?: T;
		event?: () => void;
		customParser?: (params: NoInfer<T>) => CustomParser;
	} = {}) {
		const route = useRoute();
		const router = useRouter();

		function applyParser(params: any): any {
			return cloneDeep(customParser ? customParser(params) : params);
		}

		const params = reactive<
			ExtendableParams<CustomParser extends undefined ? T : CustomParser>
		>(
			applyParser({
				...(values ?? {}),
				...(cloneDeep(route[type]) as any)
			})
		);

		watch(
			() => {
				return params;
			},
			(to) => {
				const applyParams =
					type === 'params'
						? {
								params: unref(to),
								query: route.query,
								hash: route.hash
							}
						: {
								params: route.params,
								query: { ...route.query, ...unref(to) },
								hash: route.hash
							};

				router.replace(applyParams);
				event();
			},
			{ deep: true }
		);

		watch(
			() => {
				return [route.query, route.params];
			},
			refreshParams,
			{ deep: true }
		);

		function refreshParams() {
			Object.assign(params, applyParser({ ...(values ?? {}), ...route[type] }));
		}

		return params;
	};
}

function createQueryHandlerWithSetter<TType extends 'params' | 'query'>(type: TType) {
	return function handler<
		T extends RouteParamsRaw = Record<string, string>,
		CustomParser extends object | undefined = undefined
	>({
		values,
		event = () => {},
		customParser
	}: {
		values?: T;
		event?: () => void;
		customParser?: (params: NoInfer<T>) => CustomParser;
	} = {}) {
		const params = createQueryHandler(type)({ values, event, customParser });

		function setParams(
			value: Partial<
				NoInfer<
					ExtendableParams<
						CustomParser extends undefined ? T : CustomParser,
						string | number | boolean
					>
				>
			>
		) {
			Object.assign(params, value);
		}

		function clearParms() {
			Object.keys(params).forEach((key) => {
				// @ts-ignore
				delete params[key];
			});
		}

		return { params, reffer: toRef(params), setParams, clearParms };
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
export const useParamsSetter = createQueryHandlerWithSetter('params');

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
export const useSearchParamsSetter = createQueryHandlerWithSetter('query');
