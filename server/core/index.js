import Board from "./board.js";
import createDbConnection from "./db.js";
// BOARD STORE
const createBoardStore = (site, mongoUri) => {
    const db = createDbConnection(mongoUri);
    let board;
    const getBoard = async () => {
        if (board) {
            return board;
        }
        const result = await db.getBoard(site);
        board = result.board;
        return board;
    };
    const boardReset = async () => {
        saveLogs();
        return applyUpdate(Board.reset)();
    };
    // LOGS
    const saveLogs = async () => {
        const result = await db.saveLogs(buildLogs(site, await getBoard()));
        if (result.insertedCount === 0) {
            throw new Error("Failed to save logs");
        }
        return result;
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
        try {
            const newBoard = fn(await getBoard(), ...args);
            // don't need to wait on database to update
            // start promise and return immediately
            db.updateBoard(site, newBoard).then((result) => {
                if (result.modifiedCount !== 1) {
                    console.error("Failed to update database");
                }
            });
            return { success: true, board: newBoard };
        }
        catch (err) {
            console.error(err);
            return { success: false, error: err };
        }
    };
    // EXPORTS
    const wrappedBoard = {};
    for (const key in Board) {
        wrappedBoard[key] = applyUpdate(Board[key]);
    }
    return {
        getBoard,
        boardReset,
        saveLogs,
        getSiteComplete: db.getSiteComplete,
        getSiteDetails: db.getSiteDetails,
        ...wrappedBoard,
    };
};
export default createBoardStore;
