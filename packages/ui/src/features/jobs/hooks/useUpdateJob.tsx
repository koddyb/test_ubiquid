import { useState } from "react";

type JobUpdateData = {
    title: string;
    category: string;
    salary: number;
    type: string;
}

export const useUpdateJob = (uuid: string | undefined)  => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSucces] = useState(false);

    const updateJob = (jobData: JobUpdateData) => {
        setError(null);
        setSucces(true);

        fetch(`http://localhost:3000/jobs/${uuid}`, {
            method: "PUT",
            body: JSON.stringify(jobData),
            headers: {
                "Content-Type": "application/json",
                "authorization": "ubiquid",
            },
        }).then((response) => {
            if (!response.ok) {
                response.json().then((r) => setError(r.message || "Une erreur est survenue"));
            } else {
                response.json().then(() => setSucces(true));
            }
        });
    };

    return { updateJob, error, success };
};