import { LetterAIcon, LetterBIcon, LetterCIcon, LetterDIcon, LetterEIcon, LetterFIcon } from "@zbav-se.me/ui/icon";

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
