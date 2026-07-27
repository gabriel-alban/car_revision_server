import { Router } from "express";
import revisionController from "../controllers/revisionController.js";
import { validate } from "../middleware/validateSchemas.js";
import { createRevisionSchema, revisionParamSchema } from "../validations/revisionValidation.js";

const router = Router({ mergeParams: true });

router.get('/', revisionController.getRevisions);
router.post('/', validate(createRevisionSchema), revisionController.storeRevision);
router.delete('/:id', validate(revisionParamSchema), revisionController.deleteRevision)

export default router;
