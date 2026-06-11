import type { FC } from "react";
import { BottomSheet } from "@/lib/client/bottom-sheet";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { Typo } from "@/lib/client/typo";
import { LabelValue } from "@/lib/client/value";
import { CloseButton } from "~/common/ui/button";
import type { PackageSchema } from "~/user/stripe/server/schema/PackageSchema";
import { BundleResourceList } from "./BundleResourceList";
import { CancelButton } from "./CancelButton";
import { PackageCheckoutButton } from "./PackageCheckoutButton";

export namespace PackageSheet {
	export interface Props {
		bundle: PackageSchema.Type;
		isOpen: boolean;
		onClose(): void;
	}
}

export const PackageSheet: FC<PackageSheet.Props> = ({ bundle, isOpen, onClose }) => {
	return (
		<BottomSheet
			data-ui="PackageSheet"
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
						textLabel={"Package description (label)"}
						textValue={<Typo label={bundle.description} />}
					/>
				</Group>

				<BundleResourceList
					bundle={bundle}
					labelPrefix="Package"
				/>

				<Group>
					{!bundle.active ? (
						<PackageCheckoutButton bundle={bundle} />
					) : !bundle.active.cancelAtPeriodEnd ? (
						<CancelButton bundle={bundle.bundle} />
					) : null}
				</Group>
			</Container>
		</BottomSheet>
	);
};
