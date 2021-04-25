export class BtConnectionModel{
    constructor({
        device,
        service,
        characteristic,
    }){
        this.device = device;
        this.service = service;
        this.characteristic = characteristic;
    }
}
