import { type FC, Suspense } from "react";
import { useTranslator } from "@/lib/client/translation";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenu } from "../HomeMenu";

export namespace HomePage {
	export interface Props extends TitleContainer.Props {
		//
	}
}

/**
 * Composes the route-level home screen and arranges the main page structure for this flow.
 * Use it from route definitions as the primary UI boundary for the home journey.
 */
export const HomePage: FC<HomePage.Props> = (props) => {
	const translator = useTranslator();
	return (
		<TitleContainer
			data-ui={"HomePage"}
			textTitle={translator.text("zbav-se.me")}
			{...props}
		>
			<Suspense fallback={<HomeMenu.Fallback />}>
				<HomeMenu _suspense={"I know"} />
			</Suspense>
		</TitleContainer>
	);
};
