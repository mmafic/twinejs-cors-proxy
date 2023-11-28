import * as res from '../utils/response';
import { isValidTwee, isValidTwineHtml } from '../utils/twine';

export const onRequestGet: PagesFunction = async ({ request }) => {
	const requestUrl = new URL(request.url);
	const searchUrl = requestUrl.searchParams.get('url');

	if (!searchUrl) {
		return res.json({
			error: 'no url provided',
		}, { status: 400 });
	}

	let result: string;
	let isHtml = true;
	try {
		const fetchResponse = await fetch(searchUrl);
		result = await fetchResponse.text();
		const contentType = fetchResponse.headers.get('Content-Type');
		if (contentType === 'text/html') {
			isHtml = true;
		} else if (contentType !== 'text/plain' && contentType !== 'text/twee') {
			return res.json({
				error: 'unsupported mime type',
				errorDetail: `type: ${contentType}`,
			}, { status: 400 });
		}
	} catch (err) {
		return res.json({
			error: 'fetch error',
			errorDetail: (err as Error).message,
		}, { status: 400 });
	}

	if (isHtml) {
		if (isValidTwineHtml(result)) {
			return res.json({
				contentType: 'text/html',
				data: result,
			});
		} else {
			return res.json({
				error: 'not valid twine html',
			}, { status: 400 });
		}
	}

	if (isValidTwee(result)) {
		return res.json({
			contentType: 'text/twee',
			data: result,
		});
	} else {
		return res.json({
			error: 'not valid twee file',
		}, { status: 400 });
	}
};
