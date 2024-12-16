export type Response = {
	text: string;
	type: 0 | 1;

	data: any;
	dataContent?: {
		text: string
	}
};
