import { Effect } from "effect";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { TranslationContext } from "@/lib/client/translation";
import { EmailVerificationEmail } from "~/email/template/EmailVerificationEmail";
import { renderMailFx } from "~/server/email/fx/renderMailFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { withTranslatorFx } from "~/translator/server/fx/withTranslatorFx";

describe("renderMailFx", () => {
	it("renders html and text from a React email template", async () => {
		const database = await testabase("renderMailFx-email-template");

		const result = await Effect.gen(function* () {
			const translator = yield* withTranslatorFx({
				locale: "cs",
			});

			return yield* renderMailFx({
				content: createElement(
					TranslationContext,
					{
						value: translator.list(),
					},
					createElement(EmailVerificationEmail, {
						verifyUrl: "https://zbav-se.me/verify-email/token-123",
					}),
				),
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		expect(result.html).toContain("https://zbav-se.me/verify-email/token-123");
		expect(result.html).toContain("Ověř si svůj email");
		expect(result.text).toContain("https://zbav-se.me/verify-email/token-123");
		expect(result.text).toContain("OVĚŘ SI SVŮJ EMAIL");
	});
});
