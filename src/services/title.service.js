const {Title, TitleDTO} = require('../app/models/title.model');
const Book = require('../app/models/book.model');
const {ViewType, BookStatus} = require('../configs/global');
const Util = require('../utils/util');

class TitleService{

    getUserTitles = async(type = 0, pageSize = 12, page = 1, status = 0) => {

        let sortedBy;

        switch (+type) {
            case ViewType.BEST_SELLERS:
                sortedBy = {sold: -1, createdAt: -1}; 
                break;
            case ViewType.MOST_VIEWS:
                sortedBy = {trend: -1, createdAt: -1}; 
                break; 
            case ViewType.LO_TO_HI:
                sortedBy = {price: 1, createdAt: -1}; 
                break;
            case ViewType.HI_TO_LO:
                sortedBy = {price: -1, createdAt: -1}; 
                break; 
            default:
                sortedBy = {createdAt: -1};     
        }

        let statusOption;
        if(status == 1)
            statusOption = { $ne: 0}
        else statusOption = { $ne: -1}

        // if(type == ViewType.BEST_SELLERS)
        //     sortedBy = {sold: -1, createdAt: -1};   
        // else if(type == ViewType.MOST_VIEWS)
        //     sortedBy = {trend: -1, createdAt: -1}; 
        // else sortedBy = {createdAt: -1};
        
        const titles = await Title.aggregate([
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "titleID",
                    as: "books"
                }
            },
            { $sort: sortedBy },
            {
                $project: {
                    _id: 1,
                    image: 1,
                    name: 1,
                    price: 1,
                    slug: 1,
                    sold: 1,
                    quantity: {
                        $size: {
                            $filter: {
                                input: '$books',
                                as: 'book',
                                cond: {
                                    $eq: ['$$book.status', BookStatus.AVAILABLE]
                                }
                            }
                        }
                        
                    }
                }
            },
            { 
                $match: {
                    quantity: statusOption
                }
            },
            { $skip: (+page - 1) * +pageSize },
            { $limit: +pageSize },
          ]);

        return titles;

    }

    getUserSearchingTitles = async(type = 0, pageSize = 12, page = 1, status = 0, options = {}) => {

        let sortedBy;

        switch (+type) {
            case ViewType.BEST_SELLERS:
                sortedBy = {sold: -1, createdAt: -1}; 
                break;
            case ViewType.MOST_VIEWS:
                sortedBy = {trend: -1, createdAt: -1}; 
                break; 
            case ViewType.LO_TO_HI:
                sortedBy = {price: 1, createdAt: -1}; 
                break;
            case ViewType.HI_TO_LO:
                sortedBy = {price: -1, createdAt: -1}; 
                break; 
            default:
                sortedBy = {createdAt: -1};     
        }
        console.log('type la', sortedBy);

        let statusOption;
        if(status == 1)
            statusOption = { $ne: 0}
        else statusOption = { $ne: -1}

        let priceOptions = [{price: {$ne: -1}}]
        if(options.priceOptions && options.priceOptions.length != 0){
            console.log('priceOptions size:', options.priceOptions.length)
            const tmpOptions = options.priceOptions;
            const size = options.priceOptions.length;
            for(let i=0 ; i<size ; i++)
                priceOptions[i] = {$and: [{price: {$gte: tmpOptions[i].min}}, {price: {$lte: tmpOptions[i].max}}]}
        
            console.log(JSON.stringify(priceOptions))
        }

        let pageOptions = [{page: {$ne: -1}}]
        if(options.pageOptions && options.pageOptions.length != 0){
            console.log('pageOptions size:', options.pageOptions.length)
            const tmpOptions = options.pageOptions;
            const size = options.pageOptions.length;
            for(let i=0 ; i<size ; i++)
                pageOptions[i] = {$and: [{page: {$gte: tmpOptions[i].min}}, {page: {$lte: tmpOptions[i].max}}]}
        
            console.log(JSON.stringify(pageOptions))
        }
        
        let pYearOptions = [{pYear: {$ne: -1}}]
        if(options.pYearOptions && options.pYearOptions.length != 0){
            console.log('pYearOptions size:', options.pYearOptions.length)
            const tmpOptions = options.pYearOptions;
            const size = options.pYearOptions.length;
            for(let i=0 ; i<size ; i++)
                pYearOptions[i] = {$and: [{pYear: {$gte: tmpOptions[i].min}}, {pYear: {$lte: tmpOptions[i].max}}]}
        
            console.log(JSON.stringify(pYearOptions))
        }

        let categoryOptions = [{category: {$ne: -1}}]
        if(options.category && options.category.length == 1)
           categoryOptions[0] = {'category.0': {$eq: options.category[0]}}
        else if(options.category && options.category.length == 2){
            categoryOptions[0] = {'category.0': {$eq: options.category[0]}}
            categoryOptions[1] = {'category.1': {$eq: options.category[1]}}
        }
        console.log(JSON.stringify(categoryOptions))

        let query = Util.removeVietnameseTones(options.query); 
        console.log(query)
        
        const titles = await Title.aggregate([
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "titleID",
                    as: "books"
                }
            },
            { $sort: sortedBy },
            {
                $project: {
                    _id: 1,
                    name: 1, name_en: 1,
                    authors: 1, authors_en: 1,
                    price: 1, pYear: 1, page: 1, category: 1,
                    slug: 1, sold: 1, image: 1,
                    quantity: {
                        $size: {
                            $filter: {
                                input: '$books',
                                as: 'book',
                                cond: {
                                    $eq: ['$$book.status', BookStatus.AVAILABLE]
                                }
                            }
                        }
                        
                    }
                }
            },
            { 
                $match: {
                    $and: [
                        {quantity: statusOption},
                        // $and: [
                        //     {'category.0': {$eq: 0}},
                        //     {'category.1': {$eq: 5}}
                        // ],
                        {$and: categoryOptions},
                        //
                        {$or: [
                            { authors_en: { $elemMatch: { $regex: query , $options: 'i'} } }, 
                            { name_en: { $regex: query , $options: 'i'} }
                        ]},
                        // $or: [
                        //     {$and: [{price: {$gte: 0}}, {price: {$lte: 100000}}]},
                        //     {$and: [{price: {$gte: 300000}}, {price: {$lte: 500000}}]}
                        // ],
                        {$or: priceOptions},
                        // $or: [
                        //     {$and: [{page: {$gte: 0}}, {page: {$lte: 100}}]},
                        //     // {$and: [{page: {$gte: 300}}, {page: {$lte: 500}}]}
                        // ],
                        {$or: pageOptions},
                        // $or: [
                        //     {$and: [{pYear: {$gte: 0}}, {pYear: {$lte: 1995}}]},
                        //     {$and: [{pYear: {$gte: 2015}}, {pYear: {$lte: 2020}}]}
                        // ]
                        {$or: pYearOptions},
                    ]
                }
            },
            { $skip: (+page - 1) * +pageSize },
            { $limit: +pageSize },
          ]);

        return titles;

    }
    
    getAll = async(query, containingDeletedItems) => {
    
        if(!containingDeletedItems) query['deletedAt'] = null;

        const titles = await Title.find(query);

        for (let i in titles){
            let title = titles[i];
            titles[i] = await this.countQuantity(title.toObject());
        }
        
        return titles;

    }

    findBySlug = async(slug, dto = true) => {

        let title = await Title.findOne({slug: slug, deletedAt: null});

        if(!title) return title;

        title = await this.countQuantity(title);
        return dto ? new TitleDTO(title) : title.toObject();

    }

    findById = async(titleID, containingDeletedItems) => {
        let title;
        if(containingDeletedItems) title = await Title.findOne({_id: titleID});
        else title = await Title.findOne({_id: titleID, deletedAt: null});

        if(!title) return title;

        title = await this.countQuantity(title);
        return new TitleDTO(title);
    }

    getSlugByID = async(titleID, containingDeletedItems) => {
        let slug;
        if(containingDeletedItems) slug = await Title.findOne({_id: titleID}).select('slug');
        else slug = await Title.findOne({_id: titleID, deletedAt: null}).select('slug');

        return slug;
    }

    checkExistedId = async(titleID) => {
        return await Title.exists({_id: titleID, deletedAt: null});
    }

    update = async(titleID, data) => {

        await Title.findOneAndUpdate({_id: titleID}, data);
        let nTitle = await Title.findById(titleID);

        if(!nTitle) return nTitle;

        nTitle = await this.countQuantity(nTitle);
        return new TitleDTO(nTitle);

    }

    create = async(title) => {
     
        let nTitle = await Title.create(title);
        if(!nTitle) return nTitle;

        return new TitleDTO(nTitle);

    }

    countQuantity = async(title) => {
        title.quantity = await Book.countDocuments({titleID: title._id, status: BookStatus.AVAILABLE});
        return title;
    }
    
}

module.exports = new TitleService;