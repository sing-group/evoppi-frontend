export function toPlainObject(params: object, fieldsToIgnore: string[] = []): {
    [param: string]: string;
} {
    return Object.keys(params).reduce((acc, key) => {
        const value = params[key];

        if (value !== undefined && value !== null && !fieldsToIgnore.includes(key)) {
            acc[key] = String(value);
        }

        return acc;
    }, {});
}
