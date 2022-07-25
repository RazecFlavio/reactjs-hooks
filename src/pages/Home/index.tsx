import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { HandPalm, Play } from "phosphor-react";
import {
    HomeContainer,
    StartCountdownButton,
    StopCountdownButton,
} from "./styles";
import { useContext } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { CountDown } from "./components/Countdown";
import { CyclesContext } from "../../contexts/CyclesContext";

export function Home() {
    const { createNewCycle, interruptCurrentCycle, activeCycle } =
        useContext(CyclesContext);

    const newCycleFormValidationSchema = zod.object({
        task: zod.string().min(1, "Informe a tarefa"),
        minutesAmount: zod
            .number()
            .min(1, "o ciclo precisa ter pelo menos 5 minutos.")
            .max(60, "o ciclo precisar ser no maximo de 60 minutos"),
    });
    type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>; //Cria um interface baseado no Schemma do zod.

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: "",
            minutesAmount: 0,
        },
    });
    const { handleSubmit, watch, reset, formState } = newCycleForm;

    function handleCreateNewCycle(data: NewCycleFormData) {
        createNewCycle(data);
        reset();
    }
    console.log(formState.errors);

    const isSubmitDisabled = watch("task");

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                <FormProvider {...newCycleForm}>
                    <NewCycleForm />
                </FormProvider>

                <CountDown />

                {activeCycle ? (
                    <StopCountdownButton onClick={interruptCurrentCycle}>
                        <HandPalm size={24} />
                        Interromper
                    </StopCountdownButton>
                ) : (
                    <StartCountdownButton
                        disabled={!isSubmitDisabled}
                        type="submit"
                    >
                        <Play size={24} />
                        Começar
                    </StartCountdownButton>
                )}
            </form>
        </HomeContainer>
    );
}
