import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { CatalogItem } from '../types/catalog';

export const useCatalog = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCatalogItems = useCallback(async () => {
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
    return data || [];
  }, []);

  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['catalog-items'],
    queryFn: fetchCatalogItems,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 30 * 60 * 1000 // Cache for 30 minutes
  });

  const searchItems = useCallback((term: string) => {
    if (!term.trim()) return items;

    const searchTerm = term.toLowerCase().trim();
    return items.filter(item => {
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
      ];

      const codes = item.catalog_codes?.map(code => `${code.code_type} ${code.code}`) || [];
      searchableFields.push(...codes);

      const tags = item.catalog_tags?.map(tag => tag.tag) || [];
      searchableFields.push(...tags);

      if (item.govt_price) {
        searchableFields.push(item.govt_price.toString());
      }

      return searchableFields
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(searchTerm);
    });
  }, [items]);

  const filteredItems = useMemo(() => searchItems(searchTerm), [searchItems, searchTerm]);

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['catalog-items'] });
  }, [queryClient]);

  return {
    items: filteredItems,
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : 'An error occurred') : null,
    refetch,
    searchItems,
    setSearchTerm
  };
};