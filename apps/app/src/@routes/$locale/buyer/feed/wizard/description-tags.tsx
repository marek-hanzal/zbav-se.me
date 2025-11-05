import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	CloseIcon,
} from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { TextInput } from "@use-pico/client/ui/text-input";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useState } from "react";
import { FeedWizardSchema } from "~/app/feed/schema/FeedWizardSchema";

export const Route = createFileRoute(
	"/$locale/buyer/feed/wizard/description-tags",
)({
	validateSearch: FeedWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = Route.useNavigate();
		const [description, setDescription] = useState(
			state.filter?.description,
		);
		const [tags, setTags] = useState(state.filter?.tags);

		return (
			<TitleContainer
				textTitle={"Feed description & Tags (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/feed/wizard/condition"}
						search={state}
						params={{
							locale,
						}}
						tone={"secondary"}
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
						to={"/$locale/buyer/feed/wizard/name"}
						params={{
							locale,
						}}
						search={{
							...state,
							filter: {
								...state.filter,
								description,
								tags,
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
				<Container
					layout={"vertical-centered"}
					items={"center"}
					gap={"md"}
					width={"fit"}
					height={"auto"}
				>
					<Status
						textTitle={"Feed description & tags (title)"}
						textMessage={"Feed description & tags (hint)"}
						action={
							<FormField full>
								{(props) => (
									<TextInput
										value={description ?? ""}
										onChange={(e) =>
											setDescription(e.target.value)
										}
										placeholder={
											"Description (placeholder)"
										}
										autoFocus={!description}
										{...props}
									/>
								)}
							</FormField>
						}
					>
						<FormField full>
							{(props) => (
								<TextInput
									value={tags ?? ""}
									onChange={(e) => setTags(e.target.value)}
									placeholder={"Tags (placeholder)"}
									{...props}
								/>
							)}
						</FormField>
					</Status>
				</Container>
			</TitleContainer>
		);
	},
});
