/**
 * Utility type definitions
 * 
 * Common utility types, generic helpers, and type manipulation
 * utilities used throughout the application.
 */

// Make all properties optional
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Make all properties required
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Pick specific properties from type
export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit specific properties from type
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// Create type with specific properties optional
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Create type with specific properties required
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

// Nullable type helper
export type Nullable<T> = T | null;

// Optional type helper
export type Optional<T> = T | undefined;

// Maybe type (null or undefined)
export type Maybe<T> = T | null | undefined;

// Non-empty array
export type NonEmptyArray<T> = [T, ...T[]];

// String literal union from object keys
export type KeysOf<T> = keyof T;

// String literal union from object values
export type ValuesOf<T> = T[keyof T];

// Deep partial - makes all nested properties optional
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Deep required - makes all nested properties required
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

// Function type helpers
export type VoidFunction = () => void;
export type Predicate<T> = (value: T) => boolean;
export type Mapper<T, U> = (value: T) => U;
export type AsyncMapper<T, U> = (value: T) => Promise<U>;

// Promise result type
export type PromiseResult<T> = T extends Promise<infer U> ? U : never;

// Array element type
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

// Object property type
export type PropertyType<T, K extends keyof T> = T[K];

// Constructor type
export type Constructor<T = object> = new (...args: unknown[]) => T;

// Class type  
export type Class<T = object> = Constructor<T> & { prototype: T };

// Event handler type
export type EventHandler<T = Event> = (event: T) => void;

// Async event handler type
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

// Generic callback function
export type Callback<T = void> = (result: T) => void;

// Error callback
export type ErrorCallback = (error: Error) => void;

// Success callback
export type SuccessCallback<T = void> = (result: T) => void;

// Generic transformer function
export type Transformer<T, U = T> = (input: T) => U;

// Validator function
export type Validator<T> = (value: T) => boolean | string;

// Async validator function
export type AsyncValidator<T> = (value: T) => Promise<boolean | string>;

// Serializer functions
export type Serializer<T> = (value: T) => string;
export type Deserializer<T> = (serialized: string) => T;

// Dictionary/Record type aliases
export type Dictionary<T = unknown> = Record<string, T>;
export type NumericDictionary<T = unknown> = Record<number, T>;

// ID types for type safety
export type ID = string;
export type NumericID = number;
export type UUID = string;

// Timestamp types
export type Timestamp = number;
export type ISODateString = string;

// Coordinate types
export type Latitude = number;
export type Longitude = number;
export type Coordinates = [Longitude, Latitude];

// Percentage type (0-100)
export type Percentage = number;

// Currency amount type
export type CurrencyAmount = number;

// File and media types
export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

// Generic list/pagination types
export interface ListResult<T> {
  items: T[];
  total: number;
  page?: number;
  pageSize?: number;
  hasMore?: boolean;
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Search and filter types
export interface SearchOptions {
  query?: string;
  filters?: Dictionary;
  limit?: number;
  offset?: number;
}

// Generic API response wrapper
export interface ResponseWrapper<T> {
  data: T;
  meta?: Dictionary;
  errors?: string[];
}