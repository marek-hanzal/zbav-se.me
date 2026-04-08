export namespace buildAssistantUrl {
	export interface Props {
		href?: string;
		pathname?: string;
		search?: unknown;
		hash?: unknown;
	}
}

export const buildAssistantUrl = ({
	href,
	pathname,
	search,
	hash,
}: buildAssistantUrl.Props): string => {
	if (href) {
		return href;
	}

	return [
		pathname ?? "",
		typeof search === "string" ? search : "",
		typeof hash === "string" ? hash : "",
	].join("");
};
