import { jwtVerify } from "jose";
import type z from "zod";

export namespace verify {
	export interface Props<out TSchema extends z.ZodObject> {
		schema: TSchema;
		issuer: string;
		secret: string;
		audience?: string;
		scope: string;
	}

	export interface Result<out TSchema extends z.ZodObject> {
		payload: z.infer<TSchema>;
	}
}

export async function verify<const TSchema extends z.ZodObject>(
	token: string,
	{ schema, issuer, secret, audience = "token", scope }: verify.Props<TSchema>,
): Promise<verify.Result<TSchema>> {
	const secretKey = new TextEncoder().encode(secret);

	const { payload } = await jwtVerify(token, secretKey, {
		audience,
		issuer,
		algorithms: [
			"HS256",
		],
		clockTolerance: 10,
	});

	if (payload.scope !== scope) {
		throw new Error("Invalid scope");
	}

	return {
		payload: schema.parse({
			...payload,
			subject: payload.sub,
		}),
	};
}
