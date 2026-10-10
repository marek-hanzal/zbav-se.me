import { withListingSellerInfoQuery } from "~/buyer/listing/query/withListingSellerInfoQuery";
import { RatingIcon } from "~/common/score/ui/RatingIcon";
import { useTranslator } from "~/translation/hook/useTranslator";
import { ShowIcon } from "~/ui/constant/ShowIcon";
import { withFallback } from "~/ui/fn/withFallback";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Icon } from "~/ui/ui/Icon";
import { LabelValue } from "~/ui/ui/LabelValue";
import type { useView } from "~/view/hook/useView";

export namespace SellerInfo {
	export interface Props extends MarkSuspense.Props {
		listingId: string;
		view: useView.Use<"seller-info">;
	}
}

export const SellerInfo = withFallback(
	({ _suspense, listingId, view }: SellerInfo.Props) => {
		const translator = useTranslator();
		const { data: sellerInfo } = withListingSellerInfoQuery.useSuspenseQuery({
			id: listingId,
		});

		return (
			<LabelValue
				data-ui={"SellerInfo[LabelValue]"}
				data-action={"open seller info"}
				textLabel={translator.text("Listing seller hint (label)")}
				textValue={
					sellerInfo.events ? <RatingIcon rating={sellerInfo.events.score.rank} /> : null
				}
				textEmpty={translator.text("Listing seller info not available (empty)")}
				action={<Icon icon={ShowIcon} />}
				onClick={() => view.set("seller-info")}
			/>
		);
	},
	(props: Omit<SellerInfo.Props, "_suspense">) => {
		const translator = useTranslator();
		return (
			<LabelValue
				textLabel={translator.text("Listing seller hint (label)")}
				textValue={null}
				action={<Icon icon={ShowIcon} />}
				{...props}
			/>
		);
	},
);
