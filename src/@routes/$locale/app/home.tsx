import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { TitleContainer } from "~/application-ui/ui/container.exports";
import { useTranslator } from "~/translation/hook/useTranslator";
import { HomeMenu } from "~/user-home/ui/HomeMenu/index";

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
