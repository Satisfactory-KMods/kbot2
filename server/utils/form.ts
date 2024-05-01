import type formidable from 'formidable';

export function parseFormidable<
	T extends {
		[key: string]: any;
	}
>(input: formidable.Fields): T {
	return Object.entries(input).reduce<T>((acc, curr) => {
		const [key, value] = curr;
		let v: any = value?.[0];

		if (v !== undefined) {
			if (/(true|false)/.test(String(v))) {
				v = v === 'true';
			} else if (/^[0-9]+$/.test(String(v))) {
				v = Number(v);
			}
		}

		// @ts-ignore
		acc[key] = v;
		return acc;
	}, {} as any);
}
