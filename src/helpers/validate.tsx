/**
 * Validate value is not null | undefined or empty
 * @param value | valueName
*/
export function validateValueHasProperty(value: any, valueName: string): void {
    if (value === null) {
        throw new Error(`${valueName} cannot be null`);
    } else if (value === undefined) {
        throw new Error(`${valueName} cannot be undefined`);
    } else if (value === '') {
        throw new Error(`${valueName} cannot be empty`);
    }
}

/**
 * Validates value us null
 */
export function validateValueHasNoProperty(value: any, valueName: string): void {
    if (value !== null && value !== undefined && value !== '') {
        throw new Error(`${valueName} should be null`);
    }
}