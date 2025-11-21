import { nanoid } from "nanoid";
import {
    RecordAllQuery,
    RecordAllResponse,
    RecordGetQuery,
    RecordGetResponse,
    RecordRouterInstance,
    RecordUpdateRequest,
    RecordUpdateResponse,
} from "../../shared/router/RecordRouter";
import { inject, injectws } from "../lib/inject";
import { getFieldList, getFormNameByField } from "../service/field.service";
import { getAllRecord, getRecords, submitRecord } from "../service/record.service";
import { codeGenerate } from "../lib/crypto";
import { RecordImpl } from "../../shared/impl";

async function history(request: RecordGetQuery): Promise<RecordGetResponse> {
    const { id, code } = request;
    const records = await getRecords(id);
    if (records.length) {
        // 查到记录，是item_id，要求用户鉴权才能获取历史记录
        const { field_id, item_id } = records[0];
        const form_name = await getFormNameByField(field_id);
        const fields = await getFieldList(form_name);
        // 鉴权不通过
        if (!code || code !== codeGenerate(item_id)) {
            return { success: false, message: "鉴权失败" };
        } else {
            // 鉴权通过
            const data = { success: true, form_name, item_id, code, fields, records };
            return { success: true, data };
        }
    } else {
        const form_name = await getFormNameByField(request.id);
        if (!form_name) {
            return { success: false, message: "表单不存在" };
        }
        const item_id = nanoid(6);
        const code = codeGenerate(item_id);
        const fields = await getFieldList(form_name);
        const data = {
            form_name,
            item_id,
            code,
            fields,
            records: [],
        };
        return { success: true, data };
    }
}

async function submit(request: RecordUpdateRequest): Promise<RecordUpdateResponse> {
    const { item_id, field_id, field_value } = request;
    const success = await submitRecord({ item_id, field_id, field_value });
    return { success };
}

async function all(request: RecordAllQuery): Promise<RecordAllResponse> {
    const { form_name, page } = request;
    if (!form_name || !page || page < 1) {
        return { data: [], total: 0, success: false };
    }
    const records = await getAllRecord(form_name);
    const group: Array<{
        item_id: string;
        records: Array<RecordImpl>;
    }> = [];
    for (const r of records) {
        const exist = group.findIndex(({ item_id }) => r.item_id == item_id);
        if (exist !== -1) {
            group[exist].records.push(r);
        } else {
            group.push({ item_id: r.item_id, records: [r] });
        }
    }
    const data = group.slice((page - 1) * 10, page * 10);

    return { data, total: group.length, success: true };
}

export const recordController = new RecordRouterInstance(inject, { history, submit, all });
