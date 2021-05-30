import { validateValueHasProperty } from '../src/helpers/validate'


it("should throw and error when value is null", () => {
    expect(() => validateValueHasProperty(null, 'Value')).toThrow('Value cannot be null');
})

it("should throw and error when value is undefined", () => {
    expect(() => validateValueHasProperty(undefined, 'Value')).toThrow('Value cannot be undefined');
})

it("should throw and error when value is empty", () => {
    expect(() => validateValueHasProperty('', 'Value')).toThrow('Value cannot be empty');
})