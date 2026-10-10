import { LetterAIcon } from "~/application-ui/constant/LetterAIcon";
import { LetterBIcon } from "~/application-ui/constant/LetterBIcon";
import { LetterCIcon } from "~/application-ui/constant/LetterCIcon";
import { LetterDIcon } from "~/application-ui/constant/LetterDIcon";
import { LetterEIcon } from "~/application-ui/constant/LetterEIcon";
import { LetterFIcon } from "~/application-ui/constant/LetterFIcon";

export const RatingToIcon = {
	1: LetterFIcon,
	2: LetterEIcon,
	3: LetterDIcon,
	4: LetterCIcon,
	5: LetterBIcon,
	6: LetterAIcon,
} as const;

type RatingToIcon = typeof RatingToIcon;

export namespace RatingToIcon {
	export type Value = keyof RatingToIcon;
}
