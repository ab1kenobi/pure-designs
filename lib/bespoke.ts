export const BESPOKE_TYPES = [
  { value: "scarf", label: "Bespoke scarf", price: 150 },
  { value: "purse", label: "Bespoke purse", price: 75 },
  { value: "set", label: "Bespoke scarf + purse set", price: 175 }
] as const;

export type BespokeType = typeof BESPOKE_TYPES[number]["value"];

export type BespokeDraft = {
  name: string;
  email: string;
  phone: string;
  type: BespokeType;
  colors: string;
  occasion: string;
  description: string;
  inspiration_url: string;
};

export const BESPOKE_DRAFT_KEY = "pdb-bespoke-draft";
