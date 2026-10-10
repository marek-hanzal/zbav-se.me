import type { FC } from "react";
import type { ListingSchema } from "~/buyer-listing/schema/ListingSchema";
import { CategoryInline } from "~/category/ui/CategoryInline";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { Container } from "~/ui/ui/Container";
import { Group } from "~/ui/ui/Group";
import { LabelValue } from "~/ui/ui/LabelValue";
import { Markdown } from "~/ui/ui/Markdown";
import { Typo } from "~/ui/ui/Typo";
import { ValueList } from "~/ui/ui/ValueList";

export namespace InfoSection {
	export interface Props extends Container.Props {
		listing: ListingSchema.Type;
	}
}

export const InfoSection: FC<InfoSection.Props> = ({ listing, ...props }) => {
	const translator = useTranslator();
	return (
		<Container
			data-ui={"InfoSection"}
			data-ui-layout="vertical-flex"
			data-ui-gap="default"
			{...props}
		>
			<Group>
				<LabelValue
					textLabel={translator.textFn("Listing restrictions (label)")}
					textEmpty={translator.textFn("Listing restrictions (empty)")}
					textValue={
						listing.withRestriction ? (
							<Tx label={`Listing restriction - ${listing.withRestriction}`} />
						) : null
					}
				/>
			</Group>

			<Group>
				<LabelValue
					textLabel={translator.textFn("Listing category (label)")}
					textValue={
						<CategoryInline
							category={listing.category}
							data-ui-tone="secondary"
							data-ui-theme="light"
						/>
					}
				/>
			</Group>

			{listing.description ? (
				<Group>
					<LabelValue
						textLabel={translator.textFn("Listing description (label)")}
						textValue={<Markdown>{listing.description}</Markdown>}
					/>
				</Group>
			) : null}

			{listing.pros?.length || listing.cons?.length ? (
				<Group>
					{listing.pros?.length ? (
						<ValueList
							textLabel={translator.textFn("Listing - Pros (label)")}
							textEmpty={translator.textFn("Listing - Pros not filled")}
							items={listing.pros.map((pro, index) => ({
								id: String(index),
								pro,
							}))}
							renderFn={(item) => <Typo label={item.pro} />}
						/>
					) : null}

					{listing.cons?.length ? (
						<ValueList
							textLabel={translator.textFn("Listing - Cons (label)")}
							textEmpty={translator.textFn("Listing - Cons not filled")}
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
						textLabel={translator.textFn("Listing delivery (label)")}
						textEmpty={translator.textFn("Delivery not selected")}
						items={(listing.delivery ?? []).map((delivery) => ({
							id: delivery,
							delivery,
						}))}
						renderFn={(item) => <Tx label={`Listing delivery - ${item.delivery}`} />}
					/>
				</Group>
			) : null}

			{listing.warranty != null ? (
				<Group>
					<LabelValue
						textLabel={translator.textFn("Listing warranty (label)")}
						textValue={<Tx label={`Listing warranty - ${listing.warranty}`} />}
					/>
				</Group>
			) : null}

			{listing.condition || listing.age ? (
				<Group>
					{listing.condition ? (
						<LabelValue
							textLabel={translator.textFn("Listing condition (label)")}
							textValue={translator.textFn(`Condition ${listing.condition} (label)`)}
						/>
					) : null}

					{listing.age ? (
						<LabelValue
							textLabel={translator.textFn("Listing age (label)")}
							textValue={translator.textFn(`Age ${listing.condition} (label)`)}
						/>
					) : null}
				</Group>
			) : null}
		</Container>
	);
};
