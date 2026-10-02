import { randomUUID } from "node:crypto";
import type { DB } from "./db";
export interface Job extends Record<string, unknown> {
  id: string;
  shop: string;
  kind: string;
  attempts: number;
  lease_token: string;
  generation: number;
  payload: { alertId: string };
}
export async function claim(database: DB) {
  const {
    rows: [job],
  } = await database.query<Job>(
    `UPDATE jobs SET state='running',attempts=attempts+1,lease_until=now()+interval '15 minutes',lease_token=$1
    WHERE id=(SELECT id FROM jobs WHERE (state='queued' AND run_at<=now()) OR (state='running' AND lease_until<now())
    ORDER BY run_at FOR UPDATE SKIP LOCKED LIMIT 1) RETURNING *`,
    [randomUUID()],
  );
  return job;
}
export async function failJob(database: DB, job: Job) {
  const delay =
    Math.min(3600, 2 ** job.attempts * 5) + Math.floor(Math.random() * 5);
  await database.query(
    "UPDATE jobs SET state=$3,run_at=now()+($4 * interval '1 second'),error=$5,lease_until=NULL WHERE id=$1 AND lease_token=$2 AND state='running'",
    [
      job.id,
      job.lease_token,
      job.attempts >= 8 ? "failed" : "queued",
      delay,
      `${job.kind.toUpperCase()}_FAILED: inspect credentials, scopes and connectivity`,
    ],
  );
}
