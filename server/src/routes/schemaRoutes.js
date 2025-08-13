import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const schemaPath = path.resolve('scraped-schema.json');

router.get('/:step', (req, res) => {
  const step = req.params.step;
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
  if (!schema[step]) return res.status(404).json({ message: 'Step not found' });
  // Filter out hidden fields
  const filteredSchema = schema[step].filter(field => field.typeAttr !== 'hidden');
  res.json(filteredSchema);
});

export default router;