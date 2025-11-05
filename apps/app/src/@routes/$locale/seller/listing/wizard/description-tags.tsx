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
import { sListingCreate } from "@zbav-se.me/sdk/api/session";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useState } from "react";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";

export const Route = createFileRoute(
	"/$locale/seller/listing/wizard/description-tags",
)({
	validateSearch: ListingWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = Route.useNavigate();
		const [description, setDescription] = useState<string>(
			state.description || "",
		);
		const [tags, setTags] = useState<string>(state.tags || "");

		return (
			<TitleContainer
				textTitle={"Description & Tags (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/seller/listing/wizard/expire-at"}
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
									to: "/$locale/seller",
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
						to={"/$locale/seller/listing/wizard/submit"}
						params={{
							locale,
						}}
						search={{
							...state,
							description,
							tags,
						}}
						full
					>
						<Button
							tone={"secondary"}
							theme={"dark"}
							iconEnabled={ArrowRightIcon}
							iconPosition={"right"}
							label={"Next - submit (button)"}
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
						textTitle={"Description & tags (title)"}
						textMessage={"Description & tags (hint)"}
						action={
							<FormField full>
								{(props) => (
									<TextInput
										value={description}
										onChange={(e) =>
											setDescription(e.target.value)
										}
										placeholder={
											"Description (placeholder)"
										}
										autoFocus={!description}
										maxLength={
											sListingCreate.properties
												.description.maxLength
										}
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
						<FormField full>
							{(props) => (
								<TextInput
									value={tags}
									onChange={(e) => setTags(e.target.value)}
									placeholder={"Tags (placeholder)"}
									maxLength={
										sListingCreate.properties.tags.maxLength
									}
									{...props}
								/>
							)}
						</FormField>

						<Tx
							label={"Description & tags (optional)"}
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
