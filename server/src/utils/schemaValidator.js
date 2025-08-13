import Joi from 'joi';
import fs from 'fs';
import path from 'path';

const schemaPath = path.resolve('scraped-schema.json');
const scrapedSchema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));

export const buildJoiSchema = (step) => {
  const fields = scrapedSchema[step];
  const joiShape = {};

  fields.forEach(field => {
    if (field.typeAttr === 'hidden' || field.type === 'button') return;
    let key = field.name || field.id;
    if (!key) return;

    if (field.typeAttr === 'checkbox') {
      joiShape[key] = Joi.boolean().valid(true).required();
    } else {
      let validator = Joi.string().trim();
      if (field.required) validator = validator.required();
      if (field.pattern) {
        if (field.name.includes('pan')) {
          validator = validator.pattern(new RegExp('^[A-Z]{5}\\d{4}[A-Z]{1}$')).message('PAN must be 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)');
        } else if (field.name.includes('otp')) {
          validator = validator.pattern(/^\d{6}$/).message('OTP must be 6 digits');
        } else if (field.name.includes('adhar')) {
          validator = validator.pattern(/^\d{12}$/).message('Aadhaar must be 12 digits');
        } else {
          validator = validator.pattern(new RegExp(field.pattern));
        }
      }
      joiShape[key] = validator;
    }
  });

  return Joi.object(joiShape);
};