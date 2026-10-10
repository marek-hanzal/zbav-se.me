import qs, { type IStringifyOptions } from "qs";

export type ParamMap = Record<string, any>;

type UrlCatConfiguration = Partial<
	Pick<IStringifyOptions, "arrayFormat"> & {
		objectFormat: Partial<Pick<IStringifyOptions, "format">>;
	}
>;

function joinFn(part1: string, separator: string, part2: string): string {
	const p1 = part1.endsWith(separator) ? part1.slice(0, -separator.length) : part1;
	const p2 = part2.startsWith(separator) ? part2.slice(separator.length) : part2;
	return p1 === "" || p2 === "" ? p1 + p2 : p1 + separator + p2;
}

function nullOrUndefinedFn<T>(v: T) {
	return v === undefined || v === null;
}

function removeNullOrUndefFn<P extends ParamMap>(params: P) {
	return Object.entries(params).reduce(
		(result, [key, value]) => {
			if (nullOrUndefinedFn(value)) {
				return result;
			}
			return Object.assign(result, {
				[key]: value,
			});
		},
		{} as { [K in keyof P]: NonNullable<P[K]> },
	);
}

function validatePathParamFn(params: ParamMap, key: string) {
	const allowedTypes = [
		"boolean",
		"string",
		"number",
	];

	if (!Object.hasOwn(params, key)) {
		throw new Error(`Missing value for path parameter ${key}.`);
	}
	if (!allowedTypes.includes(typeof params[key])) {
		throw new TypeError(
			`Path parameter ${key} cannot be of type ${typeof params[key]}. ` +
				`Allowed types are: ${allowedTypes.join(", ")}.`,
		);
	}
	if (typeof params[key] === "string" && params[key].trim() === "") {
		throw new Error(`Path parameter ${key} cannot be an empty string.`);
	}
}

function pathFn(template: string, params: ParamMap) {
	const remainingParams = {
		...params,
	};

	const renderedPath = template.replace(/:[_A-Za-z]+[_A-Za-z0-9]*/g, (p) => {
		// do not replace "::"
		const key = p.slice(1);
		validatePathParamFn(params, key);
		delete remainingParams[key];
		return encodeURIComponent(params[key]);
	});

	return {
		renderedPath,
		remainingParams,
	};
}

function queryFn(params: ParamMap, config?: UrlCatConfiguration): string {
	/* NOTE: Handle quirk of `new UrlSearchParams(params).toString()` in Webkit 602.x.xx
	 *       versions which returns stringified object when params is empty object
	 */
	if (Object.keys(params).length < 1) {
		return "";
	}

	const qsConfiguration: IStringifyOptions = {
		format: config?.objectFormat?.format ?? "RFC1738", // RDC1738 is urlcat's current default. Breaking change if default is changed
		arrayFormat: config?.arrayFormat,
	};

	return qs.stringify(params, qsConfiguration);
}

function joinFullUrlFn(renderedPath: string, baseUrl: string, pathAndQuery: string): string {
	if (renderedPath.length) {
		return joinFn(baseUrl, "/", pathAndQuery);
	} else {
		return joinFn(baseUrl, "?", pathAndQuery);
	}
}

function urlcatFn(
	baseUrl: string,
	pathTemplate: string,
	params: ParamMap = {},
	config: UrlCatConfiguration = {},
): string {
	const { renderedPath, remainingParams } = pathFn(pathTemplate, params);
	const cleanParams = removeNullOrUndefFn(remainingParams);
	const renderedQuery = queryFn(cleanParams, config);
	const pathAndQuery = joinFn(renderedPath, "?", renderedQuery);

	return joinFullUrlFn(renderedPath, baseUrl, pathAndQuery);
}

export namespace linkToFn {
	export interface Props {
		/**
		 * @example
		 * 		linkTo({
		 * 			base: import.meta.env.BASE_URL,
		 * 			href: "/foo/:id/bar?foo=bar",
		 * 			query: { id: "123", foo: "bar" },
		 * 		})
		 */
		base?: string;
		href: string;
		query?: ParamMap;
	}
}

/**
 * Generates a link and replaces "templates" with a proper values from the query object.
 *
 * @group toolbox
 *
 * @example
 * /foo/:id/bar => /foo/123/bar
 */
export const linkToFn = ({ base = "", query = {}, href }: linkToFn.Props) => {
	return urlcatFn(base, href, query);
};
