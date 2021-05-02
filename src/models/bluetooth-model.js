export class BtConnectionModel{
    constructor({
        type,
        device,
        service,
        characteristic,
        serviceUUIDs,
    }){
        this.type = type;
        this.device = device;
        this.service = service || {};
        this.characteristic = characteristic || {};
        this.serviceUUIDs = serviceUUIDs || [];
    }
}

export class BtHistoryModel{
    constructor({
        type,
        id,
        name,
        address,
        serviceUUIDs,
    }){
        this.type = type;
        this.id = id || 'Desconhecido';
        this.name = name || 'Desconhecido';
        this.address = address || 'Desconhecido';
        this.serviceUUIDs = serviceUUIDs || [];
    }
}
