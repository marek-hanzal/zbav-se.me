import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, LinkTo } from "@use-pico/client";
import { TitleContainer } from "@zbav-se.me/ui";
import { FeedWizardSchema } from "~/app/feed/schema/FeedWizardSchema";

export const Route = createFileRoute("/$locale/buyer/feed/wizard/sort")({
	validateSearch: FeedWizardSchema,
	component() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				textTitle={"Feed sorting (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/feed/select"}
						params={{
							locale,
						}}
						tone={"secondary"}
					/>
				}
			>
				blabla
			</TitleContainer>
		);
	},
});
