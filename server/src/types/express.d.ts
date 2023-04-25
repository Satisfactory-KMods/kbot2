import * as core        from "express-serve-static-core";
import { IRequestBody } from "@shared/types/API_Request";
import { Request }      from "express";

export type TERes<T extends IRequestBody = IRequestBody<any>> = Request<
	core.ParamsDictionary,
	any,
	T
>