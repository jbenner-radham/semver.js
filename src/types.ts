import { PREFERRED_X_RANGE_CHAR } from './constants';

export type VersionComparator = '<' | '<=' | '=' | '>' | '>=' | '^' | '~';

export type VersionNumberOrXRange = number | typeof PREFERRED_X_RANGE_CHAR;
