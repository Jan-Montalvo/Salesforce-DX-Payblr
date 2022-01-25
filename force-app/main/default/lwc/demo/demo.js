import { LightningElement } from 'lwc';

export default class LookupDemo extends LightningElement {
    fieldsToCreate = ['Name','Rating','Phone','Industry'];
    fields        = ['Name'];
    handleLookup = (event) => {
        let data = event.detail.data;
        if(data && data.record) {
            console.log('Data of Selected Record: ', data);
            // populate the selected record in the correct parent Id field
            // this.allRecord[data.index][data.parentAPIName] = data.record.Id;
        }
        else {
            // clear the parent Id field
            // this.allRecord[data.index][data.parentAPIName] = undefined;
        }
    }
}