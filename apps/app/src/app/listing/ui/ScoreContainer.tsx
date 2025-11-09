import { BadgeValue } from "@use-pico/client/ui/badge";
import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import type { tListingScore } from "@zbav-se.me/sdk/api/session";
import { ScoreIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace ScoreContainer {
	export interface Props extends Container.Props {
		locale: string;
		listingScore: tListingScore;
	}
}

export const ScoreContainer: FC<ScoreContainer.Props> = ({
	locale,
	listingScore,
	...props
}) => {
	return (
		<Container
			layout={"vertical-flex"}
			gap={"md"}
			{...props}
		>
			<Status
				icon={ScoreIcon}
				textTitle={"Listing Score - intro (title)"}
			/>

			{listingScore.score ? (
				<BadgeValue
					textLabel={"Listing Score - Raw score (label)"}
					textValue={toLocaleNumber({
						locale,
						number: listingScore.score,
					})}
				/>
			) : null}

			{listingScore.score ? null : (
				<BadgeValue
					textLabel={"Listing Score - Raw score (label)"}
					textValue={"Listing Score - Raw score - no value (label)"}
				/>
			)}

			{/* 
                Views (active score)
            */}

			{listingScore.views ? (
				<BadgeValue
					textLabel={"Listing Score - Views (label)"}
					textValue={toLocaleNumber({
						locale,
						number: listingScore.views,
					})}
				/>
			) : null}

			{listingScore.views ? null : (
				<BadgeValue
					textLabel={"Listing Score - Views (label)"}
					textValue={"Listing Score - Views - no value (label)"}
				/>
			)}

			{/* 
                Feed views (passive score)
            */}

			{listingScore.listing ? (
				<BadgeValue
					textLabel={"Listing Score - Feed views (label)"}
					textValue={toLocaleNumber({
						locale,
						number: listingScore.listing,
					})}
				/>
			) : null}

			{listingScore.listing ? null : (
				<BadgeValue
					textLabel={"Listing Score - Feed views (label)"}
					textValue={"Listing Score - Feed views - no value (label)"}
				/>
			)}

			{/*
                Cart interactions
            */}

			{listingScore.cart ? (
				<BadgeValue
					textLabel={"Listing Score - Cart (label)"}
					textValue={toLocaleNumber({
						locale,
						number: listingScore.cart,
					})}
				/>
			) : null}

			{listingScore.cart ? null : (
				<BadgeValue
					textLabel={"Listing Score - Cart (label)"}
					textValue={"Listing Score - Cart - no value (label)"}
				/>
			)}

			{/*
                Ignore interactions
            */}

			{listingScore.ignore ? (
				<BadgeValue
					textLabel={"Listing Score - Ignore (label)"}
					textValue={toLocaleNumber({
						locale,
						number: listingScore.ignore,
					})}
				/>
			) : null}

			{listingScore.ignore ? null : (
				<BadgeValue
					textLabel={"Listing Score - Ignore (label)"}
					textValue={"Listing Score - Ignore - no value (label)"}
				/>
			)}

			{/*
                Flag interactions
            */}

			{listingScore.flag ? (
				<BadgeValue
					textLabel={"Listing Score - Flag (label)"}
					textValue={toLocaleNumber({
						locale,
						number: listingScore.flag,
					})}
				/>
			) : null}

			{listingScore.flag ? null : (
				<BadgeValue
					textLabel={"Listing Score - Flag (label)"}
					textValue={"Listing Score - Flag - no value (label)"}
				/>
			)}
		</Container>
	);
};
