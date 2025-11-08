import { type FC } from "react";
import { type JobCategory,type JobType,type SearchFilters } from "../../hooks/useJobs";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  filters: SearchFilters;
  onFilterChange: (newFilters: Partial<SearchFilters>) => void;
  onReset: () => void;
}

const SearchBar: FC<SearchBarProps> = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchGroup}>
        <input
          type="text"
          placeholder="Rechercher par intitulé..."
          value={filters.searchTerm}
          onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.filterGroup}>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ category: e.target.value as JobCategory | "all" })}
          className={styles.select}
        >
          <option value="all">Toutes les catégories</option>
          <option value="it">IT</option>
          <option value="sales">Sales</option>
          <option value="managment">Managment</option>
        </select>

        <select
          value={filters.jobType}
          onChange={(e) => onFilterChange({ jobType: e.target.value as JobType | "all" })}
          className={styles.select}
        >
          <option value="all">Tous les types</option>
          <option value="cdi">CDI</option>
          <option value="cdd">CDD</option>
          <option value="internship">Intership</option>
        </select>

        <button onClick={onReset} className={styles.resetButton}>
          Réinitialiser
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
