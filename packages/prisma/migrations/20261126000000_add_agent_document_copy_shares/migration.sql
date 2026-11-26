CREATE TABLE "AgentDocumentCopyShare" (
    "envelopeId" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "requestedByUserId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),

    CONSTRAINT "AgentDocumentCopyShare_pkey" PRIMARY KEY ("envelopeId", "recipientEmail")
);

ALTER TABLE "AgentDocumentCopyShare" ADD CONSTRAINT "AgentDocumentCopyShare_envelopeId_fkey" FOREIGN KEY ("envelopeId") REFERENCES "Envelope"("id") ON DELETE CASCADE ON UPDATE CASCADE;
