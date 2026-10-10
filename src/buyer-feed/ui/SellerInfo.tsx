import { withListingSellerInfoQuery } from "~/buyer-listing/query/withListingSellerInfoQuery";
import { RatingIcon } from "~/score/ui/RatingIcon";
import { useTranslator } from "~/translation/hook/useTranslator";
import { ShowIcon } from "~/ui/constant/ShowIcon";
import { withFallbackFn } from "~/ui/fn/withFallbackFn";
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

export const SellerInfo = withFallbackFn(
	({ _suspense, listingId, view }: SellerInfo.Props) => {
		const translator = useTranslator();
		const { data: sellerInfo } = withListingSellerInfoQuery.useSuspenseQuery({
			id: listingId,
		});

		return (
			<LabelValue
				data-ui={"SellerInfo[LabelValue]"}
				data-action={"open seller info"}
				textLabel={translator.textFn("Listing seller hint (label)")}
				textValue={
					sellerInfo.events ? <RatingIcon rating={sellerInfo.events.score.rank} /> : null
				}
				textEmpty={translator.textFn("Listing seller info not available (empty)")}
				action={<Icon icon={ShowIcon} />}
				onClick={() => view.setFn("seller-info")}
			/>
		);
	},
	(props: Omit<SellerInfo.Props, "_suspense">) => {
		const translator = useTranslator();
		return (
			<LabelValue
				textLabel={translator.textFn("Listing seller hint (label)")}
				textValue={null}
				action={<Icon icon={ShowIcon} />}
				{...props}
			/>
		);
	},
);
