import { LightningElement, api, wire } from 'lwc';
import getSurveyResponses from '@salesforce/apex/SurveyFeedbackController.getSurveyResponses';

export default class OpportunitySurveyFeedback extends LightningElement {
    @api recordId;
    surveyResponses = [];
    error;

    @wire(getSurveyResponses, { oppId: '$recordId' })
    wiredResponses({ error, data }) {
        if (data) {
            this.surveyResponses = data.map(row => {
                let response = row.ResponseValue || row.ResponseShortText || '';
                
                // Determine styling if numeric value
                let isNumeric = !isNaN(parseFloat(response)) && isFinite(response);
                let badgeClass = 'slds-badge slds-p-horizontal_medium slds-p-vertical_xx-small ';
                
                if (isNumeric) {
                    let num = parseFloat(response);
                    // Examples for CSAT or NPS 0-10 or 1-5
                    if (num >= 8 || (num >= 4 && num <= 5)) {
                        badgeClass += 'slds-theme_success'; // Green
                    } else if (num >= 5 || num === 3) {
                        badgeClass += 'slds-theme_warning'; // Orange
                    } else {
                        badgeClass += 'slds-theme_error'; // Red
                    }
                } else {
                    badgeClass += 'slds-badge_lightest'; // Standard text
                }

                return {
                    Id: row.Id,
                    QuestionName: row.Question ? row.Question.Name : 'Question Inconnue',
                    ResponseValue: response,
                    BadgeClass: badgeClass,
                    CreatedDate: row.CreatedDate
                };
            });
            this.error = undefined;
        } else if (error) {
            this.error = 'Erreur lors de la récupération des réponses: ' + (error.body ? error.body.message : error.message);
            this.surveyResponses = [];
        }
    }

    get hasData() {
        return this.surveyResponses && this.surveyResponses.length > 0;
    }
}
