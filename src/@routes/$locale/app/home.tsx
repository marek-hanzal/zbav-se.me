import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { TitleContainer } from "~/common/ui/container";
import { useTranslator } from "~/translation/hook/useTranslator";
import { HomeMenu } from "~/user/home/HomeMenu";

export const Route = createFileRoute("/$locale/app/home")({
	component() {
		const translator = useTranslator();
		return (
			<TitleContainer
				data-ui={"Home[TitleContainer]"}
				textTitle={translator.text("zbav-se.me")}
			>
				<Suspense fallback={<HomeMenu.Fallback />}>
					<HomeMenu _suspense={"I know"} />
				</Suspense>
			</TitleContainer>
		);
	},
});
