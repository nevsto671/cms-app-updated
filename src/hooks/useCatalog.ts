import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CatalogItem } from '../types/catalog';

export const useCatalog = () => {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCatalogItems = async () => {
    try {
      const { data, error } = await supabase
        .from('catalog_items')
        .select(`
          *,
          catalog_codes (
            code_type,
            code
          ),
          catalog_tags (
            tag
          )
        `);

      if (error) throw error;
      setItems(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch catalog items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogItems();
  }, []);

  const searchItems = (searchTerm: string) => {
    if (!searchTerm.trim()) return items;

    const term = searchTerm.toLowerCase().trim();
    return items.filter(item => {
      // Search through all text fields
      const searchableFields = [
        item.title,
        item.description,
        item.category,
        item.item_no,
        item.mfr_name,
        item.mfr_item_no,
        item.contract_name,
        item.contract_no,
        item.uom,
        item.sin
      ].filter(Boolean); // Remove null/undefined values

      // Search through catalog codes
      const codes = item.catalog_codes?.map(code => `${code.code_type} ${code.code}`) || [];
      searchableFields.push(...codes);

      // Search through tags
      const tags = item.catalog_tags?.map(tag => tag.tag) || [];
      searchableFields.push(...tags);

      // Convert numeric fields to string for searching
      if (item.govt_price !== null && item.govt_price !== undefined) {
        searchableFields.push(item.govt_price.toString());
      }

      // Join all fields and search
      return searchableFields
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  };

  return { items, loading, error, refetch: fetchCatalogItems, searchItems };
};