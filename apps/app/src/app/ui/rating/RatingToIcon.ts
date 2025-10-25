import { LetterAIcon } from "../../../../../../packages/@zbav-se.me/ui/src/icon/LetterAIcon";
import { LetterBIcon } from "../../../../../../packages/@zbav-se.me/ui/src/icon/LetterBIcon";
import { LetterCIcon } from "../../../../../../packages/@zbav-se.me/ui/src/icon/LetterCIcon";
import { LetterDIcon } from "../../../../../../packages/@zbav-se.me/ui/src/icon/LetterDIcon";
import { LetterEIcon } from "../../../../../../packages/@zbav-se.me/ui/src/icon/LetterEIcon";
import { LetterFIcon } from "../../../../../../packages/@zbav-se.me/ui/src/icon/LetterFIcon";

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
