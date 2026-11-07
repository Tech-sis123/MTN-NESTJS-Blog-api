import { Transform } from 'class-transformer';

// Trims spaces from strings so "   " becomes "" and fails @IsNotEmpty.
// Transforms run before validation, so the rules check the cleaned value.
export const Trim = () =>
  Transform(({ value }) => (typeof value === 'string' ? value.trim() : value));
