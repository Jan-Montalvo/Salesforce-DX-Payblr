@isTest
private class ComplianceDocumentControllerTest {
    @IsTest
    static void test_Account_CreateComplianceDocument(){
        Account newAccount = new Account();
        newAccount.Name = 'Test Account';
        insert newAccount;

        ContentVersion document = new ContentVersion();
        document.versionData = Blob.valueOf('This is the content of the file for testing.');
        document.title = 'Test_File';
        document.pathOnClient = 'Test_File.txt'; // The complete path of the document. One of the fields that determines the FileType. (This is need if file is to be previewed in Salesforce)
        insert document;

        ContentVersion fileVersion = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =: document.Id]; 

        Test.startTest(); 
        ComplianceDocumentController.createComplianceDocument(newAccount.Id, 'Account', fileVersion.ContentDocumentId);
        Test.stopTest();
    }

    @IsTest
    static void test_Contact_CreateComplianceDocument(){
        Contact newContact = new Contact();
        newContact.LastName = 'Test Contact';
        insert newContact;

        ContentVersion document = new ContentVersion();
        document.versionData = Blob.valueOf('This is the content of the file for testing.');
        document.title = 'Test_File';
        document.pathOnClient = 'Test_File.txt'; // The complete path of the document. One of the fields that determines the FileType. (This is need if file is to be previewed in Salesforce)
        insert document;

        ContentVersion fileVersion = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =: document.Id]; 

        Test.startTest(); 
        ComplianceDocumentController.createComplianceDocument(newContact.Id, 'Contact', fileVersion.ContentDocumentId);
        Test.stopTest();
    }

    @IsTest
    static void test_Error_CreateComplianceDocument() {
        Test.startTest(); 
        try {
            ComplianceDocumentController.createComplianceDocument('Invalid Record', 'Contact', 'Invalid Id');
        } catch (Exception e) {
            System.debug('Successful Error test');
        }
        Test.stopTest();
    }
}
