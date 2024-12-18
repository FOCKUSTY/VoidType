export type Response<T = any> = {
	text: string;
	type: 0 | 1;

	data: T;
	dataContent?: {
		text: string;
	};
};
