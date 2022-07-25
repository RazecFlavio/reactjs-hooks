import { createContext, ReactNode, useState } from "react";

interface CreateCycleData {
    task: string;
    minutesAmount: number;
}

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interruptDate?: Date;
    finishedDate?: Date;
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
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds);
    }
    function markCurrentCycleAsFinished() {
        setCycles((state) =>
            state.map((c) => {
                if (c.id === activeCycleId) {
                    return { ...c, finishedDate: new Date() };
                } else {
                    return c;
                }
            })
        );
    }

    function createNewCycle(data: CreateCycleData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        };

        setCycles((state) => [...state, newCycle]);
        setActiveCycleId(newCycle.id);
        setAmountSecondsPassed(0);
    }
    function interruptCurrentCycle() {
        setCycles((state) =>
            state.map((c) => {
                if (c.id === activeCycleId) {
                    return { ...c, interruptDate: new Date() };
                } else {
                    return c;
                }
            })
        );
        setActiveCycleId(null);
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
