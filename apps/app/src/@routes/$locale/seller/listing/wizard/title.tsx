import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@use-pico/client/icon";
import { asBadge } from "@use-pico/client/ui/badge";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Mx } from "@use-pico/client/ui/mx";
import { Status } from "@use-pico/client/ui/status";
import { TextInput } from "@use-pico/client/ui/text-input";
import { sListingCreate } from "@zbav-se.me/sdk/api/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useState } from "react";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";

export const Route = createFileRoute("/$locale/seller/listing/wizard/title")({
	validateSearch: ListingWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = Route.useNavigate();
		const [title, setTitle] = useState<string>(state.title || "");

		return (
			<TitleContainer
				data-ui={"Title"}
				textTitle={"Listing title (title)"}
				left={
					<LinkTo
						{...asBadge({
							round: "full",
							size: "md",
						})}
						icon={ArrowLeftIcon}
						to={"/$locale/seller/listing/wizard/expire-at"}
						search={state}
						params={{
							locale,
						}}
					/>
				}
				right={
					<ConfirmButton
						iconEnabled={CloseIcon}
						tone={"secondary"}
						iconProps={{
							size: "md",
						}}
						confirmProps={{
							tone: "danger",
							onClick: () => {
								navigate({
									to: "/$locale/seller",
								});
							},
						}}
					/>
				}
				bottom={
					<LinkTo
						to={"/$locale/seller/listing/wizard/submit"}
						params={{
							locale,
						}}
						search={{
							...state,
							title,
						}}
						disabled={!title}
					>
						<Button
							tone={"secondary"}
							theme={"dark"}
							iconEnabled={ArrowRightIcon}
							iconPosition={"right"}
							label={"Next - submit (button)"}
							size={"lg"}
							disabled={!title}
						/>
					</LinkTo>
				}
			>
				<Container
					layout={"vertical-centered"}
					gap={"md"}
					height={"auto"}
					width={"full"}
				>
					<Status
						textTitle={"Listing title (title)"}
						action={
							<FormField full>
								{(props) => (
									<TextInput
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										placeholder={"Listing title (placeholder)"}
										autoFocus={!title}
										minLength={sListingCreate.properties.title.minLength}
										maxLength={sListingCreate.properties.title.maxLength}
										{...props}
									/>
								)}
							</FormField>
						}
					>
						<Mx
							label={"Listing title (required)"}
							tone={"secondary"}
						/>
					</Status>
				</Container>
			</TitleContainer>
		);
	},
});
