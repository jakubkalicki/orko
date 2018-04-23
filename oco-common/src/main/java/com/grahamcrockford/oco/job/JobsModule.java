package com.grahamcrockford.oco.job;

import com.google.inject.AbstractModule;

public class JobsModule extends AbstractModule {
  @Override
  protected void configure() {
    install(new LimitOrderJobProcessor.Module());
    install(new OneCancelsOtherProcessor.Module());
    install(new OrderStateNotifierProcessor.Module());
    install(new PumpCheckerProcessor.Module());
    install(new SoftTrailingStopProcessor.Module());
    install(new AlertProcessor.Module());
  }
}