import { genId } from "@use-pico/common";
import { SignJWT } from "jose";
import type z from "zod";
import type { PayloadSchema } from "./PayloadSchema";

export namespace sign {
	export interface Props<TSchema extends PayloadSchema> {
		schema: TSchema;
		issuer: string;
		userId: string;
		subject: string;
		secret: string;
		audience?: string;
		scope: string;
		expiresIn?: string;
		payload?: Omit<z.infer<TSchema>, "scope">;
	}
}

export const sign = <TSchema extends PayloadSchema>({
	schema: _,
	issuer,
	userId,
	subject,
	secret,
	audience = "token",
	scope,
	expiresIn = "1h",
	payload,
}: sign.Props<TSchema>) => {
	return new SignJWT({
		...payload,
		userId,
		scope,
	})
		.setProtectedHeader({
			alg: "HS256",
			typ: "JWT",
		})
		.setIssuer(issuer)
		.setSubject(subject)
		.setAudience(audience)
		.setJti(genId())
		.setNotBefore("-10s")
		.setExpirationTime(expiresIn)
		.sign(new TextEncoder().encode(secret));
};
