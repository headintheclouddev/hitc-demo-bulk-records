/**
 * hitc_inactivate_records_mr.ts
 *
 * @NScriptName HITC - Inactivate Records - MR
 * @NScriptType MapReduceScript
 * @NApiVersion 2.1
 */

import {EntryPoints} from "N/types";
import log     = require('N/log');

export const getInputData: EntryPoints.MapReduce.getInputData = (  ) => { // V3: Each reduce will process a batch of 1000 search results

};

export const map: EntryPoints.MapReduce.map = (ctx) => {
  try {

  } catch(e) {
    log.error(`map ${ctx.key}`, `Failed: ${e.message}.`);
  }
}

export const reduce: EntryPoints.MapReduce.reduce = ctx => {
  try {

  } catch(e) {
    log.error(`reduce ${ctx.key}`, e.message);
  }
};

export function summarize(context: EntryPoints.MapReduce.summarizeContext) {
  log.audit('summarize', `Finished at ${new Date()}, usage: ${context.usage}.`);
}
