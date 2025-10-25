import { LetterAIcon } from "~/app/ui/icon/LetterAIcon";
import { LetterBIcon } from "~/app/ui/icon/LetterBIcon";
import { LetterCIcon } from "~/app/ui/icon/LetterCIcon";
import { LetterDIcon } from "~/app/ui/icon/LetterDIcon";
import { LetterEIcon } from "~/app/ui/icon/LetterEIcon";
import { LetterFIcon } from "~/app/ui/icon/LetterFIcon";

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
