import { Container, LabelValue } from "@use-pico/client/ui/container";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import type { tListingMetrics } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";

export namespace ScoreContainer {
	export interface Props extends Container.Props {
		locale: string;
		listingMetrics: tListingMetrics;
	}
}

export const ScoreContainer: FC<ScoreContainer.Props> = ({
	locale,
	listingMetrics,
	ui,
	...props
}) => {
	return (
		<Container
			ui={{
				layout: "vertical-flex",
				gap: "lg",
				...ui,
			}}
			{...props}
		>
			{listingMetrics.score ? (
				<LabelValue
					textLabel={"Listing Score - Raw score (label)"}
					textValue={toLocaleNumber({
						locale,
						number: listingMetrics.score,
					})}
				/>
			) : null}

			{listingMetrics.score ? null : (
				<LabelValue
					textLabel={"Listing Score - Raw score (label)"}
					textValue={0}
				/>
			)}

			{/* 
                Views (active score)
            */}

			{listingMetrics.views ? (
				<LabelValue
					textLabel={"Listing Score - Views (label)"}
					textValue={toLocaleNumber({
						locale,
						number: listingMetrics.views,
					})}
				/>
			) : null}

			{listingMetrics.views ? null : (
				<LabelValue
					textLabel={"Listing Score - Views (label)"}
					textValue={0}
				/>
			)}

			{/* 
                Feed views (passive score)
            */}

			{listingMetrics.listing ? (
				<LabelValue
					textLabel={"Listing Score - Feed views (label)"}
					textValue={toLocaleNumber({
						locale,
						number: listingMetrics.listing,
					})}
				/>
			) : null}

			{listingMetrics.listing ? null : (
				<LabelValue
					textLabel={"Listing Score - Feed views (label)"}
					textValue={0}
				/>
			)}

			{/*
                Favourite interactions
            */}

			{listingMetrics.favourite ? (
				<LabelValue
					textLabel={"Listing Score - Favourite (label)"}
					textValue={toLocaleNumber({
						locale,
						number: listingMetrics.favourite,
					})}
				/>
			) : null}

			{listingMetrics.favourite ? null : (
				<LabelValue
					textLabel={"Listing Score - Favourite (label)"}
					textValue={0}
				/>
			)}

			{/*
                Ignore interactions
            */}

			{listingMetrics.ignore ? (
				<LabelValue
					textLabel={"Listing Score - Ignore (label)"}
					textValue={toLocaleNumber({
						locale,
						number: listingMetrics.ignore,
					})}
				/>
			) : null}

			{listingMetrics.ignore ? null : (
				<LabelValue
					textLabel={"Listing Score - Ignore (label)"}
					textValue={0}
				/>
			)}

			{/*
                Flag interactions
            */}

			{listingMetrics.flag ? (
				<LabelValue
					textLabel={"Listing Score - Flag (label)"}
					textValue={toLocaleNumber({
						locale,
						number: listingMetrics.flag,
					})}
				/>
			) : null}

			{listingMetrics.flag ? null : (
				<LabelValue
					textLabel={"Listing Score - Flag (label)"}
					textValue={0}
				/>
			)}
		</Container>
	);
};
