export namespace getResponseError {
	export interface Props {
		response: Response;
	}
}

export const getResponseError = async ({ response }: getResponseError.Props): Promise<string> => {
	const text = await response.text();

	return text.length > 0 ? text : "Assistant request failed";
};
