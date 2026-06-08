import type { FC } from "react";
import { useLocale } from "@/lib/client/locale";
import { useTranslator } from "@/lib/client/translation";
import type { MarkSuspense } from "@/lib/client/type";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
import { BundleSelect } from "../ui/BundleSelect";

export namespace ShopPage {
	export interface Props extends TitleContainer.Props, MarkSuspense.Props {
		//
	}
}

export const ShopPage: FC<ShopPage.Props> = ({ _suspense, ...props }) => {
	const locale = useLocale();
	const translator = useTranslator();

	return (
		<TitleContainer
			textTitle={translator.text("Shop (title)", "Obchod")}
			textSubtitle={translator.text(
				"Shop (subtitle)",
				"Předplatné a balíčky bez schovaných triků. Hnusně dospělé, já vím.",
			)}
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
			<BundleSelect _suspense={_suspense} />
		</TitleContainer>
	);
};
