import apicache from 'apicache';
import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();
const cache = apicache.options({
	headers: {
		'cache-control': 'no-cache'
	}
}).middleware;

const { ISP_AUTHORIZATION, ISP_USER_ID, ISP_SERIAL_NUMBER } = process.env;
if (!ISP_AUTHORIZATION) throw new Error('ISP_AUTHORIZATION not provided');
if (!ISP_USER_ID) throw new Error('ISP_USER_ID not provided');
if (!ISP_SERIAL_NUMBER) throw new Error('ISP_SERIAL_NUMBER not provided');

const baseURL = 'https://api.buckeyebroadband.com/usage/v2';
const options = { headers: { Authorization: ISP_AUTHORIZATION } };
const getData = async (url: string) => fetch(baseURL + url, options).then(res => res.json());

router.get('/categories', cache('1 day'), async (req, res) => {
	const { beginCycle, endCycle } = await getData(`/users/${ISP_USER_ID}/modems/${ISP_SERIAL_NUMBER}/cycles/11/usage`).then(json => json.data[0]);
	const data = await getData(`/users/${ISP_USER_ID}/modems/${ISP_SERIAL_NUMBER}/usageDetails/${beginCycle}/${endCycle}`);

	res.json(data);
});

router.get('/cycles', cache('1 day'), async (req, res) => {
	const data = await getData(`/users/${ISP_USER_ID}/modems/${ISP_SERIAL_NUMBER}/cycles/11/usage`);

	res.json(data);
});

router.get('/daily', cache('1 day'), async (req, res) => {
	const { beginCycle, endCycle } = await getData(`/users/${ISP_USER_ID}/modems/${ISP_SERIAL_NUMBER}/cycles/0/usage`).then(json => json.data[0]);
	const data = await getData(`/users/${ISP_USER_ID}/modems/${ISP_SERIAL_NUMBER}/dailyUsage/${beginCycle}/${endCycle}`);

	res.json(data);
});

export default router;
