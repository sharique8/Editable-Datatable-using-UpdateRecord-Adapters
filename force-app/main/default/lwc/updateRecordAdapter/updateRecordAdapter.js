import { LightningElement, wire } from 'lwc';
import { getListUi } from 'lightning/uiListApi'
import { updateRecord } from 'lightning/uiRecordApi'
import {ShowToastEvent} from 'lightning/platformShowToastEvent'
import CON_OBJ from '@salesforce/schema/Contact'



export default class UpdateRecordAdapter extends LightningElement {

    allcontacts
    draftValues = []
    columns = [
        { label: 'Id', fieldName: 'Id' },
        { label: 'Name', fieldName: 'Name' },
        { label: 'Title', fieldName: 'Title' },
        { label: 'Email', fieldName: 'Email', editable: true },
        { label: 'Phone', fieldName: 'Phone', editable: true }
    ]

    @wire(getListUi, {
        objectApiName: CON_OBJ,
        listViewApiName: 'AllContacts',
        pageSize: 10
    })
    listapihandler({ data, error }) {
        if (data) {
            //console.log(data);
            //this.allcontacts = data.records.records
            //console.log(this.allcontacts);
            this.formatData(data.records.records)
        }
        else {
            console.log(error)
        }
    }

    formatData(contacts) {
        this.allcontacts = contacts.map((con) => {
            return {
                'Id': this.getFieldValue(con, 'Id'),
                'Name': this.getFieldValue(con, 'Name'),
                'Title': this.getFieldValue(con, 'Title'),
                'Email': this.getFieldValue(con, 'Email'),
                'Phone': this.getFieldValue(con, 'Phone')
            }
        })
    }
    getFieldValue(con, fieldname) {
        return con.fields[fieldname].value
    }
    handleSave(event) {
        //console.log(event.detail);
        //console.log('Draft Values :' + JSON.stringify(event.detail.draftValues))
        const recordInputsFormat = event.detail.draftValues.map(draft => {
            const tempfields = { ...draft }
            return { fields: tempfields };
        })
        console.log('recordInputsFormat :' + JSON.stringify(recordInputsFormat));
        const responsePromise = recordInputsFormat.map(recordInput => updateRecord(recordInput))
        console.log('responsePromise: ' + responsePromise)
        Promise.all(responsePromise)
            .then(result => {
               this.showNotification('Sucess!!', 'Contact Updated Successfully', 'success')
               console.log('Success')
               
            })
            .catch(error=>{
                this.showNotification('Failed!!', 'Error', 'error')
            })  
            console.log('Defult drfat values')
            this.draftValues = [];
    }
    showNotification(title, message, variant) {
        const evt = new ShowToastEvent({
            title:title,
           message:message,
         variant:variant,
        });
        this.dispatchEvent(evt);
    }
}