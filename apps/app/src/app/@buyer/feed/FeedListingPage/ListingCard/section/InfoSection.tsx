import { Container, LabelValue, ValueList } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import { Markdown } from "@use-pico/client/ui/markdown";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { translator } from "@use-pico/common/translator";
import type { tListing } from "@zbav-se.me/sdk/api/buyer";
import { type FC, Suspense } from "react";
import { CategoryInline } from "~/app/@session/category/ui/CategoryInline/CategoryInline";
import { SellerInfo } from "../../SellerInfo";

export namespace InfoSection {
	export interface Props {
		listing: tListing;
		onView(view: "seller-info"): void;
	}
}

export const InfoSection: FC<InfoSection.Props> = ({ listing, onView }) => {
	return (
		<Container
			data-ui={"InfoSection"}
			ui={{
				layout: "vertical-flex",
				gap: "default",
			}}
		>
			<Group>
				<LabelValue
					textLabel={translator.text("Listing category (label)")}
					textValue={
						<CategoryInline
							categoryId={listing.category.id}
							ui={{
								tone: "secondary",
								theme: "light",
							}}
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
					<Suspense
						fallback={
							<SellerInfo.Fallback
								listingId={listing.id}
								onView={onView}
							/>
						}
					>
						<SellerInfo
							_suspense={"I know"}
							listingId={listing.id}
							onView={onView}
						/>
					</Suspense>
				</Group>
			)}
		</Container>
	);
};
