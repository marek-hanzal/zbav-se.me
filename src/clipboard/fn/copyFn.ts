export namespace copyFn {
	export interface Props {
		text: string;
	}
}

export const copyFn = async ({ text }: copyFn.Props) => {
	return navigator.clipboard.writeText(text);
};
