import { useEffect, useState, useMemo, useCallback } from "react";

export type JobCategory = "it" | "sales" | "managment";
export type JobType = "cdi" | "cdd" | "internship";
export type SortByT = "title" | "category" | "type" | "salary" | "createdAt";
export type SortOrderT = "asc" | "desc";

export interface Job {
  uuid: string;
  title: string;
  category: JobCategory;
  type: JobType;
  salary: number;
  createdAt: string;
}

// iltres de recherche
export interface SearchFilters {
  searchTerm: string;
  category: JobCategory | "all";
  jobType: JobType | "all";
}

const URL = "http://localhost:3000/jobs";

export const useJobs = () => {

  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);//en attente
  const [error, setError] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<SortByT>("title");
  const [sortOrder, setSortOrder] = useState<SortOrderT>("asc");

  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: "",
    category: "all",
    jobType: "all"
  });

  useEffect(() => {
    const getJobs = async () => {
      try {
        const response = await fetch(URL, {
          headers: { "authorization": "ubiquid" }
        });

        if (!response.ok) {
          throw new Error("Erreur de la connexion au serveur.");
        }

        const data = await response.json();
        setAllJobs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    };
    getJobs();
    //getJobs().then(r => console.log(r));
  }, []);

  // je met à jour les filtres
  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // je réinitialise les filtres
  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      category: "all",
      jobType: "all"
    });
  };

  const sortFn = useCallback((a: Job, b: Job): number => {
    switch (sortBy) {
      case "category":
        return sortOrder === "asc" 
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      case "salary":
        return sortOrder === "asc" 
          ? a.salary - b.salary 
          : b.salary - a.salary;
      case "title":
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      case "type":
        return sortOrder === "asc"
          ? a.type.localeCompare(b.type)
          : b.type.localeCompare(a.type);
      case "createdAt":
        return sortOrder === "asc" 
          ? a.createdAt.localeCompare(b.createdAt) 
          : b.createdAt.localeCompare(a.createdAt);
      default:
        return 0;
    }
  }, [sortBy, sortOrder]);

  // Refiltrage de sortFN
  const filteredAndSortedJobs = useMemo(() => {
    return allJobs
      .filter(job => {
        // par intitulé
        const matchesSearch = filters.searchTerm === "" || 
          job.title.toLowerCase().includes(filters.searchTerm.toLowerCase());
        
        // par catégorie
        const matchesCategory = filters.category === "all" || 
          job.category === filters.category;
        
        // par poste
        const matchesJobType = filters.jobType === "all" || 
          job.type === filters.jobType;
        
        return matchesSearch && matchesCategory && matchesJobType;
      })
      .sort(sortFn);
  }, [allJobs, filters.category, filters.jobType, filters.searchTerm, sortFn]);

  return {
    jobs: filteredAndSortedJobs,
    error,
    isLoading,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filters,
    updateFilters,
    resetFilters
  };
};
