/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { schema } from '@kbn/config-schema';
import { i18n } from '@kbn/i18n';
import { ROUTE_TAG_CAN_REDIRECT } from '@kbn/security-plugin/server';
import { incrementApiUsageCounter } from '..';
import { ReportingCore } from '../..';
import { API_BASE_URL } from '../../../common/constants';
import { authorizedUserPreRouting } from '../lib/authorized_user_pre_routing';
import { jobsQueryFactory } from '../lib/jobs_query';
import { deleteJobResponseHandler, downloadJobResponseHandler } from '../lib/job_response_handler';
import { handleUnavailable } from '../lib/request_handler';

const MAIN_ENTRY = `${API_BASE_URL}/jobs`;

export function registerJobInfoRoutes(reporting: ReportingCore) {
  const setupDeps = reporting.getPluginSetupDeps();
  const { router } = setupDeps;
  const jobsQuery = jobsQueryFactory(reporting);

  const registerGetList = () => {
    // list jobs in the queue, paginated
    const path = `${MAIN_ENTRY}/list`;

    router.get(
      {
        path,
        validate: {
          query: schema.object({
            page: schema.string({ defaultValue: '0' }),
            size: schema.string({ defaultValue: '10' }),
            ids: schema.maybe(schema.string()),
          }),
        },
      },
      authorizedUserPreRouting(reporting, async (user, context, req, res) => {
        incrementApiUsageCounter(req.route.method, path, reporting.getUsageCounter());

        // ensure the async dependencies are loaded
        if (!context.reporting) {
          return handleUnavailable(res);
        }

        const {
          management: { jobTypes = [] },
        } = await reporting.getLicenseInfo();
        const { page: queryPage = '0', size: querySize = '10', ids: queryIds = null } = req.query;
        const page = parseInt(queryPage, 10) || 0;
        const size = Math.min(100, parseInt(querySize, 10) || 10);
        const jobIds = queryIds ? queryIds.split(',') : null;
        const results = await jobsQuery.list(jobTypes, user, page, size, jobIds);

        return res.ok({
          body: results,
          headers: {
            'content-type': 'application/json',
          },
        });
      })
    );
  };

  const registerGetCount = () => {
    // return the count of all jobs in the queue
    const path = `${MAIN_ENTRY}/count`;

    router.get(
      {
        path,
        validate: false,
      },
      authorizedUserPreRouting(reporting, async (user, context, req, res) => {
        incrementApiUsageCounter(req.route.method, path, reporting.getUsageCounter());

        // ensure the async dependencies are loaded
        if (!context.reporting) {
          return handleUnavailable(res);
        }

        const {
          management: { jobTypes = [] },
        } = await reporting.getLicenseInfo();

        const count = await jobsQuery.count(jobTypes, user);

        return res.ok({
          body: count.toString(),
          headers: {
            'content-type': 'text/plain',
          },
        });
      })
    );
  };

  const registerGetInfo = () => {
    // return some info about the job
    const path = `${MAIN_ENTRY}/info/{docId}`;

    router.get(
      {
        path,
        validate: {
          params: schema.object({
            docId: schema.string({ minLength: 2 }),
          }),
        },
      },
      authorizedUserPreRouting(reporting, async (user, context, req, res) => {
        incrementApiUsageCounter(req.route.method, path, reporting.getUsageCounter());

        // ensure the async dependencies are loaded
        if (!context.reporting) {
          return res.custom({ statusCode: 503 });
        }

        const { docId } = req.params;
        const {
          management: { jobTypes = [] },
        } = await reporting.getLicenseInfo();

        const result = await jobsQuery.get(user, docId);

        if (!result) {
          return res.notFound();
        }

        const { jobtype: jobType } = result;

        if (!jobTypes.includes(jobType)) {
          return res.forbidden({
            body: i18n.translate('xpack.reporting.jobsQuery.infoError.unauthorizedErrorMessage', {
              defaultMessage: 'Sorry, you are not authorized to view {jobType} info',
              values: { jobType },
            }),
          });
        }

        return res.ok({
          body: result,
          headers: {
            'content-type': 'application/json',
          },
        });
      })
    );
  };

  const registerDownloadReport = () => {
    // trigger a download of the output from a job
    const path = `${MAIN_ENTRY}/download/{docId}`;

    router.get(
      {
        path,
        validate: {
          params: schema.object({
            docId: schema.string({ minLength: 3 }),
          }),
        },
        options: { tags: [ROUTE_TAG_CAN_REDIRECT] },
      },
      authorizedUserPreRouting(reporting, async (user, context, req, res) => {
        incrementApiUsageCounter(req.route.method, path, reporting.getUsageCounter());

        // ensure the async dependencies are loaded
        if (!context.reporting) {
          return handleUnavailable(res);
        }

        const { docId } = req.params;
        const {
          management: { jobTypes = [] },
        } = await reporting.getLicenseInfo();

        return downloadJobResponseHandler(reporting, res, jobTypes, user, { docId });
      })
    );
  };

  const registerDeleteReport = () => {
    // allow a report to be deleted
    const path = `${MAIN_ENTRY}/delete/{docId}`;

    router.delete(
      {
        path,
        validate: {
          params: schema.object({
            docId: schema.string({ minLength: 3 }),
          }),
        },
      },
      authorizedUserPreRouting(reporting, async (user, context, req, res) => {
        incrementApiUsageCounter(req.route.method, path, reporting.getUsageCounter());

        // ensure the async dependencies are loaded
        if (!context.reporting) {
          return handleUnavailable(res);
        }

        const { docId } = req.params;
        const {
          management: { jobTypes = [] },
        } = await reporting.getLicenseInfo();

        return deleteJobResponseHandler(reporting, res, jobTypes, user, { docId });
      })
    );
  };

  registerGetList();
  registerGetCount();
  registerGetInfo();
  registerDownloadReport();
  registerDeleteReport();
}