import { withFallback } from "@/lib/client/fallback";
import { Icon, ShowIcon } from "@/lib/client/icon";
import { useTranslator } from "@/lib/client/translation";
import type { MarkSuspense } from "@/lib/client/type";
import { LabelValue } from "@/lib/client/value";
import type { useView } from "@/lib/client/view";
import { withListingSellerInfoQuery } from "~/buyer/listing/query/withListingSellerInfoQuery";
import { RatingIcon } from "~/common/score/ui/RatingIcon";

export namespace SellerInfoPreview {
	export interface Props extends MarkSuspense.Props {
		listingId: string;
		view: useView.Use<"seller-info">;
	}
}

export const SellerInfoPreview = withFallback(
	({ _suspense, listingId, view }: SellerInfoPreview.Props) => {
		const translator = useTranslator();
		const { data: sellerInfo } = withListingSellerInfoQuery.useSuspenseQuery({
			id: listingId,
		});

		return (
			<LabelValue
				data-ui={"SellerInfoPreview"}
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
	(props: Omit<SellerInfoPreview.Props, "_suspense">) => {
		const translator = useTranslator();

		return (
			<LabelValue
				data-ui={"SellerInfoPreview[pending]"}
				textLabel={translator.text("Listing seller hint (label)")}
				textValue={null}
				action={<Icon icon={ShowIcon} />}
				{...props}
			/>
		);
	},
);
