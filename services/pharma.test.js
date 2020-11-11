import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
const pharmaService = require('./pharma')
// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

let mongoServer;
const opts = { useNewUrlParser: true, useUnifiedTopology: true }; // remove this option if you use mongoose 5 and above
let demoPharma
beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, opts, (err) => {
        if (err) console.error(err);
    });
    const medicineInfo = {
        medicine: "esmecta",
        quality: 100
    }
    const req = {
        value: {
            body: medicineInfo
        }
    }
    demoPharma = await pharmaService.create(req)
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('create function', () => {
    it('is success', async () => {
        const medicineInfo = {
            medicine: "panadol",
            quality: 10
        }
        const req = {
            value: {
                body: medicineInfo
            }
        }
        const result = await pharmaService.create(req)
        expect(result).toHaveProperty('medicine', 'panadol')
        expect(result).toHaveProperty('quality', 10)
    });

    it('is duplicate', async () => {
        const medicineInfo = {
            medicine: "panadol",
            quality: 10
        }
        const req = {
            value: {
                body: medicineInfo
            }
        }
        try {
            await pharmaService.create(req)
        } catch (e) {
            expect(e).toEqual(new Error("This medicine has already exist"));
        }
    });
});

describe('getListPagination function', () => {
    it('get success', async () => {
        const req = {
            value: {
                query: {
                    limit: 10,
                    page: 0
                }
            }
        }
        const result = await pharmaService.getListPagination(req)
        expect(result).toHaveProperty('items')
        expect(result.items).toHaveLength(2)
        expect(result.items[0]).toHaveProperty('medicine', demoPharma.medicine)
        expect(result.items[0]).toHaveProperty('quality', demoPharma.quality)
    });
})

describe('getMedicine function', () => {
    it('get detail with exist id', async () => {
        const req = {
            value: {
                params: {
                    id: demoPharma._id
                }
            }
        }
        const result = await pharmaService.getMedicine(req)
        expect(result).toHaveProperty('_id', demoPharma._id)
        expect(result).toHaveProperty('medicine', demoPharma.medicine)
        expect(result).toHaveProperty('quality', demoPharma.quality)
    });

    it('get detail with invalid id', async () => {
        const req = {
            value: {
                params: {
                    id: new mongoose.Types.ObjectId()
                }
            }
        }
        const result = await pharmaService.getMedicine(req)
        expect(result).toEqual(null)
    });
})

describe('editMedicine function', () => {
    it('edit exist id', async () => {
        const req = {
            value: {
                params: {
                    id: demoPharma._id
                },
                body: {
                    medicine: "esmecta123",
                    quality: 1000
                }
            }
        }
        const result = await pharmaService.editMedicine(req)
        expect(result).toHaveProperty('_id', demoPharma._id)
        expect(result).toHaveProperty('medicine', "esmecta123")
        expect(result).toHaveProperty('quality', 1000)
    });

    it('edit invalid id', async () => {
        const req = {
            value: {
                params: {
                    id: new mongoose.Types.ObjectId()
                },
                body: {
                    medicine: "esmecta",
                    quality: 1000
                }
            }
        }
        const result = await pharmaService.editMedicine(req)
        expect(result).toEqual(null)
    });

    it('duplicate medicine name', async () => {
        const req = {
            value: {
                params: {
                    id: new mongoose.Types.ObjectId()
                },
                body: {
                    medicine: "panadol",
                    quality: 1000
                }
            }
        }
        try {
            await pharmaService.editMedicine(req)
        } catch (e) {
            expect(e).toEqual(new Error("This medicine has already exist"));
        }
    });
})