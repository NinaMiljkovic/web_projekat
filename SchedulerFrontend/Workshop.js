export class Workshop {
    constructor(id, name, organizerId, date, noOfSlots, categoryId) {
        this.id = id;
        this.name = name;
        this.organizerId = organizerId;
        this.date = date;
        this.noOfSlots = noOfSlots;
        this.categoryId = categoryId;
    }
}