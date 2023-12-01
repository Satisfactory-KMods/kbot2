import React, { useMemo, useState } from 'react';

/**
 * [ ShowElements, TotalPage, page, setPage, setData ]
 */
export default function usePages<T>(
	initValue: T[] | (() => T[]),
	maxPerPage = 5,
	initPage = 1
): [T[], number, number, React.Dispatch<React.SetStateAction<number>>, React.Dispatch<React.SetStateAction<T[]>>, T[]] {
	const [data, setData] = useState(initValue);
	const [page, setPage] = useState(initPage);

	const TotalPage = useMemo(() => {
		return Math.ceil(data.length / maxPerPage);
	}, [data, maxPerPage]);

	const ShowElements = useMemo(() => {
		return [...data].splice((page - 1) * maxPerPage, maxPerPage);
	}, [data, page, maxPerPage]);

	return [ShowElements, TotalPage, page, setPage, setData, data];
}
