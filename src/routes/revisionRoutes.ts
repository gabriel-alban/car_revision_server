import { Router } from "express";
import revisionController from "../controllers/revisionController.js";
import { validate } from "../middleware/validateSchemas.js";
import { createRevisionSchema, revisionParamSchema } from "../validations/revisionValidation.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router({ mergeParams: true });

router.get('/', authMiddleware, revisionController.getRevisions);
router.post('/', authMiddleware, validate(createRevisionSchema), revisionController.storeRevision);
router.delete('/:id', authMiddleware, validate(revisionParamSchema), revisionController.deleteRevision)

export default router;
