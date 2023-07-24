const ViewType = {
    NEWEST: 0, BEST_SELLERS: 1, MOST_VIEWS: 2, LO_TO_HI: 3, HI_TO_LO: 4
}

const BookStatus = { SOLD: -1, PENDING: 0, AVAILABLE: 1 , ALL: 2}

const Gender = {MALE: 0, FEMALE: 1, OTHER: -1}

const OrderStatus = {
    PENDING: 0, PROCESSING: 1, COMPLETED: 2, CANCELED: -1, ALL: 3
}

const Role = {
    USER: 0, ADMIN: 1
}

module.exports = {ViewType, BookStatus, Gender, OrderStatus, Role}