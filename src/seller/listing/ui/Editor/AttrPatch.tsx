import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { ArrowRightIcon } from "@/lib/client/icon";
import { Tx } from "@/lib/client/tx";
import type { useView } from "@/lib/client/view2";
import { translator } from "@/lib/common/translator";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { EditAction } from "~/common/ui/action/EditAction";
import { TitleContainer } from "~/common/ui/container";
import type { AttrOfSchema } from "~/user/attr/server/schema/AttrOfSchema";

export namespace AttrPatch {
	export interface Props extends TitleContainer.Props {
		listingId: string;
		attr: AttrOfSchema.Type;
		view: useView.Use<any>;
	}
}

export const AttrPatch: FC<AttrPatch.Props> = ({ listingId, attr, view, ...props }) => {
	return (
		<TitleContainer
			data-ui={`AttrPatch-${attr.name}`}
			textTitle={translator.text(`Field patch - ${attr.name} (title)`)}
			left={<EditAction />}
			data-ui-layout={"vertical-header-content"}
			{...props}
		>
			<Container
				data-ui-layout="vertical-content-footer"
				data-ui-height="full"
				data-ui-width="full"
				data-ui-inner="default"
				data-ui-gap="default"
			>
				<div>patch stuff</div>

				<SaveContainer
					onCancel={() => {
						view.set("default");
					}}
					onSave={() => {
						// mutation.mutate({
						// 	patch: {
						// 		age,
						// 	},
						// 	query: {
						// 		where: {
						// 			id: listing.id,
						// 		},
						// 	},
						// });
					}}
					// loading={mutation.isPending}
					loading={false}
					disabled={false}
					textSave={<Tx label={"Continue (label)"} />}
					textCancel={<Tx label={"Back (label)"} />}
					saveProps={{
						iconEnabled: ArrowRightIcon,
						iconPosition: "right",
					}}
				/>
			</Container>
		</TitleContainer>
	);
};
