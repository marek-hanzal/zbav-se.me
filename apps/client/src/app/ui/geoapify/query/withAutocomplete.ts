import { withQuery } from "@use-pico/client";

export namespace withAutocomplete {
	export interface Props {
		query: string;
		lang: string;
	}
}

export const withAutocomplete = withQuery<withAutocomplete.Props, any>({
	keys(data) {
		return [
			"geoapify",
			"autocomplete",
			data,
		];
	},
	async queryFn({ query, lang }) {
		throw new Error("Not implemented");
	},
});
