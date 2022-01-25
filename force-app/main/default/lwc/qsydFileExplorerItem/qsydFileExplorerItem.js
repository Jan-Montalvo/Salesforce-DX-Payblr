/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {LightningElement, api, track} from 'lwc';
import { deleteRecord } from 'lightning/uiRecordApi';
import formFactor from '@salesforce/client/formFactor';
import {NavigationMixin} from 'lightning/navigation';
import {item} from 'c/qsydFileExplorerCommon';
import {CONSTANTS} from 'c/qsydFileExplorerCommon';
import isCommunity
	from '@salesforce/apex/qsydFileExplorerController.isCommunity';
import getCommunityPrefix
	from '@salesforce/apex/qsydFileExplorerController.getCommunityPrefix';
import getLatestContentVersion
	from '@salesforce/apex/qsydFileExplorerController.getLatestContentVersion';

const FILE_DOWNLOAD = '/sfc/servlet.shepherd/document/download/';

export default class QsydFileExplorerItem extends NavigationMixin(
	LightningElement) {
	@api selectedItemId;
	@api type;

	_error;
	_item;
	_contentVersion;

	CONSTANTS = CONSTANTS;
	currentPagePrefix = '';
	showPreview = true;
	isFile = false;
	showModal = false;

	@track objName = 'Account';
	@track fieldsToCreate = ['Name','Rating','Phone','Industry', 'AccountNumber'];
	@track fields = ['Name'];
	@track displayFields = 'Name, Phone';
	@track iconName = 'standard:account';
	@track labelName = 'Account Name';

	connectedCallback() {
		this.environmentCheck();
	}
	
	environmentCheck() {
		isCommunity().then(result => {
			this.showPreview = !result;
		}).catch(error => {
			this.error = error;
		});

		getCommunityPrefix().then(result => {
			if (result != null) {
				this.currentPagePrefix = result;
			}
		}).catch(error => {
			this._error = error;
		});

	}

	refreshFileList() {
		this.dispatchEvent(
			new CustomEvent(CONSTANTS.CUSTOM_DOM_EVENT_TYPES.ITEM_ACTION, {
				detail: CONSTANTS.ACTION_TYPES.REFRESH,
			}),
		);
	}


	handleClick(e) {
		this.dispatchEvent(
			new CustomEvent('itemclick', {
				detail: this.item,
			}),
		);

		if (formFactor != 'Large' && this.item.documentId) {
			// this.navigateToFilePreviewPage();
		}
	}

	handleShowModal() {
		this.showModal = !this.showModal;
	}

	handleAssignAccount(e) {
		console.log('Assigning Account Event: ', e);
		this.objName = 'Account';
	  this.fieldsToCreate = ['Name','Rating','Phone','Industry', 'AccountNumber'];
	  this.fields = ['Name'];
	  this.displayFields = 'Name, Phone';
	  this.iconName = 'standard:account';
		this.labelName = 'Account Name';
		this.handleShowModal();
	}

	handleAssignContact(e) {
		console.log('Assigning Contact Event: ', e);
		this.objName = 'Contact';
		this.fieldsToCreate = ['Name','Title','Phone','Department', 'Email'];
	  this.fields = ['Name'];
	  this.displayFields = 'Name, Title';
	  this.iconName = 'standard:contact';
		this.labelName = 'Contact Name';
		this.handleShowModal();
	}

	handleFileDelete() {
		deleteRecord(this.item.documentId)
		.then(() => {
			this.refreshFileList();
		})
		.catch( error => {
			this.dispatchEvent(
				new ShowToastEvent({
					title: 'Error deleting file',
					message: error,
					variant: 'error'
				})
			);
		});
	}

	getLatestContentVersion() {
		if (this._contentVersion != null) {
			return;
		}
		getLatestContentVersion({
			contentDocumentId: this._item.documentId,
		}).then(result => {
			let res = JSON.parse(result);
			if (res) {
				this._contentVersion = res;
			}
		}).catch(error => {
			this._error = error;
		});
	}

	@api
	get item() {
		return this._item;
	}

	set item(value) {
		this._item = value;
		this._contentVersion = null;
		if (this._item && this._item.documentId) {
			this.getLatestContentVersion();
		}
	}

	get documentId() {
		return this.item.documentId;
	}

	get filesize() {
		if (this.item.size == 0 || this.item.size == null ||
			isNaN(this.item.size)) {
			return '0.00 B';
		}
		let e = Math.floor(Math.log(this.item.size) / Math.log(1024));
		return (this.item.size / Math.pow(1024, e)).toFixed(2) + ' ' +
			' KMGTP'.charAt(e) + 'B';
	}

	get isContentVersionReady() {
		return (this._contentVersion);
	}

	get lastModifiedDate() {
		let dtParse = Date.parse(this._contentVersion.LastModifiedDate);
		let dt = new Date(dtParse);
		let dtString = (dt.getMonth()+1)+'/'+dt.getDate()+'/'+dt.getFullYear();

		return dtString;
	}

	get itemClass() {
		return 'itemContainer ' +
			(this.item.id == this.selectedItemId ? 'itemSelected' : '');
	}

	get itemIcon() {
		if (this.type == 'folder') {
			this.isFile = false;
			return 'doctype:folder';
		} else {
			this.isFile = true;
			let fileType = this.item.type.toLowerCase();

			switch (fileType) {
				case 'jpg':
					return 'doctype:image';
				case 'jpeg':
					return 'doctype:image';
				case 'png':
					return 'doctype:image';
				case 'gif':
					return 'doctype:image';
				case 'csv':
					return 'doctype:csv';
				case 'excel_x':
					return 'doctype:excel';
				case 'xls':
					return 'doctype:excel';
				case 'word_x':
					return 'doctype:gdoc';
				case 'doc':
					return 'doctype:gdoc';
				case 'docx':
					return 'doctype:gdoc';
				case 'pdf':
					return 'doctype:pdf';
				case 'power_point_x':
					return 'doctype:ppt';
				case 'ppt':
					return 'doctype:ppt';
				case 'pptx':
					return 'doctype:ppt';
				case 'xml':
					return 'doctype:xml';
				case 'txt':
					return 'doctype:txt';
				case 'js':
					return 'doctype:html';
				case 'css':
					return 'doctype:html';
				case 'html':
					return 'doctype:html';
				case 'php':
					return 'doctype:html';
				case 'zip':
					return 'doctype:zip';
				case 'rar':
					return 'doctype:zip';
				case '7zip':
					return 'doctype:zip';
				default:
					return 'doctype:unknown';
			}
			// return 'doctype:unknown';
		}
	}

	get showPreview() {
		return this.showPreview;
	}
	
	get downloadLink() {
		return this.currentPagePrefix + FILE_DOWNLOAD + this.item.documentId;
	}


	navigateToFilePreviewPage() {
		this[NavigationMixin.Navigate]({
			type: this.CONSTANTS.NAVIGATION_TYPES.NAMED_PAGE,
			attributes: {
				pageName: 'filePreview',
			},
			state: {
				recordIds: this.item.documentId,
				selectedRecordId: this.item.documentId,
			},
		});
	}

	navigateToFileRecordPage() {
		this[NavigationMixin.Navigate]({
			type: this.CONSTANTS.NAVIGATION_TYPES.RECORD_PAGE,
			attributes: {
				recordId:  this.item.documentId,
				actionName: this.CONSTANTS.NAVIGATION_ACTIONS.VIEW,
			},
		});
	}
	
}