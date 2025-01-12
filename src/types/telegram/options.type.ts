import { Interaction } from "./interaction.type";
import { Response } from "../all/response.type";

export type SendData<T, K> = {
	message: Interaction;
	option: Option<T>;
	response: Response<K>;
};

export type ExecuteData<T, K> = { send: (data: SendData<T, K>) => Promise<void> } & SendData<T, K>;

export type Option<T, K=never> = {
	command: string;
	option: string;
	error: string;
	text: string;
	id: string | number;

	execute?: <Type=void, Res = object>(data: ExecuteData<T, Res>) => Type;
	function?: <K>(...data: K[]) => Promise<Response<T>>;
	addArgs?: K[];
	firstArgs?: K[];
};
