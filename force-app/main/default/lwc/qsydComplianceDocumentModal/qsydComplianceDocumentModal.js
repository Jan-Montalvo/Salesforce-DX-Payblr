import { LightningElement } from 'lwc';

export default class QsydComplianceDocumentModal extends LightningElement {
  handleCloseModal() {
		this.dispatchEvent(
			new CustomEvent('modalclick')
		);
	}
}