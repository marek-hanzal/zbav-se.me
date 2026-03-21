import { useLocale } from "@use-pico/client/hook";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";

export namespace ShopPage {
	export interface Props extends TitleContainer.Props {}
}

/**
 * Composes the route-level shop screen and arranges the main page structure for this flow.
 * Use it from route definitions as the primary UI boundary for the shop journey.
 *
 * @see apps/app/src/@routes
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
