import { translator } from "@use-pico/common/translator";

export const toBuyerScoreHint = (score: number) => {
	return translator.text(`Buyer score ${score}`);
};
