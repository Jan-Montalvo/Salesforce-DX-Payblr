public without sharing class ComplianceDocumentController {
    @AuraEnabled(cacheable=false)
    public static void createComplianceDocument(string recordId, string type, string fileId) {
        try {
            List<ContentDocument> file = [SELECT Title FROM ContentDocument WHERE Id =: fileId];

            // --- Create Compliance Document ---
            Document_Assignment__c complainceDocument = new Document_Assignment__c();
            if (type == 'Account') {
                complainceDocument.Account__c = recordId;
            }
            else if(type == 'Contact') {
                complainceDocument.Contact__c = recordId;
            }
            complainceDocument.Name = file[0].Title.abbreviate(80);
            complainceDocument.Document_Link__c = URL.getSalesforceBaseUrl().toExternalForm() + '/lightning/r/ContentDocument/' + fileId + '/view';
            insert complainceDocument;

            // --- Assign File to New Compliance Document ---
            ContentDocumentLink documentLink = new ContentDocumentLink();
            documentLink.ContentDocumentId = fileId;
            documentLink.LinkedEntityId = complainceDocument.Id;
            insert documentLink;
        } catch (Exception e) {
            System.debug('Create Compliance Document Error:' + e.getMessage() + ' : ' + e.getLineNumber());
            throw new AuraHandledException('Create Compliance Document Error:' + e.getMessage() + ' : ' + e.getLineNumber());
        }
    }
}
