import cors from 'cors';
import express from 'express';
import bandwidth from './routes/bandwidth';
import discord from './routes/discord';
import energy from './routes/energy';
import hex from './routes/hex';
import misc from './routes/misc';

const app = express();

app.use(cors());
app.use('/bandwidth', bandwidth);
app.use('/discord', discord);
app.use('/energy', energy);
app.use('/hex', hex);
app.use('/misc', misc);

app.get('/', (_, res) => {
	res.json({
		'/bandwidth': [
			'GET: /categories',
			'GET: /cycles',
			'GET: /daily'
		],
		'/discord': [
			'GET: /reset?token'
		],
		'/energy': [
			'GET: /realtime',
			'GET: /days',
			'GET: /months'
		],
		'/hex': [
			'GET: /generate/:hex/:height/:width'
		],
		'/misc': [
			'GET: /scmowns'
		]
	});
});

app.listen(process.env.PORT || 1337);
