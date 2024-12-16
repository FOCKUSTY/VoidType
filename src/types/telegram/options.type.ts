import { Interaction } from "./interaction.type";
import { Response } from "../all/response.type";

export type SendData = {
	message: Interaction;
	option: Option;
	response: Response;
};

export type ExecuteData = { send: (data: SendData) => Promise<void> } & SendData;

export type Option = {
	command: string;
	option: string;
	error: string;
	text: string;
	id: string | number;

	execute?: (data: ExecuteData) => any;
	function?: (...data: any) => Promise<Response>;
	addArgs?: any[];
	firstArgs?: any[];
};
