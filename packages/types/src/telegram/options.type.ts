import { Interaction } from "./interaction.type";
import { Response } from "../all/response.type";

export type SendData<OptionT, ResponseT> = {
	message: Interaction;
	option: Option<OptionT>;
	response: Response<ResponseT>;
};

export type ExecuteData<OptionT, ResponseT, ArgResponseT = ResponseT> = {
	send: (data: SendData<OptionT, ArgResponseT>) => Promise<void>;
} & SendData<OptionT, ResponseT>;

export type Option<
	GResT,
	FirstArgsT extends any[] = any[],
	AddArgsT extends any[] = [],
	ArgResponseT = GResT
> = {
	command: string;
	option: string;
	error: string;
	text: string;
	id: string | number;

	execute?: (data: ExecuteData<any, GResT, ArgResponseT>) => void;
	function?: (...data: [...FirstArgsT, ...AddArgsT]) => Promise<Response<GResT>>;
	addArgs?: AddArgsT;
	firstArgs?: FirstArgsT;
};
