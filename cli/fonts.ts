import { constructURL, download } from "google-fonts-helper";

console.log("Downloading fonts...");

const source = constructURL({
	families: {
		Limelight: true,
		Roboto: {
			wght: "100..700",
			italic: "100..700",
		},
	},
});

console.log("Font source", source);

if (!source) {
	throw new Error("Failed to construct URL");
}

const downloader = download(source, {
	base64: false,
	outputDir: "../src/assets",
	overwriting: true,
});

await downloader.execute();
