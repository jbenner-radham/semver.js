import PrereleaseComparator from './comparison/prerelease-comparator';

export default function isPrerelease(prerelease = ''): PrereleaseComparator {
  return new PrereleaseComparator(prerelease);
}
