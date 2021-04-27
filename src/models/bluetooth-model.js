export class BtConnectionModel{
    constructor({
        type,
        device,
        service,
        characteristic,
    }){
        this.type = type;
        this.device = device;
        this.service = service || {};
        this.characteristic = characteristic || {};
    }
}

export class BtHistoryModel{
    constructor({
        id,
        name,
        address,
    }){
        this.id = id || 'Desconhecido';
        this.name = name || 'Desconhecido';
        this.address = address || 'Desconhecido';
    }
}
