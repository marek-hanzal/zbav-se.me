import { LetterAIcon } from "../icon/LetterAIcon";
import { LetterBIcon } from "../icon/LetterBIcon";
import { LetterCIcon } from "../icon/LetterCIcon";
import { LetterDIcon } from "../icon/LetterDIcon";
import { LetterEIcon } from "../icon/LetterEIcon";
import { LetterFIcon } from "../icon/LetterFIcon";

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
