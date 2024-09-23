/**
 * hitc_inactivate_records_mr.ts
 *
 * @NScriptName HITC - Inactivate Records - MR
 * @NScriptType MapReduceScript
 * @NApiVersion 2.1
 */
define(["require", "exports", "N/log"], function (require, exports, log) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.reduce = exports.map = exports.getInputData = void 0;
    exports.summarize = summarize;
    const getInputData = () => {
    };
    exports.getInputData = getInputData;
    const map = (ctx) => {
        try {
        }
        catch (e) {
            log.error(`map ${ctx.key}`, `Failed: ${e.message}.`);
        }
    };
    exports.map = map;
    const reduce = ctx => {
        try {
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
