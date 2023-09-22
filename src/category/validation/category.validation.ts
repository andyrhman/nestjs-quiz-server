import * as Joi from 'joi';

export const categoryValidation = Joi.object({
  name: Joi.string().required().error(() => {
    return new Error("Full name is required");
  }),
});
