import { createFileRoute } from "@tanstack/react-router";
import { useSelection } from "@use-pico/client";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	CloseIcon,
} from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TitleContainer } from "@zbav-se.me/ui";
import { FeedWizardSchema } from "~/app/feed/schema/FeedWizardSchema";
import { Rating } from "~/app/ui/rating/Rating";

export const Route = createFileRoute("/$locale/buyer/feed/wizard/condition")({
	validateSearch: FeedWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();

		const selection = useSelection<Rating.RatingItem>({
			mode: "multi",
			initial: state.filter?.conditionIn?.map((item) => ({
				id: String(item),
			})),
		});

		const conditionIn = selection.optional
			.multi()
			.map((item) => Number.parseInt(item.id, 10));

		return (
			<TitleContainer
				textTitle={"Feed condition (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/feed/wizard/category"}
						params={{
							locale,
						}}
						search={{
							...state,
						}}
						tone={"secondary"}
					/>
				}
				right={
					<LinkTo
						icon={CloseIcon}
						to={"/$locale/buyer/feed/select"}
						params={{
							locale,
						}}
						tone={"secondary"}
					/>
				}
				bottom={
					<LinkTo
						to={"/$locale/buyer/feed/wizard/name"}
						params={{
							locale,
						}}
						search={{
							...state,
							filter: {
								...state.filter,
								conditionIn,
							},
						}}
						full
					>
						<Button
							tone={"secondary"}
							theme={"dark"}
							iconEnabled={ArrowRightIcon}
							iconPosition={"right"}
							label={"Next - feed name (button)"}
							size={"lg"}
							full
						/>
					</LinkTo>
				}
			>
				<Rating
					textHint={(value) =>
						`Condition - Overall [${value}] (hint)`
					}
					selection={selection}
				/>
			</TitleContainer>
		);
	},
});
