import { api, LightningElement, track } from 'lwc';

export default class QsydComplianceDocumentModal extends LightningElement {

	@api objName = 'Account';
	@api fieldsToCreate = ['Name','Rating','Phone','Industry', 'AccountNumber'];
  @api fields = ['Name'];
	@api displayFields = 'Name, Phone';
	@api iconName = 'standard:account';
	@api labelName = 'Account Name';

  handleCloseModal() {
		this.dispatchEvent(
			new CustomEvent('modalclick')
		);
	}

	handleLookup = (event) => {
		let data = event.detail.data;
		if(data && data.record) {
				console.log('Data of Selected Record: ', data.record);
				// populate the selected record in the correct parent Id field
				// this.allRecord[data.index][data.parentAPIName] = data.record.Id;
		}
		else {
				// clear the parent Id field
				// this.allRecord[data.index][data.parentAPIName] = undefined;
		}
}
}