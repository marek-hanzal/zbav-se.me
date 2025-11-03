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
import { TitleContainer } from "@zbav-se.me/ui";
import { useState } from "react";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";

export const Route = createFileRoute(
	"/$locale/seller/listing/wizard/vendor-model",
)({
	validateSearch: ListingWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = Route.useNavigate();
		const [vendor, setVendor] = useState<string>(state.vendor || "");
		const [model, setModel] = useState<string>(state.model || "");

		return (
			<TitleContainer
				textTitle={"Vendor & Model (title)"}
				textSubtitle={"Vendor & Model (subtitle)"}
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
							vendor,
							model,
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
					layout={"vertical-flex"}
					gap={"md"}
					width={"fit"}
					height={"auto"}
				>
					<Status
						textTitle={"Vendor (title)"}
						textMessage={"Vendor (hint)"}
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
										value={vendor}
										onChange={(e) =>
											setVendor(e.target.value)
										}
										placeholder={"Vendor (placeholder)"}
										autoFocus={!vendor}
										{...props}
									/>
								)}
							</FormField>
						}
					/>

					<Status
						textTitle={"Model (title)"}
						textMessage={"Model (hint)"}
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
										value={model}
										onChange={(e) =>
											setModel(e.target.value)
										}
										placeholder={"Model (placeholder)"}
										{...props}
									/>
								)}
							</FormField>
						}
					/>

					{(vendor || model) && (
						<Container
							layout={"vertical-flex"}
							gap={"sm"}
							width={"fit"}
						>
							<Tx
								label={"Optional fields (hint)"}
								size={"sm"}
							/>
						</Container>
					)}
				</Container>
			</TitleContainer>
		);
	},
});
