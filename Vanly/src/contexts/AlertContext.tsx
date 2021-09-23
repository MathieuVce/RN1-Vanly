import React, { createContext, useState, useEffect, useReducer } from "react";

import { showMessage } from "react-native-flash-message";

export const AlertContext = createContext<{
    Alerts: TAlerts;
}>({
    Alerts: {
        danger: () => {},
        send: () => {},
        success: () => {},
        warning: () => {},
    },
});

export interface IAlert {
    title: string;
    message: string;
    type: "danger" | "default" | "success" | "warning";
    duration?: number;
}

type TAlertPayload = {
    title: string;
    message: string;
    duration?: number;
};

type TAlertMethod = (value: TAlertPayload) => void;

type TAlerts = {
    danger: TAlertMethod;
    send: TAlertMethod;
    success: TAlertMethod;
    warning: TAlertMethod;
};

const reducer: (state: IAlert[], value: {
    action: "danger" | "default" | "success" | "warning" | "shift";
    alert?: TAlertPayload;
    alerts?: TAlertPayload[];
}) => IAlert[] = (state, { action, alert, alerts }) => {
    if (action === "shift") {
        state.shift();
        return state;
    } else if (alert) {
        return [
            ...state,
            {
                ...alert,
                type: action
            }
        ];
    } else if (alerts) {
        return [
            ...state,
            ...(alerts.map(alertValue => ({
                ...alertValue,
                type: action
            })))
        ];
    } else {
        return state;
    }
};

export const AlertProvier: React.FC = ({ children }) => {

    const [alerts, dispatchAlerts] = useReducer(reducer, []);
    const [isDisplaying, setIsDisplaying] = useState(false);

    useEffect(() => {
        if (alerts[0] && !isDisplaying) {
            setIsDisplaying(true);

            const alert = alerts[0];

            showMessage({
                backgroundColor: alert.type === "default" ? "white" : undefined,
                color: alert.type === "default" ? "#333" : undefined,

                message: alert.title,
                description: alert.message,
                type: alert.type,
                icon: alert.type,
                floating: true,
                duration: alert.duration ? alert.duration : 6000
            });

            setTimeout(() => {
                dispatchAlerts({ action: "shift" });
                setIsDisplaying(false);
            }, 6000);
        }
    }, [alerts, isDisplaying]);

    const Alerts: TAlerts = {
        danger: alert => dispatchAlerts({ action: "danger", alert }),
        send: alert => dispatchAlerts({ action: "default", alert }),
        success: alert => dispatchAlerts({ action: "success", alert }),
        warning: alert => dispatchAlerts({ action: "warning", alert }),
    };

    return (
        <AlertContext.Provider value={{
            Alerts
        }}>
            {children}
        </AlertContext.Provider>
    );
};