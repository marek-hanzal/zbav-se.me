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
import { Tx } from "@use-pico/client/ui/tx";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useState } from "react";
import { FeedWizardSchema } from "~/app/feed/schema/FeedWizardSchema";

export const Route = createFileRoute("/$locale/buyer/feed/wizard/title")({
	validateSearch: FeedWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = Route.useNavigate();
		const [title, setTitle] = useState(state.filter?.title || "");

		return (
			<TitleContainer
				textTitle={"Feed title (title)"}
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
								title,
							},
						}}
						disabled={!title}
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
							disabled={!title}
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
						textTitle={"Feed title (title)"}
						textMessage={"Feed title (hint)"}
						action={
							<FormField full>
								{(props) => (
									<TextInput
										value={title}
										onChange={(e) =>
											setTitle(e.target.value)
										}
										placeholder={"Title (placeholder)"}
										autoFocus={!title}
										{...props}
									/>
								)}
							</FormField>
						}
						tweak={{
							slot: {
								body: {
									class: [
										"flex",
										"flex-col",
										"gap-8",
										"items-center",
									],
								},
							},
						}}
					>
						<Tx
							label={"Title (required)"}
							size={"sm"}
							tone={"secondary"}
							display={"block"}
							wrap={"wrap"}
						/>
					</Status>
				</Container>
			</TitleContainer>
		);
	},
});
