const titleService = require('../../services/title.service');
const Util = require('../../utils/util');

class TitleController{

    getUserTitles = async(req, res) => {
        try {
            const sortType = req.query.sortType ?? 0;
            const pageSize = req.query.pageSize ?? 12;
            const page = req.query.page ?? 1;
            const status = req.query.status ?? 0;

            // console.log(pageSize, page, status)
            const titles = await titleService.getUserTitles(sortType, pageSize, page, status);
            
            return res.json(titles);

        }catch(err){
            return Util.throwError(res, err);
        }
    }

    getUserSearchingTitles = async(req, res) => {
        try {
            const sortType = req.query.sortType ?? 0;
            const pageSize = req.query.pageSize ?? 12;
            const page = req.query.page ?? 1;
            const status = req.query.status ?? 0;
            const body = req.body;
            console.log(body);

            console.log(sortType, pageSize, page, status)
            const titles = await titleService.getUserSearchingTitles(sortType, pageSize, page, status, body);
            
            return res.json(titles);

        }catch(err){
            return Util.throwError(res, err);
        }
    }
    
    getAllTitles = async(req, res) => {
        
        try {
            const titles = await titleService.getAll({}, false);

            for (let i in titles){
                delete titles[i].trend;
                delete titles[i].deletedAt;
            }
                
            return res.json(titles);

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    getTitle = async(req, res) => {

        try {

            const titleSlug = req.params.slug;

            let title = await titleService.findBySlug(titleSlug, false);

            if(!title) return res.status(404).json({message: "not found"});

            // increase trending
            title = await titleService.update(title._id, {trend: title.trend + 0.01});

            return res.json(title);

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    getSlugByID = async(req, res) => {

        try {

            const titleID = req.params.id;

            let slug = await titleService.getSlugByID(titleID, false);

            if(!slug) return res.status(404).json({message: "not found"});

            return res.json(slug);

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    createTitle = async (req, res) => {

        try {
            const body = req.body;
            body['name_en'] = Util.removeVietnameseTones(body.name);
            let authors_en = [];
            body.authors?.forEach(author => {
                authors_en.push(Util.removeVietnameseTones(author))
            });
            body['authors_en'] = authors_en;
        
            const title = await titleService.create(body);

            if(!title) return res.status(500).json({message: 'cannot create title'});
            return res.json(title);

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    updateTitleSold = async(req, res) => {

        try {
            const titleID = req.query.id;
            const sold = req.body.sold ?? 0;

            const title = await titleService.findById(titleID, false);
            if(!title) return res.status(404).json({message: 'not found'});
            console.log('day la title', title);
            title.sold = title.sold + sold;
            console.log('day la title sau', title);
            const nTitle = await titleService.update(titleID, {sold: title.sold});

            if(!nTitle) return res.status(404).json({message: 'update title failed'});

            return res.json(nTitle);

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    updateTitle = async(req, res) => {

        try {
            const titleID = req.query.id;
            const body = req.body;
            delete body.trend;

            const title = await titleService.update(titleID, body);

            if(!title) return res.status(404).json({message: 'not found'});

            return res.json(title);

        }catch(err){
            return Util.throwError(res, err);
        }

    }

    deleteTitle = async(req, res) => {

        try {
            const titleID = req.query.id;
            const currentTime = new Date();

            const title = await titleService.update(titleID, {deletedAt: currentTime});

            if(!title) return res.status(404).json({message: 'not found'});

            return res.json({message: 'delete successfully'});

        }catch(err){
            return Util.throwError(res, err);
        }

    }

}

module.exports = new TitleController;