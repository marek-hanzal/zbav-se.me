import { Effect } from "effect";
import { match } from "ts-pattern";
import { messageFetchFx } from "~/@user/message/fx/messageFetchFx";
import type { MessageCreateSchema } from "~/@user/message/schema/MessageCreateSchema";
import { transactionMessageGalleryCreateFx } from "~/@user/transaction-message-gallery/fx/transactionMessageGalleryCreateFx";
import { transactionMessageLocationCreateFx } from "~/@user/transaction-message-location/fx/transactionMessageLocationCreateFx";
import { transactionMessagePackageCreateFx } from "~/@user/transaction-message-package/fx/transactionMessagePackageCreateFx";
import { transactionMessagePersonalCreateFx } from "~/@user/transaction-message-personal/fx/transactionMessagePersonalCreateFx";
import { transactionMessageTextCreateFx } from "~/@user/transaction-message-text/fx/transactionMessageTextCreateFx";

export namespace messageCreateFx {
	export type Props = MessageCreateSchema.Type & {
		userId: string;
	};
}

export const messageCreateFx = Effect.fn("messageCreateFx")(function* (
	props: messageCreateFx.Props,
) {
	const created = yield* match(props)
		.with(
			{
				type: "text",
			},
			(data) =>
				transactionMessageTextCreateFx({
					userId: data.userId,
					transactionId: data.transactionId,
					message: data.message,
				}),
		)
		.with(
			{
				type: "gallery",
			},
			(data) =>
				transactionMessageGalleryCreateFx({
					userId: data.userId,
					transactionId: data.transactionId,
					uploadIds: data.uploadIds,
				}),
		)
		.with(
			{
				type: "location",
			},
			(data) =>
				transactionMessageLocationCreateFx({
					userId: data.userId,
					transactionId: data.transactionId,
					locationId: data.locationId,
				}),
		)
		.with(
			{
				type: "package",
			},
			(data) =>
				transactionMessagePackageCreateFx({
					userId: data.userId,
					transactionId: data.transactionId,
					link: data.link,
					number: data.number,
				}),
		)
		.with(
			{
				type: "personal",
			},
			(data) =>
				transactionMessagePersonalCreateFx({
					userId: data.userId,
					transactionId: data.transactionId,
					name: data.name,
					phone: data.phone,
					email: data.email,
					locationId: data.locationId,
				}),
		)
		.exhaustive();

	return yield* messageFetchFx({
		userId: props.userId,
		where: {
			id: created.id,
		},
	});
});

export type messageCreateFx = ReturnType<typeof messageCreateFx>;
