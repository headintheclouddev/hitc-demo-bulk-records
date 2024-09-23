/**
 * hitc_inactivate_records_mr_done.ts
 * by Head in the Cloud Development, Inc.
 * gurus@headintheclouddev.com
 *
 * @NScriptName HITC - Inactivate Records - MR - Done
 * @NScriptType MapReduceScript
 * @NApiVersion 2.1
 */
define(["require", "exports", "N/log", "N/record", "N/runtime", "N/search"], function (require, exports, log, record, runtime, search) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.reduce = exports.map = exports.getInputData = void 0;
    exports.summarize = summarize;
    const getInputData = () => {
        const searchId = runtime.getCurrentScript().getParameter({ name: 'custscript_inactivate_mr_v2_saved_search' }); // It's required
        log.audit('getInputData', `Starting at ${new Date()} with search ${searchId}.`);
        const batches = [];
        // First, run the search with a count on internal ID to figure out how many total results it has
        const searchObj = search.load({ id: searchId });
        searchObj.columns = [search.createColumn({ name: 'internalid', summary: search.Summary.COUNT })];
        const results = searchObj.run().getRange({ start: 0, end: 1 });
        const count = results[0].getValue({ name: 'internalid', summary: search.Summary.COUNT });
        log.audit('getInputData', `Search ${searchId} has ${count} results.`);
        // In map, we're going to run the search once for every 1,000 results it has, so get ready to spin up that many instances of map()
        for (let i = 0; i < Number(count); i += 1000) {
            batches.push(searchId);
        }
        log.audit('getInputData', `Returning ${batches.length} batches for search ${searchId}.`);
        return batches;
    };
    exports.getInputData = getInputData;
    const map = (ctx) => {
        log.audit(`map ${ctx.key}`, `Identifying records for this batch at ${new Date()}.`);
        try { // Here we'll retrieve our specified batch of 1,000 results and pass their internal IDs to reduce to be updated.
            const start = Number(ctx.key) * 1000;
            const results = search.load({ id: ctx.value }).run().getRange({ start, end: start + 1000 });
            for (const result of results) {
                ctx.write({ key: ctx.key, value: { type: String(result.recordType), id: result.id } });
            }
        }
        catch (e) {
            log.error(`map ${ctx.key}`, `Failed: ${e.message}.`);
        }
    };
    exports.map = map;
    const reduce = ctx => {
        log.audit(`reduce ${ctx.key}`, `Processing at ${new Date()}: ${JSON.stringify(ctx.values)}`);
        try { // Now simply inactivate each of the 1,000 results passed to this instance of reduce
            ctx.values.forEach(value => {
                const recordToUpdate = JSON.parse(value);
                try {
                    record.submitFields({ type: recordToUpdate.type, id: recordToUpdate.id, values: { isinactive: true } });
                    log.debug(`reduce ${ctx.key}`, `Inactivated record ${recordToUpdate.id} at ${new Date()}`);
                }
                catch (e) {
                    log.error(`reduce ${ctx.key}`, `Failed to inactivate record ${recordToUpdate.id}: ${e.message}`);
                }
            });
        }
        catch (e) {
            log.error(`reduce ${ctx.key}`, e.message);
        }
    };
    exports.reduce = reduce;
    function summarize(context) {
        log.audit('summarize', `Finished at ${new Date()}, usage: ${context.usage}.`);
    }
});
