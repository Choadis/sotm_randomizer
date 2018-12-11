/**
 * Simple SotM API
 * SotM API that handles data for my app
 *
 * OpenAPI spec version: 1.0.0
 * Contact: dahlgrensm@gmail.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
package io.swagger.client.model

import io.swagger.client.core.ApiModel
import org.joda.time.DateTime
import java.util.UUID

case class Hero (
  id: UUID,
  name: String,
  `type`: String,
  set: String
) extends ApiModel


