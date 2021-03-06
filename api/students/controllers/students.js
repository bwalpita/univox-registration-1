'use strict';

const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.students.findOne({ nic_no: id });
    return sanitizeEntity(entity, { model: strapi.models.students });
  }
};
