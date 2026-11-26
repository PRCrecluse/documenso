import { useDebouncedValue } from '@documenso/lib/client-only/hooks/use-debounced-value';
import { Input } from '@documenso/ui/primitives/input';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { SearchIcon } from 'lucide-react';
import { useQueryStates } from 'nuqs';
import { useEffect, useState } from 'react';

import { documentsSearchParams } from '~/utils/documents-search-params';

export const DocumentSearch = () => {
  const { _ } = useLingui();

  const [{ query }, setSearchParams] = useQueryStates(
    {
      query: documentsSearchParams.query,
      page: documentsSearchParams.page,
    },
    { history: 'push' },
  );

  const [searchTerm, setSearchTerm] = useState(query ?? '');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm !== (query ?? '')) {
      // Reset pagination so a new search never lands on an empty page.
      void setSearchParams({
        query: debouncedSearchTerm || null,
        page: null,
      });
    }
  }, [debouncedSearchTerm, query, setSearchParams]);

  return (
    <div className="relative">
      <SearchIcon
        aria-hidden="true"
        className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        aria-label={_(msg`Search documents`)}
        className="ps-9"
        placeholder={_(msg`Search documents...`)}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};
