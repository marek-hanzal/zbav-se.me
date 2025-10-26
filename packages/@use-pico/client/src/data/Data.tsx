import type { UseQueryResult } from "@tanstack/react-query";
import { ErrorIcon, Spinner, Status } from "@use-pico/client";
import type { ReactNode } from "react";
import { match } from "ts-pattern";

const DefaultError = () => (
	<div className="Data-error grid place-content-center">
		<Status
			icon={ErrorIcon}
			tone={"danger"}
			textTitle={"Invalid data provided (title)"}
			textMessage={"Invalid data provided (message)"}
		/>
	</div>
);

const DefaultEmpty: Data.EmptyComponent.RenderFn = () => null;

const DefaultContent: Data.Content.RenderFn = ({ content }) => content;

export namespace Data {
	export namespace SuccessComponent {
		export interface Props<TData> {
			data: TData;
		}
		export type RenderFn<TData> = (props: Props<TData>) => ReactNode;
	}

	/**
	 * Success, but empty
	 */
	export namespace EmptyComponent {
		export type RenderFn = () => ReactNode;
	}

	export namespace LoadingComponent {
		export type RenderFn = () => ReactNode;
	}

	export namespace FetchingComponent {
		export interface Props<TData> {
			data: TData;
		}

		export type RenderFn<TData> = (props: Props<TData>) => ReactNode;
	}

	export namespace ErrorComponent {
		export interface Props {
			error: Error;
		}
		export type RenderFn = (props: Props) => ReactNode;
	}

	export namespace Content {
		export interface Props {
			content: ReactNode;
		}
		export type RenderFn = (props: Props) => ReactNode;
	}

	export interface Props<TResult extends UseQueryResult<any, Error>> {
		result: TResult;
		renderSuccess: SuccessComponent.RenderFn<NonNullable<TResult["data"]>>;
		renderLoading?: LoadingComponent.RenderFn;
		renderFetching?: FetchingComponent.RenderFn<
			NonNullable<TResult["data"]>
		>;
		renderError?: ErrorComponent.RenderFn;
		renderEmpty?: EmptyComponent.RenderFn;
		children?: Content.RenderFn;
	}
}

export const Data = <TResult extends UseQueryResult<any, Error>>({
	result,
	renderSuccess,
	renderLoading = () => <Spinner />,
	renderFetching = () => <Spinner />,
	renderError = DefaultError,
	renderEmpty = DefaultEmpty,
	children = DefaultContent,
}: Data.Props<TResult>) => {
	return children({
		content: match(result)
			.when(
				(r) => r.isLoading,
				() => renderLoading(),
			)
			.when(
				(r) => r.isFetching,
				(r) => {
					return renderFetching({
						// biome-ignore lint/style/noNonNullAssertion: We've data,
						data: r.data!,
					});
				},
			)
			.when(
				(r) => r.isError,
				(r) => {
					return renderError({
						// biome-ignore lint/style/noNonNullAssertion: We've already checked isError,
						error: r.error!,
					});
				},
			)
			.when(
				(r) => r.isSuccess,
				(r) => {
					return r.data
						? renderEmpty()
						: renderSuccess({
								data: r.data,
							});
				},
			)
			.otherwise(() => null),
	});
};
