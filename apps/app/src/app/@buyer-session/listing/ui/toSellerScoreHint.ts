import { translator } from "@use-pico/common/translator";

export const toSellerScoreHint = (score: number) => {
	return translator.text(`Seller score ${score}`);
};
