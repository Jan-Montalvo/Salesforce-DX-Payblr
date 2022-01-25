public without sharing class SearchController {
    @AuraEnabled
    public static List<sObject> search(String objectName, List<String> fields, String searchTerm) {
        try {
            String searchKeyword = searchTerm + '*';
            String returningQuery = objectName+' ( Id, '+String.join(fields,',')+')';
            String query = 'FIND :searchKeyword IN ALL FIELDS RETURNING '+returningQuery+' LIMIT 20';

            List<List<sObject>> searchRecords = new List<List<sObject>>();
            List<SObject> sobjList = new List<SObject>();
            if(String.isBlank(searchTerm)) {
                String soqlQuery = 'SELECT Id, Name, Type, LastViewedDate FROM RecentlyViewed WHERE Type =\''+objectName+'\' ORDER BY LastViewedDate DESC LIMIT 5';
                sobjList = Database.query( soqlQuery );
                searchRecords.add(sobjList);
            }
            else {
                searchRecords = Search.Query(Query);
            }

            return searchRecords.get(0);
        } catch (Exception e) {
            System.debug('@@Error on search(): ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }        
    }

    @AuraEnabled
    public static sObject getRecentlyCreatedRecord(String recordId, List<String> fields, String objectName) {
        try {
            String query = 'SELECT Id, '+String.join(fields,',')+' FROM '+objectName+' WHERE Id = \''+recordId+'\'';
            List<SObject> sobjList = Database.query( query );
            sObject createdRecord = sobjList.get(0);
            
            return createdRecord;
        } catch (Exception e) {
            System.debug('@@Error on getRecentlyCreatedRecord(): ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }   
    }
}