import { ActionTypes } from "./actions";

export interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interruptDate?: Date;
    finishedDate?: Date;
}

interface CyclesState {
    cycles: Cycle[];
    activeCycleId: string | null;
}

export function cyclesReducer(state: CyclesState, action: any) {
    switch (action.type) {
        case ActionTypes.ADD_NEW_CYCLE:
            return {
                ...state,
                cycles: [...state.cycles, action.payload.newCycle],
                activeCycleId: action.payload.newCycle.id,
            };
        case ActionTypes.INTERRUPT_CURRENT_CYCLE:
            return {
                ...state,
                cycles: state.cycles.map((c) => {
                    if (c.id === state.activeCycleId) {
                        return { ...c, interruptDate: new Date() };
                    } else {
                        return c;
                    }
                }),
                activeCycleId: null,
            };
        case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED:
            return {
                ...state,
                cycles: state.cycles.map((c) => {
                    if (c.id === state.activeCycleId) {
                        return { ...c, finishedDate: new Date() };
                    } else {
                        return c;
                    }
                }),
                activeCycleId: null,
            };
        default:
            return {
                ...state,
            };
    }
}
