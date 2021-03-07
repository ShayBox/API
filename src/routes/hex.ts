import apicache from "apicache";
import express from "express";
import sharp from "sharp";

const router = express.Router();
const cache = apicache.options({
	headers: {
		"cache-control": "no-cache",
	},
}).middleware;

router.get("/generate/:hex/:height/:width", cache("1 hour"), async (req, res) => {
	function hexToRGB(hex: string) {
		hex = hex.replace("#", "");

		return {
			r: parseInt(hex.substring(0, 2), 16),
			g: parseInt(hex.substring(2, 4), 16),
			b: parseInt(hex.substring(4, 6), 16),
		};
	}

	const image = await sharp({
		create: {
			width: parseInt(req.params.width, 10),
			height: parseInt(req.params.height, 10),
			channels: 3,
			background: hexToRGB(req.params.hex),
		},
	})
		.png()
		.toBuffer();

	res.contentType("image/png");
	res.send(image);
});

export default router;
