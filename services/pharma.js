const Pharma = require("../models/Pharma");

const create = async (req) => {
    const { medicine, quality } = req.value.body;
    const isExist = await Pharma.findOne({ medicine })
    if (isExist) {
        throw new Error("This medicine has already exist")
    }
    return await Pharma.create({ medicine, quality });
}

const getListPagination = async (req) => {
    const limit = req.value.query.limit;
    const page = req.value.query.page;
    const skip = page * limit;
    const listMedicine = await Pharma.find({})
        .skip(skip)
        .limit(limit);
    const total = await Pharma.find({}).count();
    return {
        total_item: total,
        total_page: Math.ceil(total / limit),
        per_page: limit,
        current_page: page,
        items: listMedicine,
    };
}

const getMedicine = async (req) => {
    return await Pharma.findById(req.value.params.id)
}

const editMedicine = async (req) => {
    const { medicine, quality } = req.value.body;
    const id = req.value.params.id
    const isExist = await Pharma.findOne({ medicine, _id: { $ne: id } })
    if (isExist) {
        throw new Error("This medicine has already exist")
    }
    return await Pharma.findOneAndUpdate({ _id: id }, { $set: { medicine, quality } }, {
        new: true
    })
}

module.exports = {
    create,
    getListPagination,
    getMedicine,
    editMedicine,
}