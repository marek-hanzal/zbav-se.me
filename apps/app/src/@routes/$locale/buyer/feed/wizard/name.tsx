import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	CloseIcon,
} from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { FormField } from "@use-pico/client/ui/form";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { TextInput } from "@use-pico/client/ui/text-input";
import { TitleContainer } from "@zbav-se.me/ui";
import { useState } from "react";
import { FeedWizardSchema } from "~/app/feed/schema/FeedWizardSchema";

export const Route = createFileRoute("/$locale/buyer/feed/wizard/name")({
	validateSearch: FeedWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = useNavigate();
		const [name, setName] = useState<string>(state.name || "");

		const handleSubmit = () => {
			if (name.length > 0) {
				navigate({
					to: "/$locale/buyer/feed/wizard/submit",
					params: {
						locale,
					},
					search: {
						...state,
						name,
					},
				});
			}
		};

		return (
			<TitleContainer
				textTitle={"Feed name (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/feed/wizard/condition"}
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
				<Status
					textTitle={"Feed name (title)"}
					textMessage={"Feed name (hint)"}
					action={
						<FormField
							tweak={{
								slot: {
									root: {
										class: [
											"w-full",
										],
									},
								},
							}}
						>
							{(props) => (
								<TextInput
									value={name}
									onChange={(e) => setName(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											handleSubmit();
										}
									}}
									placeholder={"Feed name (placeholder)"}
									autoFocus={!name}
									{...props}
								/>
							)}
						</FormField>
					}
				/>
			</TitleContainer>
		);
	},
});
