import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { useLocale } from "@/lib/client/locale";
import { useTranslator } from "@/lib/client/translation";
import type { MarkSuspense } from "@/lib/client/type";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
import { ExtraSelect } from "../ui/ExtraSelect";
import { PackageSelect } from "../ui/PackageSelect";

export namespace ShopPage {
	export interface Props extends TitleContainer.Props, MarkSuspense.Props {
		//
	}
}

export const ShopPage: FC<ShopPage.Props> = ({ _suspense, ...props }) => {
	const translator = useTranslator();
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
			<Container
				data-ui="ShopContent"
				data-ui-layout="vertical"
				data-ui-gap="xl"
				data-ui-inner="default"
				data-ui-scroll="vertical"
			>
				<PackageSelect _suspense={_suspense} />
				<ExtraSelect _suspense={_suspense} />
			</Container>
		</TitleContainer>
	);
};
