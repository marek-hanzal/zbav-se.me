import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Button,
	LinkTo,
} from "@use-pico/client";
import { TitleContainer } from "@zbav-se.me/ui";
import { useState } from "react";
import { FeedWizardSchema } from "~/app/feed/schema/FeedWizardSchema";
import { Rating } from "~/app/ui/rating/Rating";

export const Route = createFileRoute("/$locale/buyer/feed/wizard/condition")({
	validateSearch: FeedWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const [rating, setRating] = useState<number>(0);

		return (
			<TitleContainer
				textTitle={"Feed condition (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/feed/wizard/sort"}
						params={{
							locale,
						}}
						search={{
							...state,
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
					textHint={(value) => `Rating - ${value}`}
					value={rating}
					onChange={setRating}
				/>
			</TitleContainer>
		);
	},
});
