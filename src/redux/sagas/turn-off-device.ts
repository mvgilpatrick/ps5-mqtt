import createDebugger from "debug";
import { merge } from "lodash";
import { put } from "redux-saga/effects";
import sh from "shelljs";
import { createErrorLogger } from "../../util/error-logger";
import { setTransitioning, updateHomeAssistant } from "../action-creators";
import type { ApplyToDeviceAction } from "../types";

const debug = createDebugger("@ha:ps5:turnOffDevice");
const debugError = createErrorLogger();

function* turnOffDevice(action: ApplyToDeviceAction) {
    if (action.payload.mode !== 'STANDBY') {
        return;
    }

    yield put(
        setTransitioning(
            merge({}, action.payload.device, { transitioning: true })
        )
    );
    try {
        debug(
            sh.exec(
                `playactor standby --ip ${action.payload.device.address.address}`,
                { silent: true }
            )
        );
        yield put(
            updateHomeAssistant(
                merge({}, action.payload.device, { status: "STANDBY" })
            )
        );
    } catch (e) {
        debugError(e);
    }
}

export { turnOffDevice };

