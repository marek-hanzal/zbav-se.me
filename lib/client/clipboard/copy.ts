export namespace copy {
	export interface Props {
		text: string;
	}
}

export const copy = async ({ text }: copy.Props) => {
	return navigator.clipboard.writeText(text);
};
