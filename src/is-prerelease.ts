import PrereleaseComparator from './comparison/prerelease-comparator';

export default function isPrerelease(prerelease: string): PrereleaseComparator {
  return new PrereleaseComparator(prerelease);
}
