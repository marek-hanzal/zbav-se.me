import type { FC } from "react";
import { useLocale } from "@/lib/client/locale";
import { translator } from "@/lib/common/translation";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";

export namespace ShopPage {
	export interface Props extends TitleContainer.Props {}
}

/**
 * Composes the route-level shop screen and arranges the main page structure for this flow.
 * Use it from route definitions as the primary UI boundary for the shop journey.
 *
 * @see src/@routes
 */
export const ShopPage: FC<ShopPage.Props> = (props) => {
	const locale = useLocale();

	return (
		<TitleContainer
			textTitle={translator.text("Shop (title)")}
			left={
				<BackHomeButton
					to="/$locale/app/home"
					params={{
						locale,
					}}
				/>
			}
			right={<HomeMenuButton />}
			{...props}
		>
			Shop
		</TitleContainer>
	);
};
