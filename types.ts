
export interface Option {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

export interface ShedConfig {
  size: Option | null;
  style: Option | null;
  siding: Option | null;
  roof: Option | null;
  addons: Option[];
}
