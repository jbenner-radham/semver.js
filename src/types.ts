import { NORMALIZED_X_RANGE_CHAR } from './constants';

export type VersionComparator = '<' | '<=' | '=' | '>' | '>=' | '^' | '~';

export type VersionNumberOrXRange = number | typeof NORMALIZED_X_RANGE_CHAR;
