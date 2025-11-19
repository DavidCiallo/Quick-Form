import {
    FormCreateRequest,
    FormCreateResponse,
    FormUpdateRequest,
    FormUpdateResponse,
    FormDeleteRequest,
    FormDeleteResponse,
    FormListQuery,
    FormListResponse,
    FormRouterInstance,
} from "../../shared/router/FormRouter";
import { inject, injectws } from "../lib/inject";
import { createField, getFieldList, getFormList, updateFormName } from "../service/field.service";
import { getRecords } from "../service/record.service";

async function list(query: FormListQuery): Promise<FormListResponse> {
    if (!query.page) return { list: [], total: 0, success: false };
    const allRecords = (await getRecords()).sort((a, b) => {
        const tA = new Date(a.update_time || a.create_time || 0);
        const tB = new Date(b.update_time || b.create_time || 0);
        return tB.getTime() - tA.getTime();
    });
    const list = await Promise.all(
        (await getFormList()).map(async (form_name) => {
            const fields = await getFieldList(form_name);
            const records = allRecords.filter((r) => fields.find((f) => f.id == r.field_id));
            const records_num = new Set(records.map((i) => i.item_id)).size;
            const last_submit = records[0]?.update_time || records[0]?.create_time || 0;
            return { form_name, records_num, last_submit };
        }),
    );
    return { list, total: list.length, success: true };
}

async function create(query: FormCreateRequest): Promise<FormCreateResponse> {
    const { form_name } = query;
    if (!form_name) {
        return { success: false };
    }

    const forms = await getFormList();
    if (forms.includes(form_name)) {
        return { success: false };
    }

    const success = await createField({
        form_name: form_name,
        field_name: "new",
        field_type: "text",
    });
    return { success };
}

async function update(query: FormUpdateRequest): Promise<FormUpdateResponse> {
    const { form_name, new_name } = query;
    if (!form_name || !new_name) return { success: false };

    const success = await updateFormName(form_name, new_name);
    return { success };
}

async function del(query: FormDeleteRequest): Promise<FormDeleteResponse> {
    return { success: false };
}

export const formController = new FormRouterInstance(inject, { list, create, update, del });
