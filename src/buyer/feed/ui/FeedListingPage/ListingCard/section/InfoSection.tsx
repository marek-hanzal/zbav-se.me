import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { Markdown } from "@/lib/client/markdown";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { Typo } from "@/lib/client/typo";
import { LabelValue, ValueList } from "@/lib/client/value";
import { translator } from "@/lib/common/translator";
import type { ListingSchema } from "~/buyer/listing/server/schema/ListingSchema";
import { CategoryInline } from "~/session/category/ui/CategoryInline";
import { SellerInfo } from "../../SellerInfo";

export namespace InfoSection {
	export interface Props extends MarkSuspense.Props {
		listing: ListingSchema.Type;
		onView(view: "seller-info"): void;
	}
}

export const InfoSection: FC<InfoSection.Props> = ({ _suspense, listing, onView }) => {
	return (
		<Container
			data-ui={"InfoSection"}
			data-ui-layout="vertical-flex"
			data-ui-gap="default"
		>
			<Group>
				<ValueList
					textLabel={translator.text("Listing restrictions (label)")}
					textEmpty={translator.text("Listing restrictions (empty)")}
					items={listing.restrictions.map((id) => ({
						id,
					}))}
					renderFn={({ id }) => {
						return <Tx label={`Listing restriction - ${id}`} />;
					}}
				/>
			</Group>

			<Group>
				<LabelValue
					textLabel={translator.text("Listing category (label)")}
					textValue={
						<CategoryInline
							_suspense={"I know"}
							categoryId={listing.category.id}
							data-ui-tone="secondary"
							data-ui-theme="light"
						/>
					}
				/>
			</Group>

			{listing.description ? (
				<Group>
					<LabelValue
						textLabel={translator.text("Listing description (label)")}
						textValue={<Markdown>{listing.description}</Markdown>}
					/>
				</Group>
			) : null}

			{listing.pros?.length || listing.cons?.length ? (
				<Group>
					{listing.pros?.length ? (
						<ValueList
							textLabel={translator.text("Listing - Pros (label)")}
							textEmpty={translator.text("Listing - Pros not filled")}
							items={listing.pros.map((pro, index) => ({
								id: String(index),
								pro,
							}))}
							renderFn={(item) => <Typo label={item.pro} />}
						/>
					) : null}

					{listing.cons?.length ? (
						<ValueList
							textLabel={translator.text("Listing - Cons (label)")}
							textEmpty={translator.text("Listing - Cons not filled")}
							items={listing.cons.map((con, index) => ({
								id: String(index),
								con,
							}))}
							renderFn={(item) => <Typo label={item.con} />}
						/>
					) : null}
				</Group>
			) : null}

			{listing.delivery?.length ? (
				<Group>
					<ValueList
						textLabel={translator.text("Listing delivery (label)")}
						textEmpty={translator.text("Delivery not selected")}
						items={(listing.delivery ?? []).map((delivery) => ({
							id: delivery,
							delivery,
						}))}
						renderFn={(item) => <Tx label={`Listing delivery - ${item.delivery}`} />}
					/>
				</Group>
			) : null}

			{listing.warranty !== null ? (
				<Group>
					<LabelValue
						textLabel={translator.text("Listing warranty (label)")}
						textValue={<Tx label={`Listing warranty - ${listing.warranty}`} />}
					/>
				</Group>
			) : null}

			{listing.condition || listing.age ? (
				<Group>
					{listing.condition ? (
						<LabelValue
							textLabel={translator.text("Listing condition (label)")}
							textValue={translator.text(`Condition ${listing.condition} (label)`)}
						/>
					) : null}

					{listing.age ? (
						<LabelValue
							textLabel={translator.text("Listing age (label)")}
							textValue={translator.text(`Age ${listing.condition} (label)`)}
						/>
					) : null}
				</Group>
			) : null}

			{listing.my ? null : (
				<Group>
					<SellerInfo
						_suspense={"I know"}
						listingId={listing.id}
						onView={onView}
					/>
				</Group>
			)}
		</Container>
	);
};
