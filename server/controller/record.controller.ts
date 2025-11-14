import { RecordGetQuery, RecordGetResponse, RecordRouterInstance, RecordUpdateRequest, RecordUpdateResponse } from "../../shared/router/RecordRouter";
import { inject, injectws } from "../lib/inject";

async function get(request: RecordGetQuery): Promise<RecordGetResponse> {
    const data = { example_key: "example_value" };
    return { success: true, data };
}

async function submit(request: RecordUpdateRequest): Promise<RecordUpdateResponse> {
    const result = { success: true };
    return result;
}

export const recordController = new RecordRouterInstance(inject, { get, submit });
