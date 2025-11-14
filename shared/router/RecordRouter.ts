import { BaseRequest, BaseResponse, BaseRouterInstance } from "../lib/decorator";

export class RecordRouterInstance extends BaseRouterInstance {
    base = "/api";
    prefix = "/record";
    router = [
        {
            name: "get",
            path: "/get",
            method: "get",
            handler: Function,
        },
        {
            name: "submit",
            path: "/submit",
            method: "post",
            handler: Function,
        },
    ];

    get: (query: RecordGetQuery, callback?: Function) => Promise<RecordGetResponse>;
    submit: (request: RecordUpdateRequest, callback?: Function) => Promise<RecordUpdateResponse>;

    constructor(
        inject: Function,
        functions?: {
            get: (query: RecordGetQuery) => Promise<RecordGetResponse>;
            submit: (request: RecordUpdateRequest) => Promise<RecordUpdateResponse>;
        },
    ) {
        super();
        inject(this, functions);
    }
}

export interface RecordGetQuery extends BaseRequest {
    item_id: string;
}

export interface RecordGetResponse extends BaseResponse {
    data: Record<string, any>;
}

export interface RecordUpdateRequest extends BaseRequest {
    item_id: string;
}

export interface RecordUpdateResponse extends BaseResponse {}
