import { type FC, useMemo } from "react";
import { useParams, Link } from "react-router";
import JobForm, { type JobFormData } from "../../components/JobForm/JobForm";
import { useJobs } from "../../hooks/useJobs";
import { useUpdateJob } from "../../hooks/useUpdateJob.tsx";
import styles from "./Edit.module.css";

const EditJob: FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const { jobs, isLoading, error: jobsError } = useJobs();
    const { updateJob, error: updateError, success } = useUpdateJob(uuid);

    const job = useMemo(() => {
        return jobs.find((j) => j.uuid === uuid);
    }, [jobs, uuid]);

    const handleSubmit = (formData: JobFormData) => {
        updateJob({
            ...formData,
            salary: +formData.salary,
        });
    };

    if (isLoading) return <div>Chargement de l'offre...</div>;
    if (jobsError)  return <div className={styles.error}>{jobsError}</div>;
    if (!job) return <div className={styles.error}>Offre non trouvée.</div>;


    return (
        <div className={styles.container}>
            <h1>Modifier l'offre : {job.title}</h1>
            {success && (
                <div className={styles.success}>
                    Annonce mise à jour avec succès !{" "}
                    <Link to="/">Retour à la liste</Link>
                </div>
            )}
            {updateError && (
                <div className={styles.error}>Erreur : {updateError}</div>
            )}

            <JobForm
                onSubmit={handleSubmit}
                initialData={{
                    ...job,
                    salary: job.salary.toString(),
                }}
                //initialData={job}
                buttonLabel="Mettre à jour"
            />
        </div>
    );
};

export default EditJob;