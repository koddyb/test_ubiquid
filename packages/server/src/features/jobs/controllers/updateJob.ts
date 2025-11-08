import type { RequestHandler } from "express";
import { z } from "zod";
import { jobs } from "../../../db/jobs.ts";

const UpdateJobSchema = z.object({
  title: z.string(),
  category: z.literal(["it", "sales", "managment"]),
  type: z.literal(["cdi", "cdd", "internship"]),
  salary: z.number(),
});

const ParamsSchema = z.object({
  uuid: z.string().uuid("Uiid invalide"),
});

export const updateJob: RequestHandler = async (req, res, next) => {
  try {
    const params = ParamsSchema.parse(req.params);
    const body = UpdateJobSchema.parse(req.body);
    const jobIndex = jobs.findIndex((job) => job.uuid === params.uuid);

    if (jobIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "aucun job trouvé",
      });
    }

    const originalJob = jobs[jobIndex];
    // @ts-ignore
      const updatedJob: Job = {
      ...originalJob,
      ...body,
    };

    jobs[jobIndex] = updatedJob;

    res.status(200).json(updatedJob);
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({
        success: false,
        message: e.message,
      });
    } else {
      res.status(500).send();
    }
  }
};