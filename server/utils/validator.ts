import { createKeywordTypeNode } from "typescript"

export const validateBody = (body: any, keys: Array<string>) => {
    if (body) {
        const errors: Array<string> = [];
        keys.forEach((item) => {
            if (!body[item]) {
                errors.push(item);
            }
        })
        if (errors.length > 0)
            return `${errors.join(", ")} ${errors.length > 1 ? "are" : "is"} required`;
        return false
    }
    return "Enter valid data";
}