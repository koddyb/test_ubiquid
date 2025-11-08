import type { FC } from "react";
import JobCard from "../../components/JobCard/JobCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import { useJobs, type SearchFilters } from "../../hooks/useJobs";
import styles from "./List.module.css";
import Sort from "./Sort/Sort";

const JobList: FC = () => {
  const {
    jobs,
    error,
    isLoading,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    filters,
    updateFilters,
    resetFilters,
  } = useJobs();

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    updateFilters(newFilters);
  };

  const handleReset = () => {
    resetFilters();
  };

  return (
    <div className={styles.container}>
      <h1>Liste des offres d'emploi</h1>
      
      <SearchBar 
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      {error && <div className={styles.error}>⚠️ {error}</div>}
      
      {isLoading ? (
        <div className={styles.loading}>Chargement des offres...</div>
      ) : (
        <>
          <Sort
            setSortBy={setSortBy}
            setSortOrder={setSortOrder}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
          
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <JobCard job={job} key={job.uuid} />
            ))
          ) : (
            <div className={styles.noResults}>
              Aucune annonce ne correspond à votre recherche.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobList;
