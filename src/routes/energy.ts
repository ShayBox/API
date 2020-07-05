import { login } from 'tplink-cloud-api';
import apicache from 'apicache';
import express from 'express';

const router = express.Router();
const cache = apicache.options({
	headers: {
		'cache-control': 'no-cache'
	}
}).middleware;

const { TPLINK_EMAIL, TPLINK_PASSWORD } = process.env;
if (!TPLINK_EMAIL) throw new Error('TPLINK_EMAIL not provided');
if (!TPLINK_PASSWORD) throw new Error('TPLINK_PASSWORD not provided');

const tplink = login(TPLINK_EMAIL, TPLINK_PASSWORD);

const month = new Date().getMonth() + 1;
const year = new Date().getFullYear();

router.get('/days', cache('1 day'), async (req, res) => {
	await (await tplink).getDeviceList();
	const device = (await tplink).getHS110('Computer');
	const stats = await device.getDayStats(year, month);

	res.json(stats);
});

router.get('/months', cache('1 day'), async (req, res) => {
	await (await tplink).getDeviceList();
	const device = (await tplink).getHS110('Computer');
	const stats = await device.getMonthStats(year);

	res.json(stats);
});

router.get('/realtime', cache('1 seconds'), async (req, res) => {
	await (await tplink).getDeviceList();
	const device = (await tplink).getHS110('Computer');
	const usage = await device.getPowerUsage();

	res.json(usage);
});

export default router;
