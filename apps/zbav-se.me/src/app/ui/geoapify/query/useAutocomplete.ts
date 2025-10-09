import { withQuery } from "@use-pico/client";

export const useAutocomplete = withQuery<string, any>({
	keys(data) {
		return [
			"geoapify",
			"autocomplete",
			data,
		];
	},
	async queryFn(data) {
		// const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${data.query}&apiKey=${process.env.GEOAPIFY_API_KEY}`);
	},
});
