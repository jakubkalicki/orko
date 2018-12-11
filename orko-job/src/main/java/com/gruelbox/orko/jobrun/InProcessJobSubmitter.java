package com.gruelbox.orko.jobrun;

import static org.apache.commons.lang3.StringUtils.isEmpty;

import java.util.UUID;

import com.google.inject.Inject;
import com.gruelbox.orko.jobrun.spi.Job;

/**
 * Implementation of {@link JobSubmitter} which runs the job within the same process.
 */
public class InProcessJobSubmitter implements JobSubmitter {

  private final JobRunner jobRunner;

  @Inject
  InProcessJobSubmitter(JobRunner jobRunner) {
    this.jobRunner = jobRunner;
  }

  @Override
  public Job submitNew(Job job) throws Exception {
    if (isEmpty(job.id())) {
      job = job.toBuilder().id(UUID.randomUUID().toString()).build();
    }
    jobRunner.submitNew(job, () -> {}, () -> {});
    return job;
  }

  public final class JobNotUniqueException extends Exception {
    private static final long serialVersionUID = 7113718773155036498L;
    JobNotUniqueException() {
      super("Job cannot be locked. Already exists or UUID re-used");
    }
  }
}