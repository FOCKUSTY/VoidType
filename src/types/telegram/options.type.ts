import { Response } from "./response.type";

export type Option = {
	command: string;
	option: string;
	error: string;
	text: string;
	id: string | number;

	function?: (...data: any) => Promise<Response>;
	addArgs?: any[];
	firstArgs?: any[];
};
