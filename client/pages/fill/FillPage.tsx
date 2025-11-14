import { useEffect, useState } from "react";
import { Button, Input, Pagination, Select, SelectItem, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { FormFieldImpl } from "../../../shared/impl";
import { FormFieldListResponse } from "../../../shared/router/FieldRouter";
import { FormFieldRouter, FormFieldRadioRouter, FormRouter } from "../../api/instance";
import { FieldType } from "../../../shared/impl/field";
import { FormListResponse } from "../../../shared/router/FormRouter";

const Component = () => {
    const [formName, setFormName] = useState<string>("");
    const [formFieldList, setFormFieldList] = useState<FormFieldImpl[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [page, setPage] = useState(1);

    function chooseForm(name: string) {
        if (formName !== name) {
            setFormName(name);
            setPage(1);
            FormFieldRouter.list({ form_name: name, page: 1 }, renderFormField);
        } else {
            FormFieldRouter.list({ form_name: name, page: page }, renderFormField);
        }
    }
    function renderFormField(data: FormFieldListResponse) {
        setTotal(data.total);
        setFormFieldList(data.list);
    }

    useEffect(() => {
        FormRouter.list({ page: 1 }, ({ list }: FormListResponse) => {
            list.length && chooseForm(list[0]);
        })
    }, [])

    const pagination = (
        <Pagination
            initialPage={1} total={Math.ceil(total / 10)}
            onChange={(page: number) => {
                setPage(page);
                formName && FormFieldRouter.list({ form_name: formName, page }, renderFormField)
            }}
        />
    )

    function renderControl(field: FormFieldImpl) {
        switch (field.field_type) {
            case "text": {
                return (
                    <Input
                        label={field.field_name}
                        type="text"
                        variant="bordered"
                        labelPlacement="outside"
                        placeholder={field.placeholder || " "}
                        className="w-full"
                    />
                )
            }
            case "email": {
                return (
                    <Input
                        label={field.field_name}
                        type="email"
                        variant="bordered"
                        labelPlacement="outside"
                        placeholder={field.placeholder || "mail@example.com"}
                        className="w-full"
                    />
                )
            }
            case "password":
            case "number":
            case "month":
            case "date":
            case "time":
            case "color":
            case "file":
        }
    }
    return (
        <div className="w-3/4 md:w-1/3 mx-auto">
            <div className="w-full flex flex-col px-2 py-2">
                <div className="text-lg mx-auto font-bold py-4">{formName}</div>
                <div className="flex flex-col">
                    {formFieldList.map((field, index) => {
                        return (
                            <div className="w-full flex flex-row flex-wrap pt-2" key={index}>
                                {renderControl(field)}
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="w-full flex flex-col flex-wrap px-[5vw] pt-6 pb-2">
                <div className="flex flex-row justify-between items-center w-full py-2">
                    <div className="flex flex-row w-full">
                        {!!total && pagination}
                    </div>
                    <div className="flex flex-row">
                    </div>
                </div>
            </div>
        </div >
    )
};


export default Component;