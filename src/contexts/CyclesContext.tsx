import { differenceInSeconds } from "date-fns";
import {
    createContext,
    ReactNode,
    useEffect,
    useReducer,
    useState,
} from "react";
import {
    addNewCycleAction,
    interruptCurrentCycleAction,
    markCurrentCycleAsFinishedAction,
} from "../reducers/cycles/actions";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";

interface CreateCycleData {
    task: string;
    minutesAmount: number;
}

interface CyclesContextType {
    cycles: Cycle[];
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    amountSecondsPassed: number;
    markCurrentCycleAsFinished: () => void;
    setSecondsPassed: (seconds: number) => void;
    createNewCycle: (data: CreateCycleData) => void;
    interruptCurrentCycle: () => void;
}

export const CyclesContext = createContext({} as CyclesContextType);
interface CyclesContextProviderProps {
    children: ReactNode;
}

export function CyclesContextProvider({
    children,
}: CyclesContextProviderProps) {
    const [cyclesState, dispatch] = useReducer(
        cyclesReducer,
        {
            cycles: [],
            activeCycleId: null,
        },
        () => {
            const storedStateAsJSON = localStorage.getItem(
                "@timer:cycles-state-1.0.0"
            );
            if (storedStateAsJSON) {
                return JSON.parse(storedStateAsJSON);
            }
        }
    );
    const { cycles, activeCycleId } = cyclesState; // const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
        if (activeCycle)
            return differenceInSeconds(
                new Date(),
                new Date(activeCycle.startDate)
            );
        return 0;
    });

    useEffect(() => {
        const stateJSON = JSON.stringify(cyclesState);
        localStorage.setItem("@timer:cycles-state-1.0.0", stateJSON);
    }, [cyclesState]);

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds);
    }
    function markCurrentCycleAsFinished() {
        dispatch(markCurrentCycleAsFinishedAction());
        // setCycles((state) =>
        //     state.map((c) => {
        //         if (c.id === activeCycleId) {
        //             return { ...c, finishedDate: new Date() };
        //         } else {
        //             return c;
        //         }
        //     })
        // );
    }

    function createNewCycle(data: CreateCycleData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        };

        // setCycles((state) => [...state, newCycle]);
        dispatch(addNewCycleAction(newCycle));
        // setActiveCycleId(newCycle.id);
        setAmountSecondsPassed(0);
    }
    function interruptCurrentCycle() {
        dispatch(interruptCurrentCycleAction());
        // setCycles((state) =>
        //     state.map((c) => {
        //         if (c.id === activeCycleId) {
        //             return { ...c, interruptDate: new Date() };
        //         } else {
        //             return c;
        //         }
        //     })
        // );
        // setActiveCycleId(null);
    }
    return (
        <CyclesContext.Provider
            value={{
                cycles,
                activeCycle,
                activeCycleId,
                markCurrentCycleAsFinished,
                amountSecondsPassed,
                setSecondsPassed,
                createNewCycle,
                interruptCurrentCycle,
            }}
        >
            {children}
        </CyclesContext.Provider>
    );
}
