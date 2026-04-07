/**
 * TODO This... you know what
 */
export type MessageUi = {
	id: string;
	role: string;
	parts: {
		type: string;
		text: string;
	}[];
};
