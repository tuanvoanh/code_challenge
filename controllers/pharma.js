const pharmaService = require('../services/pharma')

const getListMedicine = async (req, res, next) => {
    const listMedicine = await pharmaService.getListPagination(req)
    res.status(200).json(listMedicine)
}

const createNewMedicine = async (req, res, next) => {
    const newMedicine = await pharmaService.create(req)
    res.status(201).json({success: !!newMedicine})
}

const getMedicineById = async (req, res, next) => {
    const medicine = await pharmaService.getMedicine(req)
    res.status(200).json(medicine)
}

const editMedicine = async (req, res, next) => {
    const medicine = await pharmaService.editMedicine(req)
    console.log(medicine)
    res.status(200).json({success: !!medicine})
}
module.exports = {
    getListMedicine,
    createNewMedicine,
    getMedicineById,
    editMedicine,
}