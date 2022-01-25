public without sharing class ComplianceDocumentController {
    @AuraEnabled(cacheable=false)
    public static void createComplianceDocument(string recordId, string type, string fileId) {
        try {
            // --- Create Compliance Document ---
            Compliance_Document_Assignment__c complainceDocument = new Compliance_Document_Assignment__c();
            if (type == 'Account') {
                complainceDocument.Account__c = recordId;
            }
            else if(type == 'Contact') {
                complainceDocument.Contact__c = recordId;
            }
            insert complainceDocument;

            // --- Assign File to New Compliance Document ---
            ContentDocumentLink documentLink = new ContentDocumentLink();
            documentLink.ContentDocumentId = fileId;
            documentLink.LinkedEntityId = complainceDocument.Id;
            insert documentLink;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
