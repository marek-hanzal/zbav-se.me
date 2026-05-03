import { DateTime } from "luxon";
import { type FC, useEffect, useMemo, useRef } from "react";
import { match, P } from "ts-pattern";
import { Button } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import { ArrowRightIcon } from "@/lib/client/icon";
import { useSelection } from "@/lib/client/selection";
import { Tx } from "@/lib/client/tx";
import type { useView } from "@/lib/client/view2";
import { clamp } from "@/lib/common/clamp";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { uiSelectButton } from "~/common/ui/ui";
import { withListingAttrNumberPatchMutation } from "~/seller/listing-attr-number/mutation/withListingAttrNumberPatchMutation";
import type { ListingAttrOfSchema } from "~/user/listing-attr/server/schema/ListingAttrOfSchema";
import { useNextAttr } from "./useNextAttr";

const toYearBound = (value: number | null | undefined, fallback: number) =>
	match(value)
		.with(P.number, (value) => (Number.isNaN(value) ? fallback : Math.round(value)))
		.otherwise(() => fallback);

export namespace AttrYear {
	export interface Props extends Container.Props {
		listingId: string;
		attrs: ListingAttrOfSchema.Type[];
		attr: Extract<
			ListingAttrOfSchema.Type,
			{
				type: "year";
			}
		>;
		view: useView.Use<any>;
	}
}

export const AttrYear: FC<AttrYear.Props> = ({ listingId, attrs, attr, view, ...props }) => {
	const next = useNextAttr(attr, attrs);
	const mutation = withListingAttrNumberPatchMutation.useMutation({
		onSuccess() {
			view.set(next ? `attr.${next.name}` : "default");
		},
	});
	const min = toYearBound(attr.min, 1900);
	const max = Math.max(min, toYearBound(attr.max, 2099));
	const years = useMemo(
		() =>
			Array.from(
				{
					length: max - min + 1,
				},
				(_, index) => min + index,
			),
		[
			max,
			min,
		],
	);
	const selection = useSelection({
		mode: "single",
		initial:
			typeof attr.value === "number"
				? [
						{
							id: String(clamp(attr.value, min, max)),
						},
					]
				: [
						{
							id: String(DateTime.now().year),
						},
					],
	});
	const selectedYear = selection.optional.singleId();
	const scrollRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		scrollRef.current
			?.querySelector<HTMLElement>(`[data-selected-year="${selectedYear ?? ""}"]`)
			?.scrollIntoView({
				block: "center",
				inline: "center",
				behavior: "smooth",
			});
	}, [
		selectedYear,
	]);

	return (
		<Container
			data-ui={"AttrYear"}
			data-ui-layout="vertical-content-footer"
			data-ui-height="full"
			data-ui-width="full"
			data-ui-inner="default"
			data-ui-gap="default"
			{...props}
		>
			<Container
				data-ui={"AttrYear-List"}
				data-ui-height="full"
				data-ui-scroll="vertical"
				ref={scrollRef}
			>
				<div
					data-ui={"AttrYear-grid"}
					className={[
						"grid",
						"grid-cols-3",
						"gap-3",
						"pb-2",
					].join(" ")}
				>
					{years.map((year) => {
						const value = String(year);
						const selected = selection.isSelected(value);

						return (
							<Button
								key={value}
								data-selected-year={selected ? value : undefined}
								onClick={() => {
									selection.toggle({
										id: value,
									});
								}}
								{...uiSelectButton({
									isSelected: selected,
									"data-ui-size": "default",
									"data-ui-justify": "center",
									"data-ui-items": "center",
									"data-ui-text": "lg",
									className: [
										"min-h-14",
									],
								})}
							>
								{value}
							</Button>
						);
					})}
				</div>
			</Container>

			<SaveContainer
				onCancel={() => {
					view.set("default");
				}}
				onSave={() => {
					mutation.mutate({
						fieldId: attr.name,
						listingId,
						value: selectedYear ? Number.parseInt(selectedYear, 10) : null,
					});
				}}
				loading={mutation.isPending}
				disabled={mutation.isPending}
				textSave={<Tx label={"Continue (label)"} />}
				textCancel={<Tx label={"Back (label)"} />}
				saveProps={{
					iconEnabled: ArrowRightIcon,
					iconPosition: "right",
				}}
			/>
		</Container>
	);
};
