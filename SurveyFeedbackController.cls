public with sharing class SurveyFeedbackController {
    @AuraEnabled(cacheable=true)
    public static List<SurveyQuestionResponse> getSurveyResponses(Id oppId) {
        // Security check
        if (!Schema.sObjectType.SurveyQuestionResponse.isAccessible() ||
            !Schema.sObjectType.SurveySubject.isAccessible()) {
            throw new AuraHandledException('You do not have permission to view survey responses.');
        }

        try {
            return [
                SELECT Id, Question.Name, ResponseValue, CreatedDate, ResponseShortText, QuestionId
                FROM SurveyQuestionResponse
                WHERE InvitationId IN (
                    SELECT ParentId 
                    FROM SurveySubject 
                    WHERE SubjectId = :oppId
                )
                ORDER BY CreatedDate DESC
            ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
