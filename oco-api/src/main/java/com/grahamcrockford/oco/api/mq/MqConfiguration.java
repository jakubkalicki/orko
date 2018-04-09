package com.grahamcrockford.oco.api.mq;

import org.hibernate.validator.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MqConfiguration {

  @NotEmpty
  @JsonProperty
  private String clientURI;

  String getClientURI() {
    return clientURI;
  }

}