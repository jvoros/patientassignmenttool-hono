import Board from "./board.js";
import createDbConnection from "./db.js";
import hydrate from "./hydrate.js";
// BOARD STORE
const createBoardStore = (siteName) => {
    const db = createDbConnection();
    let board;
    const site = siteName ?? "default";
    const getBoard = async () => {
        if (board) {
            return board;
        }
        const result = await db.getBoard(site);
        board = result.board;
        return board;
    };
    const getBoardHydrated = async () => {
        const board = await getBoard();
        return hydrate(board);
    };
    const refreshBoard = async () => {
        const result = await db.getBoard(site);
        board = result.board;
        return board;
    };
    const getSiteComplete = async () => {
        const result = await db.getSiteComplete(site);
        return result;
    };
    const getSiteDetails = async () => {
        const result = await db.getSiteDetails(site);
        return result.details;
    };
    const boardReset = async () => {
        saveLogs();
        return applyUpdate(Board.reset)();
    };
    // LOGS
    const saveLogs = async () => {
        try {
            const result = await db.saveLogs(buildLogs(site, await getBoard()));
            return result;
        }
        catch (error) {
            console.log(error);
        }
    };
    const getTotalAndSupervised = (shift) => {
        const total = Object.values(shift.counts).reduce((acc, count) => acc + count, 0);
        const supervised = shift.counts.supervised || 0;
        return { total, supervised };
    };
    const buildLogs = (site, board) => {
        const logs = [];
        for (const shiftId in board.shifts) {
            const shift = board.shifts[shiftId];
            const { total, supervised } = getTotalAndSupervised(shift);
            const log = {
                date: board.date,
                site,
                shift: shift.name,
                provider: `${shift.provider.first} ${shift.provider.last}`,
                patients: total,
                supervised: supervised,
            };
            logs.push(log);
        }
        return logs;
    };
    // APPLY UPDATE
    const applyUpdate = (fn) => async (...args) => {
        const newBoard = fn(await getBoard(), ...args);
        try {
            await db.updateBoard(site, newBoard);
        }
        catch (err) {
            console.error(err);
            return { success: false, error: err };
        }
        board = newBoard;
        return { success: true, board: newBoard };
    };
    // EXPORTS
    const wrappedBoard = {};
    for (const key in Board) {
        wrappedBoard[key] = applyUpdate(Board[key]);
    }
    return {
        getBoard,
        getBoardHydrated,
        refreshBoard,
        boardReset,
        saveLogs,
        getSiteComplete,
        getSiteDetails,
        ...wrappedBoard,
    };
};
export default createBoardStore;
