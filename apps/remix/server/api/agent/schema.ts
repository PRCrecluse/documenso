import { z } from 'zod-v4';

export const ZAgentFindDocumentsSchema = z.object({
  title: z.string().trim().min(1).max(255).describe('The document title given by the user.'),
});

export const ZAgentShareDocumentSchema = z
  .object({
    documentId: z.string().trim().min(1).max(128).describe('The ID of the document to share.'),
    recipientEmail: z.string().trim().max(254).email().describe('The authorized recipient’s email address.'),
    mode: z.enum(['sign', 'view']).describe('Send a signing invitation or a viewing invitation.'),
  })
  .strict();
