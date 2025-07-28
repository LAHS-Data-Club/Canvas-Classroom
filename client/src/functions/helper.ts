export function removeDuplicateIds<T extends { id: string }>(arr: T[]): T[] {
  const prevIds: string[] = [];
  return arr.filter((item) => {
    if (!prevIds.includes(item.id)) {
      prevIds.push(item.id);
      return true;
    }
    return false;
  });
}

export function enumerate(num: number) {
  return Array.from({ length: num }, (_, i) => i + 1);
}

