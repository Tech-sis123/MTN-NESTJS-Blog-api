import { Transform } from 'class-transformer';

// Trims spaces from strings (and from each string in an array) so "   " becomes ""
// and fails @IsNotEmpty. Transforms run before validation, so the rules check the cleaned value.
const trimValue = (value: unknown) =>
  typeof value === 'string' ? value.trim() : value;

export const Trim = () =>
  Transform(({ value }) =>
    Array.isArray(value) ? value.map(trimValue) : trimValue(value),
  );
