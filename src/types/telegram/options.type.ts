import { Response } from "./response.type";

export type Option = {
	option: string;
	error: string;
	text: string;
	id: string | number;

	function?: (...data: any) => Promise<Response>;
	addArgs?: any[];
	firstArgs?: any[];
};
