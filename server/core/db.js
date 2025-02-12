import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
const createDbConnection = () => {
    const prisma = new PrismaClient().$extends(withAccelerate());
    const getSiteComplete = async (site) => {
        return await prisma.site.findFirst({
            where: { site },
        });
    };
    const getSiteDetails = async (site) => {
        return await prisma.site.findFirst({
            where: { site },
            select: { details: true },
        });
    };
    const getBoard = async (site) => {
        return await prisma.site.findFirst({
            where: { site },
            select: { board: true },
        });
    };
    const updateBoard = async (site, board) => {
        return await prisma.site.update({
            where: { site },
            data: { board },
        });
    };
    const saveLogs = async (logs) => {
        const date = logs[0].date;
        const site = logs[0].site;
        prisma.$transaction([
            prisma.log.deleteMany({ where: { date: date, site: site } }),
            prisma.log.createMany({ data: logs }),
        ]);
    };
    const tryCatchWrap = (fn) => async (...args) => {
        try {
            const result = await fn(...args);
            return result;
        }
        catch (err) {
            console.error(err);
        }
    };
    return {
        getSiteComplete: tryCatchWrap(getSiteComplete),
        getSiteDetails: tryCatchWrap(getSiteDetails),
        getBoard: tryCatchWrap(getBoard),
        updateBoard: tryCatchWrap(updateBoard),
        saveLogs: tryCatchWrap(saveLogs),
    };
};
export default createDbConnection;
