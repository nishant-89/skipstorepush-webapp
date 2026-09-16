// React import
import React, { useCallback, useRef } from "react";

// MUI components
import { InputAdornment, TextField } from "@mui/material";

// Common shared components
import { regex, Search } from "src/utils/common/constants";

// Styles
import "./search.scss";

type DEBOUNCE_SEARCH_PROP_TYPE = {
  onSearch: (query: string) => void;
  debounceTime?: number;
  placeholder?: string;
  alphanumericOnly?: boolean;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

const DebounceSearch = ({
  onSearch,
  debounceTime = 1000,
  placeholder = "Search...",
  alphanumericOnly = true,
  setSearchTerm,
  searchTerm,
}: DEBOUNCE_SEARCH_PROP_TYPE) => {
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSearch = useCallback(
    (query: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        if (query.length > 1 || query.length === 0) onSearch(query);
      }, debounceTime);
    },
    [onSearch, debounceTime]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event?.target?.value
      ?.trimStart()
      ?.replace(regex.Emojis, "");

    if (alphanumericOnly) {
      const alphanumericWithSpacesRegex = /^[a-zA-Z0-9][a-zA-Z0-9 _.-]*$/;
      if (
        alphanumericWithSpacesRegex.test(newSearchTerm) ||
        newSearchTerm === ""
      ) {
        setSearchTerm(newSearchTerm);
        debouncedSearch(newSearchTerm);
      }
    } else {
      setSearchTerm(newSearchTerm);
      debouncedSearch(newSearchTerm);
    }
  };

  return (
    <div className="commonSearchWrapper customerSearch">
      <TextField
        onKeyDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        fullWidth
        className="searchInput"
        variant="outlined"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder={placeholder}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <img src={Search} alt="Icon" />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default DebounceSearch;
