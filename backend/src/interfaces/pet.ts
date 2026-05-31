interface Pet {
  id: string;
  url: string;
  width: number;
  height: number;
}

interface Dog extends Pet {
  breeds: unknown[];
  categories?: unknown[];
}

export type PetItem = Pet | Dog;
