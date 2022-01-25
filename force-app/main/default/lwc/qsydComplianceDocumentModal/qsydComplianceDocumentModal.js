import { api, LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createComplianceDocument from "@salesforce/apex/ComplianceDocumentController.createComplianceDocument";

export default class QsydComplianceDocumentModal extends LightningElement {

	@api objName = 'Account';
	@api fieldsToCreate = ['Name','Rating','Phone','Industry', 'AccountNumber'];
  @api fields = ['Name'];
	@api displayFields = 'Name, Phone';
	@api iconName = 'standard:account';
	@api labelName = 'Account Name';
	@api fileRecordId = '';

	@track recordId;


  handleCloseModal() {
		this.dispatchEvent(
			new CustomEvent('modalclick')
		);
	}

	handleLookup(event) {
		let data = event.detail.data;
		if(data && data.record) {
			this.recordId = data.recordId;
		}
		else {
			this.recordId = undefined;
		}
	}

	handleSave() {
		if (!this.recordId) {
			const warningEvent = new ShowToastEvent({
				title: 'Invalid record!',
				message: 'Please select a record before saving.',
				variant: 'warning'
			});
			this.dispatchEvent(warningEvent);
			return;
		}

		createComplianceDocument({recordId: this.recordId, type: this.objName, fileId: this.fileRecordId})
		.then(() => {
			const successEvent = new ShowToastEvent({
				title: 'Success!',
				message: 'Successfully created compliance document assignment.',
				variant: 'success'
			});
			this.dispatchEvent(successEvent);

			this.handleCloseModal();
		})
		.catch((error) => {
			const errorEvent = new ShowToastEvent({
				title: 'Error creating record!',
				message: 'Could not create compliance document assignment, please try again later.',
				variant: 'error'
			});
			this.dispatchEvent(errorEvent);
		});		
	}
}