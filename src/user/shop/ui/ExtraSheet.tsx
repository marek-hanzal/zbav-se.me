import type { FC } from "react";
import { BottomSheet } from "@/lib/client/bottom-sheet";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { Typo } from "@/lib/client/typo";
import { LabelValue } from "@/lib/client/value";
import { CloseButton } from "~/common/ui/button";
import type { ExtraSchema } from "~/user/stripe/server/schema/ExtraSchema";
import { BundleResourceList } from "./BundleResourceList";
import { ExtraCheckoutButton } from "./ExtraCheckoutButton";

export namespace ExtraSheet {
	export interface Props {
		bundle: ExtraSchema.Type;
		isOpen: boolean;
		onClose(): void;
	}
}

export const ExtraSheet: FC<ExtraSheet.Props> = ({ bundle, isOpen, onClose }) => {
	return (
		<BottomSheet
			data-ui="ExtraSheet"
			isOpen={isOpen}
			onClose={onClose}
			detent="default"
			contentProps={{
				disableScroll: true,
			}}
			withHeader
			header={({ close }) => ({
				title: bundle.name,
				right: <CloseButton onClick={close} />,
			})}
		>
			<Container
				data-ui-layout="vertical-flex"
				data-ui-gap="default"
				data-ui-inner="default"
				data-ui-height="full"
				data-ui-scroll="vertical"
			>
				<Group>
					<LabelValue
						textLabel={"Extra description (label)"}
						textValue={<Typo label={bundle.description} />}
					/>
				</Group>

				<BundleResourceList
					bundle={bundle}
					labelPrefix="Extra"
				/>

				<Group>
					<ExtraCheckoutButton bundle={bundle} />
				</Group>
			</Container>
		</BottomSheet>
	);
};
