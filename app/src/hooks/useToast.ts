import { toast, type ToastOptions } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const useToast = () => {
  const options: ToastOptions = {
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    position:"bottom-right"
  };
  
  const onSuccess = (message: string) => {
    toast.success(message, options);
  };
  const onError = (message: string) => {
    toast.error(message, options);
  };
  const onInfo = (message: string) => {
    toast.info(message, options);
  };
  const onWarning = (message: string) => {
    toast.warning(message, options);
  };
  return {
    onSuccess,
    onError,
    onInfo,
    onWarning,
  };
};

export default useToast;