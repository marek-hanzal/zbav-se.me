import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useState } from "react";
import { FeedWizardSchema } from "~/app/feed/schema/FeedWizardSchema";
import { FeedNameContainer } from "~/app/feed/ui/FeedNameContainer";

export const Route = createFileRoute("/$locale/buyer/feed/wizard/name")({
	validateSearch: FeedWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = useNavigate();
		const [name, setName] = useState<string>(state.name || "");

		return (
			<TitleContainer
				textTitle={"Feed name (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/feed/wizard/title"}
						params={{
							locale,
						}}
						search={state}
					/>
				}
				right={
					<ConfirmButton
						iconEnabled={CloseIcon}
						tone={"secondary"}
						confirmProps={{
							tone: "danger",
							onClick: () => {
								navigate({
									to: "/$locale/buyer/feed/select",
									params: {
										locale,
									},
								});
							},
						}}
					/>
				}
				bottom={
					<LinkTo
						to={"/$locale/buyer/feed/wizard/submit"}
						params={{
							locale,
						}}
						search={{
							...state,
							name,
						}}
						full
						disabled={name.length === 0}
					>
						<Button
							tone={"secondary"}
							theme={"dark"}
							iconEnabled={ArrowRightIcon}
							iconPosition={"right"}
							label={"Next - feed submit (button)"}
							size={"lg"}
							full
							disabled={name.length === 0}
						/>
					</LinkTo>
				}
			>
				<FeedNameContainer
					value={name}
					onChange={setName}
				/>
			</TitleContainer>
		);
	},
});
