export interface SearchQuery {
  page: number;
  pageSize: number;
  address?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  type?: string[];
}

export interface RequestBody {
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  type?: string;
}

export interface PathParams {
  id: number;
}
