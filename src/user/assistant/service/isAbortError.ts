export namespace isAbortError {
	export interface Props {
		error: unknown;
	}
}

export const isAbortError = ({ error }: isAbortError.Props): boolean => {
	return error instanceof Error && error.name === "AbortError";
};
