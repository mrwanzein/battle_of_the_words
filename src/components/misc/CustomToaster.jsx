import { useEffect } from "react";
import toast, { Toaster, ToastBar, useToasterStore } from "react-hot-toast";
import { ToastXButton } from "../shared_styles/sharedStyles";
import { ImCross } from "react-icons/im";

const CustomToaster = () => {
    const { toasts } = useToasterStore();
    const TOAST_LIMIT = 1;

    useEffect(() => {
        toasts
            .filter((t) => t.visible) // Only consider visible toasts
            .filter((_, i) => i >= TOAST_LIMIT) // Is toast index over limit?
            .forEach((t) => toast.dismiss(t.id)); // Dismiss – Use toast.remove(t.id) for no exit animation
    }, [toasts]);

    return (
        <Toaster
            toastOptions={{
                style: {
                    maxWidth: "600px",
                    width: "600px"
                },
                error: {
                    style: {
                        background: "#ff3c3c",
                        color: "white"
                    },
                    icon: "⚠️"
                }
            }}
        >
            {(t) => (
                <ToastBar toast={t}>
                    {({ icon, message }) => (
                        <>
                            {icon}
                            {message}
                            {t.type !== 'loading' && (
                                <ToastXButton onClick={() => toast.dismiss(t.id)}><ImCross /></ToastXButton>
                            )}
                        </>
                    )}
                </ToastBar>
            )}
        </Toaster>
    )
};

export default CustomToaster;