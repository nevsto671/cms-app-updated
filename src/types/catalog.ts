export interface CatalogItem {
  id: string;
  sin: string;
  title: string;
  description: string;
  category: string;
  item_no: string;
  mfr_name: string;
  mfr_item_no: string;
  govt_price: number;
  contract_name: string;
  contract_no: string;
  uom: string;
  ai_enhanced: boolean;
  ai_last_processed?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CatalogCode {
  id: string;
  catalog_item_id: string;
  code_type: 'NAICS' | 'PSC' | 'SIN';
  code: string;
  created_at: Date;
}

export interface CatalogTag {
  id: string;
  catalog_item_id: string;
  tag: string;
  created_at: Date;
}