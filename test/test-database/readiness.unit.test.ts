import { beforeEach, describe, expect, it, vi } from "vitest";
import { waitForConnectFn } from "~/test-database/fn/waitForConnectFn";

const clientMock = vi.hoisted(() => ({
	createdFn: vi.fn(),
	connectFn: vi.fn(),
	queryFn: vi.fn(),
	endFn: vi.fn(),
}));

vi.mock("pg", () => ({
	Client: class {
		connect = clientMock.connectFn;
		query = clientMock.queryFn;
		end = clientMock.endFn;

		constructor() {
			clientMock.createdFn();
		}
	},
}));

beforeEach(() => {
	vi.resetAllMocks();
	clientMock.connectFn.mockResolvedValue(undefined);
	clientMock.queryFn.mockResolvedValue(undefined);
	clientMock.endFn.mockResolvedValue(undefined);
});

describe("Postgres readiness", () => {
	it("closes failed probes before retrying and also closes the successful probe", async () => {
		clientMock.queryFn.mockRejectedValueOnce(new Error("Postgres is still starting"));

		await waitForConnectFn("postgresql://postgres:secret@127.0.0.1:5432/postgres", 1_000);

		expect(clientMock.createdFn).toHaveBeenCalledTimes(2);
		expect(clientMock.endFn).toHaveBeenCalledTimes(2);
	});

	it("closes refused connections and omits credentials from timeout diagnostics", async () => {
		clientMock.connectFn.mockRejectedValue(new Error("Connection refused"));
		const result = await waitForConnectFn(
			"postgresql://postgres:readiness-secret@127.0.0.1:5432/postgres",
			1,
		).catch((error: unknown) => error);

		expect(result).toBeInstanceOf(Error);
		if (!(result instanceof Error)) {
			throw new Error("Expected a readiness timeout error");
		}
		expect(result.message).toContain("Connection refused");
		expect(result.message).not.toContain("readiness-secret");
		expect(clientMock.endFn).toHaveBeenCalledTimes(clientMock.createdFn.mock.calls.length);
	});
});
