export interface SearchQuery {
  page: number;
  pageSize: number;
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
